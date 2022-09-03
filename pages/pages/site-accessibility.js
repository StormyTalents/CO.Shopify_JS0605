import { getAllProducts, getContenfulData, getSumaryReview, getPages } from '@/lib/cache'
import SEO from '@/components/SEO'
import RichText from '@/components/richtext'
import { getProdNeeded, getCollectionDetailRichText } from '@/lib/shopify'
import { getNavDataNeeded, getRichTextDataNeeded } from '@/lib/contentful'
import { getReviewNeeded } from '@/lib/review'
import UnderHeroTitle from '@/components/header/UnderHeroTitle'
import OverlayTitle from '@/components/header/OverlayTitle'
import Script from 'next/script'


function store({pageContent, basicProdData, products, richTextData, reviewNeeded, productsCollection}) {
  
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
        <div className='container'>
          <button class="button mt-30 center" href="#" id="accessibly-initial-trigger">Enable Accessibility Widget</button>
        </div>
      </div>
      :<div className="container">No content found</div>}
      <Script 
        src="https://dlieyhrm30x3f.cloudfront.net/accessibility-widget.umd.js" 
        strategy="afterInteractive"
        onLoad={() => {
          accessibilityWidget(
            {
            enabled: true,
            localization: 'en',
            showZoom: true,
            showCursor: true,
            showInvertColors: true,
            showContrast: true,
            showGrayScale: false,
            showBrightness: true,
            iconColor: 'rgba(24, 165, 181, 1)',
            position: 'bottom-right',
            showHighlightLinks: true,
            showHideImages: true,
            showTooltip: true,
            showReadingLine: true,
            showReadableFonts: true,
            iconSize: 'large',
            themeColor: 'rgba(24, 165, 181, 1)',
            showVoiceOverText: true,
            voiceLanguage: 'Alex',
            showHideForever: true,
            initialHide: false,
            customTrigger:"accessibly-initial-trigger"
            }
            );
        }}
      />
      </div>
  )
}

export async function getStaticProps() {
  const allProducts = await getAllProducts()
  const contenfulData = await getContenfulData()
  const pages = await getPages()
  const searchPopular = contenfulData.searchPopular

  let pageContent = pages.find((idxs) => { return idxs.fields.slug === "site-accessibility"; })
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
