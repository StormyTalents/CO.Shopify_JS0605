import ProductListings from '@/components/product/ProductListings'
import { getContenfulData} from '@/lib/cache'
import { getProductsInCollection, getCollectionDetail } from '@/lib/shopify'
import { getcollectionSlugs, getGroupOfCollection, getNavDataNeeded } from '@/lib/contentful' 
import { getAllReview } from '@/lib/review'
import Image from 'next/image'
import Link from 'next/link'
import SEO from '@/components/SEO'
import { dl_collection } from '@/lib/dataLayer'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import cookieCutter from 'cookie-cutter'
import { getCartSubTotal, getTotalCartQuantity, getNostoProd } from '@/utils/helpers'
import { useCartContext } from '@/context/Store'
import RelatedProduct from '@/components/product/RelatedProduct'

function CollectionPage({ productsDefault, productsBestSeller, basicProdData, reviews, currentCollection, subCollection, parentCol, ads }) {

  const router = useRouter()
  const[mobile, setMobile] = useState(false) 
  const cart = useCartContext()[0]
  const bestSeller = currentCollection.fields.slug.includes("best-seller") ? true : false

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
    const productPageProd = await getNostoProd("cat", sessionId, currentCollection.fields.title, currentCollection.fields.slug)
    setRelatedProd(productPageProd.product)
  }

  useEffect(() => {

    getRelatedProd() // get related prod for category

    if (typeof window !== 'undefined') {
        setTimeout(function(){ console.log("init data layer 2"); dl_collection(productsDefault, currentCollection, router.asPath); }, 1000);
        const w = window.innerWidth;
        if(w <= 768) {
          setMobile(true)
        }
    }
    
  }, [router.asPath]);

  useEffect(() => {
    if(cart) {
      const getEmail = cookieCutter.get('_cdnc')
      const Email = getEmail && getEmail != "null" ? JSON.parse(getEmail).email : null
  
      if(typeof window !== 'undefined') {
        window.wunderkind = {
          item_category: "", 
          category_ids: Buffer.from(currentCollection.fields.shopifySource, 'base64').toString('binary').replace("gid://shopify/Collection/",""), 
          category_title: currentCollection.fields.title,
          email: Email,
          cart_qty: getTotalCartQuantity(cart),
          cart_value: getCartSubTotal(cart),
          email_submit: ""
        }
      }
    }
  }, [cart]);

  var settings = {
    dots: false,
    infinite: true,
    swipeToSlide: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    cssEase: 'linear',
    speed: 250,
    variableWidth: true
  };

  return (
    <div className="full collection--wraper">
      <SEO 
        title={currentCollection.fields.metaTitleTag?currentCollection.fields.metaTitleTag:`${currentCollection.fields.title} - AFTCO`} 
        description={currentCollection.fields.metaDescription?currentCollection.fields.metaDescription:null}
      /> 

      <div className="container collection--header">
        <div className="breadcrumb mt-30 mb-30"><Link href="/"><a>Home</a></Link> {parentCol? <Link href={`/collections/${parentCol.fields.slug}`}><a>/ {parentCol.fields.title}</a></Link>:""} / {currentCollection.fields.title}</div>
            {currentCollection.fields.heroImage?
              <div className="collection--img desktop">
                <Image
                  src={`https:${currentCollection.fields.heroImage.fields.file.url}`}
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  priority
                />
                <h1 className="cl-w">{currentCollection.fields.title}</h1>
              </div>
            :""}
          { subCollection ?
            <div className="sub--collection--wrap">
              {mobile?
                <div className="sub--collection">
                  <Slider {...settings}>
                    {subCollection.map((sub,i) => (
                      <Link href={`/collections/${sub.fields.slug}`} passHref key={i}><a className="sub--item">{sub.fields.title}</a></Link>
                    ))}
                  </Slider>
                </div>
              :
                <div className="sub--collection">
                  {subCollection.map((sub,i) => (
                    <Link href={`/collections/${sub.fields.slug}`} passHref key={i}><a className="sub--item">{sub.fields.title}</a></Link>
                  ))}
                </div>
              }
            </div>
          :""}
        <h2 className="collection--title h3">{currentCollection.fields.title}</h2>
      </div>
      <ProductListings 
        type="load" 
        products={productsDefault} 
        productsBestSeller={productsBestSeller} 
        contenfulData={basicProdData} 
        reviews={reviews} 
        ads={ads}
        bestSeller={bestSeller}
      />
      {relatedProd ? 
        <div className="container">
          <RelatedProduct 
            product={relatedProd[0].primary} 
            star 
            title="You May Also Like" 
            slider={mobile} sliderSet={2} 
            gridSet={4} 
            vColor={basicProdData.vColor}
            badge={basicProdData.badge}
          /> 
        </div>
        :""
      }
      <div className='collection--description'>
        <p>{currentCollection.fields.metaDescription}</p>
      </div>
    </div>
  )
}

export async function getStaticPaths() {
  const collectionSlugs = await getcollectionSlugs()
  const fallbackStatus = process.env.FALLBACK
  let paths
  if(fallbackStatus == "live") {
    paths = collectionSlugs.map((colSlug) => {    
    const collection = String(colSlug.fields.slug)
      return {
        params: { collection }
      }
    })
  } else {
    paths = []
  }

  return {
    paths,
    fallback: "blocking",
  }
} 

export async function getStaticProps({ params }) {
  const contenfulData = await getContenfulData()
  const searchPopular = contenfulData.searchPopular

  const basicProdData = {
    "vColor":contenfulData.vColor, 
    "filter":contenfulData.filter, 
    "chainList":contenfulData.chainList, 
    "badge":contenfulData.badge, 
    "discount":contenfulData.discount,
    "gwp":contenfulData.gwp
  }
  const currentCollection = contenfulData.collections.find((idxs) => {
    return idxs.fields.slug === params.collection;
  })
  const id = currentCollection.fields.shopifySource?Buffer.from(currentCollection.fields.shopifySource, 'base64').toString('binary'):null
  const colSlug = await getCollectionDetail(id)
  const productsDefault = await getProductsInCollection(colSlug.handle,"MANUAL")
  const productsBestSeller = await getProductsInCollection(colSlug.handle,"BEST_SELLING")

  const prodIds = productsDefault.map((prodId) => {    
    const prodIdsUrl = Buffer.from(prodId.node.id, 'base64').toString('binary')
    const realProdId = prodIdsUrl.replace("gid://shopify/Product/", "")
    return {
      productId: realProdId
    }
  })
  
  const groupOfCollections = await getGroupOfCollection()
  const sub = groupOfCollections.find((idxs) => {
    return idxs.fields.parentCollection.fields.slug === colSlug.handle;
    })
  const subCollection = sub?sub.fields.subCollections:null
  let parentCol = contenfulData.collections.find((idxs) => idxs.fields.subCollections?idxs.fields.subCollections.some(param => param.fields.slug === currentCollection.fields.slug):"")
  if(parentCol == undefined){parentCol = null}
  const reviews = await getAllReview(prodIds)
  const navs = contenfulData.naventries
  const navsData = await getNavDataNeeded(navs, contenfulData)
  const topBar = contenfulData.topBar[0].fields.contents.content

  let ads = contenfulData.ads.filter((idxs) => idxs.fields.appliedTo?idxs.fields.appliedTo.some(param => param.fields.slug === currentCollection.fields.slug):"")
  return {
    props: {
      productsDefault,
      productsBestSeller,
      basicProdData,
      reviews,
      currentCollection,
      subCollection,
      parentCol,
      navs,
      navsData,
      topBar,
      ads,
      title: params.collection,
      searchPopular
    },
  }
}

export default CollectionPage