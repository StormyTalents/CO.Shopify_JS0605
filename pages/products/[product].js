import Head from 'next/head'
import SEO from '@/components/SEO'
import { useEffect, useState } from 'react';
import { getProduct, getProdNeeded, getCollectionDetailRichText } from '@/lib/shopify'
import ProductSection from '@/components/product/ProductSection'
import { getAllProducts, getContenfulData, getSumaryReview} from '@/lib/cache'
import { getRelatedBlogPost, getNavDataNeeded, getRichTextDataNeeded, getTechIco, getPdpBadge} from '@/lib/contentful'
import { singleReview, singleQuestions, singleReviewPhoto, getReviewNeeded } from '@/lib/review'
import { getNostoProd } from '@/utils/helpers'
import cookieCutter from 'cookie-cutter'
import { useCartContext } from '@/context/Store'
import { dl_view_item } from '@/lib/dataLayer'
import { useRouter } from 'next/router'
import axios from 'axios'
import useSWR from 'swr'
 
function ProductPage({ productData, blogPost, reviews, reviewsPhoto, questions, chainProduct, richTextBasicData, mainChainSlug, sizeChartContent, productsCollection }) {

  const router = useRouter()

  let prodId = null
  if(productData.id) {
    const globalProdId = Buffer.from(productData.id, 'base64').toString('binary')
    prodId = globalProdId.replace("gid://shopify/Product/", "")
  }


  const [relatedProd, setRelatedProd] = useState(null)
  async function getRelatedProd() {
    const currentSessionId = cookieCutter.get('_cns')
    let sessionId
    if(currentSessionId) {
      sessionId = currentSessionId
    } else {
      const getSession = await getNostoProd("session")
      sessionId = getSession.product
      let date = new Date()
      date.setTime(date.getTime() + (340 * 24 * 60 * 60 * 1000))
      cookieCutter.set('_cns', getSession.product, { expires: date, path:"/" })
    }
    const productPageProd = await getNostoProd("pdp", sessionId, prodId)
    setRelatedProd(productPageProd.product)
  }

  useEffect(() => {

    getRelatedProd()

    if (typeof window !== 'undefined') {
        setTimeout(function(){ console.log("init data layer 3"); dl_view_item(productData); }, 1000);
    }

    if(mainChainSlug) {
      router.push(mainChainSlug)
    }

  }, [router.asPath]);

  const fetchInventory = (url, id) => axios.get(url, {params: {id: id,},}).then((res) => res.data)
    
    let prodQuantity = []
    let prodIds = []
    if(chainProduct != null) {
      prodIds.push(prodId)
      for (let i = 0 ; i < chainProduct.length; i++) {
        const chainProdId = Buffer.from(chainProduct[i].id, 'base64').toString('binary').replace("gid://shopify/Product/", "")
        prodIds.push(chainProdId)
      }
      const prodIdsString = prodIds.toString()
      const { data } = useSWR(['/api/product-inventory', prodIdsString],(url, id) => fetchInventory(url, id),{ errorRetryCount: 2 })
      prodQuantity = data
    }
    else {
        const { data }  = useSWR(['/api/product-inventory', prodId],(url, id) => fetchInventory(url, id),{ errorRetryCount: 2 })
        prodQuantity = data
    }

    const checkoutUrl = useCartContext()[1]
    if (typeof window !== "undefined") {
      if (prodId == 4834022391913) {
        window.Rise =  {
          "is_product_page": true,
          "cart": { "token": checkoutUrl.replace('https://aftco-test.myshopify.com/11277790/checkouts/','')},
          "using_add_to_cart_flow": false,
          "is_floating_cart_theme": true,
          "product": {  "id": 4834022391913},
          "full_product": {  "available": true } }
      }
    }

    return (
      <div className="min-h-screen py-12 sm:pt-20">
        <SEO title={productData.seo.title?productData.seo.title:productData.title} description={productData.seo.description?productData.seo.description:null}/> 

        { productData.id == "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzQ4MzQwMjIzOTE5MTM="?
          <Head>
            <script async src='https://str.rise-ai.com/?shop=aftco-test.myshopify.com' />
          </Head>
        :""}
        {productData.id ?
        <ProductSection 
          productData={productData} 
          richTextBasicData={richTextBasicData}
          blogPost={blogPost}  
          productQuantityData={prodQuantity} 
          reviews={reviews} 
          reviewsPhoto={reviewsPhoto} 
          questions={questions} 
          relatedProd={relatedProd} 
          chainProduct={chainProduct}
          sizeChartContent={sizeChartContent}
          productsCollection={productsCollection}
        />
        :<h1>Product Data Not Found</h1>}
      </div>
  )
}

export async function getStaticPaths() {
  //const productSlugs = await getAllProducts()
  //const fallbackStatus = process.env.FALLBACK
  //let paths
  //if(fallbackStatus == "live") {
  //  paths = productSlugs.map((slug) => {    
  //    const product = String(slug.node.handle)
  //    return {
  //      params: {product}
  //    }
  //  })
  //} else {
  //  paths = []
  //}
  
  return {
    paths: [],
    fallback: "blocking",
  }
}

export async function getStaticProps({ params }) {
  
  const productSlugs = await getAllProducts()
  const productData = await getProduct(params.product)
  const contenfulData = await getContenfulData()
  const techIco = await getTechIco()
  const pdpBadge = await getPdpBadge()
  const searchPopular = contenfulData.searchPopular

  let realProdId = null
  let reviews = null
  let reviewsPhoto = null
  let questions = null
  let blogPost = null

  if (productData.id) {
    const prodIdsUrl = Buffer.from(productData.id, 'base64').toString('binary')
    realProdId = prodIdsUrl.replace("gid://shopify/Product/", "")
    reviews = await singleReview(realProdId)
    reviewsPhoto = await singleReviewPhoto(realProdId)
    questions = await singleQuestions(encodeURI(productData.title))

    const blog = await getRelatedBlogPost(params.product, productData.collections.edges, productData.productType )
    blogPost = await blog.map((n) => {
      return n.fields
    })
  }

  const chain = contenfulData.chainList.find((idxs) => {
    return idxs.fields.mainProduct === productData.id;
  })

  const subChain = contenfulData.chainList.find((idxs) => {
    return idxs.fields.subProducts.includes(productData.id)
  })

  let chainslug = []
  let chainProduct = null
  if (chain) {
    const chainProd = productSlugs.filter(prod => chain.fields.subProducts.some(param => prod.node.id === param))
    chainProd.map((slug) => {
      chainslug.push(slug.node.handle)
    })
  }

  let mainChainSlug = null
  if (subChain) {
    mainChainSlug = productSlugs.find(prod => prod.node.id === subChain.fields.mainProduct).node.handle
  }

  if (chain != null && chain != undefined ) {
    const promises = []
    for (let i = 0 ; i < chainslug.length; i++) {
      const result = await getProduct(chainslug[i])
      promises.push(result)
    }
    chainProduct = await Promise.all(promises)
  }

  let richText = contenfulData.pdpRichText.find((idxs) => {
    return idxs.fields.product === productData.id;
  })
   
  const basicProdData = {
    "vColor":contenfulData.vColor, 
    "chainList":contenfulData.chainList, 
    "badge":contenfulData.badge, 
    "discount":contenfulData.discount,
    "gwp":contenfulData.gwp,
  }

  const prodIds = productSlugs.map((prodId) => {    
    const prodIdsUrl = Buffer.from(prodId.node.id, 'base64').toString('binary')
    const realProdId = prodIdsUrl.replace("gid://shopify/Product/", "")
    return {
      productId: realProdId
    }
  })
  const richReviews = await getSumaryReview(prodIds)
  let products = null
  let richTextData = null
  let reviewNeeded = null
  let productsCollection = null
  if(richText) {
    if(richText.fields.content) {
      products = await getProdNeeded(richText.fields.content.content, productSlugs, contenfulData.bannerList)
      richTextData = await getRichTextDataNeeded(richText.fields.content.content, contenfulData)
      reviewNeeded = await getReviewNeeded(products, richReviews)

      if(richTextData.ColforPage.length != 0 ) {
        productsCollection = await getCollectionDetailRichText(richTextData.ColforPage)
      }
    }
  }
  else {
    richText = null
  }

  const richTextBasicData = {
    "products":products,
    "richText":richText, 
    "basicProdData":basicProdData, 
    "reviewNeeded":reviewNeeded, 
    "richTextData":richTextData, 
    "techIco":techIco,
    "pdpBadge":pdpBadge
  }
  const navs = contenfulData.naventries
  const navsData = await getNavDataNeeded(navs, contenfulData)
  const topBar = contenfulData.topBar[0].fields.contents.content
  const findSizeChart = contenfulData.sizeChart.filter(chart => chart.tagApplied.some(tagCh => productData.tags.some(tag => tagCh === tag)) )
  const sizeChartContent = findSizeChart.length > 0 ? findSizeChart[0] : null

  //if(params.product == "yurei-sun-protection-shirts") {
  //  return {
  //    redirect: {
  //     destination: "/",
  //    },
  //  }
  //} else {
    return {
      props: {
        productData,
        blogPost,
        richTextBasicData,
        reviews,
        reviewsPhoto,
        questions,
        chainProduct,
        navs,
        navsData,
        topBar,
        basicProdData,
        mainChainSlug,
        searchPopular,
        sizeChartContent,
        productsCollection
      },
    }
//  }
}

export default ProductPage
