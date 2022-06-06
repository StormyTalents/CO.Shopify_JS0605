import ProductListings from '@/components/product/ProductListings'
import { getContenfulData} from '@/lib/cache'
import { getProductsInCollection, getCollectionDetail } from '@/lib/shopify'
import { getcollectionSlugs, getNavDataNeeded } from '@/lib/contentful' 
import { getAllReview } from '@/lib/review'
import Image from 'next/image'
import SEO from '@/components/SEO'

function CollectionPage({ productsDefault, productsBestSeller, contenfulData, reviews, currentCollection, currentTag, subCollection }) {

  const prod = productsDefault.filter(prod => prod.node.tags.some( col => col.toLowerCase() === currentTag.fields.title.toLowerCase()))
  
  const prodBest = productsBestSeller.filter(prod => prod.node.tags.some( col => col === currentTag.fields.title))
 
  return ( 
    <div className="full collection--wraper">
      <SEO 
        title={currentTag.fields.metaTitleTag?currentTag.fields.metaTitleTag:`${currentTag.fields.title} - AFTCO`} 
        description={currentTag.fields.metaDescription?currentTag.fields.metaDescription:null}
      /> 

      <div className="container collection--header">
          {currentTag.fields.heroImage?
          <div className="collection--img desktop">
            <Image
              src={`https:${currentTag.fields.heroImage.fields.file.url}`}
              alt={currentTag.fields.heroImage.fields.file.title}
              layout="fill"
              objectFit="cover"
              priority
            />
            <h1 className="cl-w">{currentCollection.fields.title}</h1>
          </div>
          :""}
          <h2 className="collection--title h3">{currentTag.fields.title}</h2>
      </div>
      <ProductListings type="load" products={prod} productsBestSeller={prodBest} contenfulData={contenfulData} reviews={reviews} />     
    </div>
  )
}

export async function getStaticPaths() {
  const collectionSlugs = await getcollectionSlugs()
  let paths = []
  collectionSlugs.map((slug) => {    
    const collection = String(slug.fields.slug)
    const subTag = slug.fields.subTag?slug.fields.subTag:null
    subTag?
    subTag.map((tagslug)=>{
      const tag = String(tagslug.fields.slug)
      paths.push({params: { collection, tag }})
    }):""
  })
  return {
    paths:[],
    fallback: "blocking",
  }
}

export async function getStaticProps({ params }) {
  const contenfulData = await getContenfulData()
  const searchPopular = contenfulData.searchPopular

  const currentCollection = contenfulData.collections.find((idxs) => {
    return idxs.fields.slug === params.collection;
  })

  const currentTag = currentCollection.fields.subTag.find((idxs) => {
    return idxs.fields.slug === params.tag;
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

  const subCollection = currentCollection.fields.subCollections?currentCollection.fields.subCollections:null

  const reviews = await getAllReview(prodIds)

  const navs = contenfulData.naventries
  const navsData = await getNavDataNeeded(navs, contenfulData)
  const topBar = contenfulData.topBar[0].fields.contents.content
  const basicProdData = {
    "vColor":contenfulData.vColor, 
    "badge":contenfulData.badge, 
    "discount":contenfulData.discount,
    "gwp":contenfulData.gwp
  }

  return {
    props: {
      productsDefault,
      productsBestSeller,
      contenfulData,
      reviews,
      currentCollection,
      currentTag,
      subCollection,
      navs,
      navsData,
      topBar,
      basicProdData,
      searchPopular
    },
  }
}

export default CollectionPage