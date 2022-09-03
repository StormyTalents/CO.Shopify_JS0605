import { getAllProducts, getContenfulData, getSumaryReview } from '@/lib/cache'
import SEO from '@/components/SEO'
import RichText from '@/components/richtext'
import {getProdNeeded, getCollectionDetailRichText} from '@/lib/shopify'
import { getNavDataNeeded, getRichTextDataNeeded, getPagesSlugs } from '@/lib/contentful'
import { getReviewNeeded } from '@/lib/review'
import UnderHeroTitle from '@/components/header/UnderHeroTitle'
import OverlayTitle from '@/components/header/OverlayTitle'

function Page({pageContent, basicProdData, products, richTextData, reviewNeeded, productsCollection}) {

    return (
      <div className="page"> 
      <SEO 
        title={pageContent.fields.metaTitleTag?pageContent.fields.metaTitleTag:`${pageContent.fields.title} - AFTCO`} 
        description={pageContent.fields.meta_Description?pageContent.fields.meta_Description:null}
      /> 
      
      {pageContent.fields.content?
      <div className={`
        page--content 
        ${pageContent.fields.content.content[0].nodeType == "embedded-entry-block" 
        && 
        pageContent.fields.content.content[0].data.target.sys.contentType.sys.id == "heroBanner"?"reduce--top":""} 
        ${pageContent.fields.content.content[0].nodeType == "embedded-entry-block" 
        && 
        pageContent.fields.content.content[0].data.target.sys.contentType.sys.id == "productsBanner"?"reduce--top":""}
        ${pageContent.fields.content.content[0].nodeType == "embedded-entry-block" 
        && 
        pageContent.fields.content.content[0].data.target.sys.contentType.sys.id == "videoSection"?"reduce--top":""}
        ${pageContent.fields.showTitle?"reduce--top":""}
        `
        
      }>
        {pageContent.fields.showTitle ?
          pageContent.fields.titleStyle != "Overlay"?
            <UnderHeroTitle content={pageContent}/>
          :
            <OverlayTitle content={pageContent}/>
        :""
        }

        <div className="rich--text--wraper">
          <RichText 
            content={pageContent.fields.content.content} 
            products={products} 
            headerTitle={pageContent.fields.showTitle} 
            basicProdData={basicProdData} 
            richTextData={richTextData} 
            reviews={reviewNeeded} 
            productsCollection={productsCollection}
          />
        </div>
      </div>
      :<div className="container">No content found</div>}
      </div>
    )
}

export async function getStaticPaths() {
  const pageSlug = await getContenfulData()
  const contenfullPage= pageSlug.page.filter(function(item) {
    return item.fields.slug !== "site-accessibility" && 
    item.fields.slug !== "store-locator" && 
    item.fields.slug !== "privacy-policy" && 
    item.fields.slug !== "terms-of-service" && 
    item.fields.slug !== "gift-card-balance"
})
  const paths = contenfullPage.map((slug) => {    
    const page = String(slug.fields.slug)
    
    return {
      params: {page}
    }
  })
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({params}) {
    const allProducts = await getAllProducts()
    const contenfulData = await getContenfulData()
    const searchPopular = contenfulData.searchPopular
    const pages = await getPagesSlugs()
    const pageContent = pages.find((idxs) => {
        return idxs.fields.slug === params.page;
      })
    
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
    if(pageContent.fields.content != undefined) {

      products = await getProdNeeded(pageContent.fields.content.content, allProducts, contenfulData.bannerList)
      richTextData = await getRichTextDataNeeded(pageContent.fields.content.content, contenfulData)
      
      if(richTextData.ColforPage.length != 0 ) {
        productsCollection = await getCollectionDetailRichText(richTextData.ColforPage)
      }

      const reviews = await getSumaryReview(prodIds)
      reviewNeeded = await getReviewNeeded(products, reviews)
      
    }
    const basicProdData = {
      "vColor":contenfulData.vColor, 
      "filter":contenfulData.filter, 
      "chainList":contenfulData.chainList, 
      "badge":contenfulData.badge, 
      "discount":contenfulData.discount,
      "gwp":contenfulData.gwp
    }
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
        topBar,
        richTextData,
        reviewNeeded,
        productsCollection,
        searchPopular
      },
    }
  }

export default Page