import { getAllProducts, getContenfulData, getSumaryReview, getPages } from '@/lib/cache'
import SEO from '@/components/SEO'
import RichText from '@/components/richtext'
import { getProdNeeded, getCollectionDetailRichText } from '@/lib/shopify'
import { getNavDataNeeded, getRichTextDataNeeded } from '@/lib/contentful'
import { getReviewNeeded } from '@/lib/review'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Script from 'next/script'
import UnderHeroTitle from '@/components/header/UnderHeroTitle'
import OverlayTitle from '@/components/header/OverlayTitle'


function store({pageContent, basicProdData, products, richTextData, reviewNeeded, productsCollection}) {

  const router = useRouter();
  useEffect(() => {
    if(!router.asPath.includes("loaded") && typeof window !== 'undefined'){
      window.location = window.location + '#loaded';
      window.location.reload()
    }
  },[router.asPath])

  return (
    <div className="page"> 
      {pageContent?
      <div className={`
        page--content 
        ${pageContent.fields.content.content[0].nodeType == "embedded-entry-block" 
        && 
        pageContent.fields.content.content[0].data.target.sys.contentType.sys.id == "heroBanner"?"reduce--top":""} 
        ${pageContent.fields.content.content[0].nodeType == "embedded-entry-block" 
        && 
        pageContent.fields.content.content[0].data.target.sys.contentType.sys.id == "productsBanner"?"reduce--top":""}`
      }>
        <SEO title={pageContent.fields.seoTitle?pageContent.fields.seoTitle:`${pageContent.fields.title} - AFTCO` } /> 
        {pageContent.fields.showTitle == "Yes"?
          pageContent.fields.titleStyle != "Overlay"?
            <UnderHeroTitle content={pageContent}/>
          :
            <OverlayTitle content={pageContent}/>
        :""
        }
        <RichText 
          content={pageContent.fields.content.content} 
          products={products} 
          basicProdData={basicProdData} 
          richTextData={richTextData} 
          reviews={reviewNeeded}
          productsCollection={productsCollection}
        />
      </div>
      :<div className="container">No content found</div>}
      <Script async data-storemapper-start="2016,03,01" data-storemapper-id="2762" dangerouslySetInnerHTML={
            { __html: `
            // <![CDATA[
        (function() {var script = document.createElement('script');script.type  = 'text/javascript';script.async = true;script.src = 'https://www.storemapper.co/js/widget.js'; var entry = document.getElementsByTagName('script')[0];entry.parentNode.insertBefore(script, entry);}());
        // ]]>
            `}
        } strategy="lazyOnload" />
      </div>
  )
}

export async function getStaticProps() {
  const allProducts = await getAllProducts()
  const contenfulData = await getContenfulData()
  const pages = await getPages()
  const searchPopular = contenfulData.searchPopular

  let pageContent = pages.find((idxs) => { return idxs.fields.slug === "store-locator"; })
  const prodIds = allProducts.map((prodId) => {    
    const prodIdsUrl = Buffer.from(prodId.node.id, 'base64').toString('binary')
    const realProdId = prodIdsUrl.replace("gid://shopify/Product/", "")
    return {
      productId: realProdId
    }
  })
 
  let products = null
  let richTextData = null
  let reviewNeeded = null
  let productsCollection = null
  if(pageContent && pageContent.fields.content != undefined) {
    products = await getProdNeeded(pageContent.fields.content.content, allProducts, contenfulData.bannerList)
    richTextData = await getRichTextDataNeeded(pageContent.fields.content.content, contenfulData)

    if(richTextData.ColforPage.length != 0 ) {
      productsCollection = await getCollectionDetailRichText(richTextData.ColforPage)
    }

    const reviews = await getSumaryReview(prodIds)
    reviewNeeded = await getReviewNeeded(products, reviews)
  }
  else {
    pageContent = null
  }
  const basicProdData = {"vColor":contenfulData.vColor, "badge":contenfulData.badge, "discount":contenfulData.discount,"gwp":contenfulData.gwp}
  const navs = contenfulData.naventries
  const navsData = await getNavDataNeeded(navs, contenfulData)
  const topBar = contenfulData.topBar[0].fields.contents.content

  return {
    props: {
      pageContent,
      basicProdData,
      products,
      navs,
      navsData,
      richTextData,
      reviewNeeded,
      topBar,
      productsCollection,
      searchPopular
    },
  }
}

export default store
