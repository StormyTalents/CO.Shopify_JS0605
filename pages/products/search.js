import ProductListings from '@/components/product/ProductListings'
import { getAllProducts, getContenfulData} from '@/lib/cache'
import { getNavDataNeeded } from '@/lib/contentful'
import { getAllReview } from '@/lib/review'
import { useCartContext} from '@/context/Store'

function Search({ products, reviews, basicProdData }) {
  
  const searchProduct = useCartContext()[4] 

  function ReRender() { 
    
    let searchResult = []
    if (searchProduct && searchProduct.records != '' && searchProduct.records != null && searchProduct.records != undefined) {
          searchProduct.records.map( search => {
            const resu = products.find(prod => prod.node.handle === search.url.replace("https://shop.aftco.com/products/","").replace("https://aftco.com/products/",""))
            if(resu) {
              searchResult.push(resu)
            }
          }
            )
    }
    else {
      searchResult = null
    }

    return (
      <div className="search--result--page">
        <div className="container heading">
          {searchProduct && searchProduct.meta.searchedTerm?
          <h2 className='h4 mt-50'>{searchResult?searchResult.length:""} search items for "{searchProduct.meta.searchedTerm}"</h2>
          :
          <h2 className='h4 mt-50'>Please type on search field to search.</h2>
          }
        </div>
        {searchProduct?
          <ProductListings type="load" products={searchResult} productsBestSeller={searchResult} searchProduct={searchProduct.records} contenfulData={basicProdData} reviews={reviews} />
        :""}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl nosto">
         <ReRender />  
    </div>
  )
}

export async function getStaticProps() {
  const products = await getAllProducts()
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
  
  const prodIds = products.map((prodId) => {    
    const prodIdsUrl = Buffer.from(prodId.node.id, 'base64').toString('binary')
    const realProdId = prodIdsUrl.replace("gid://shopify/Product/", "")
    return {
      productId: realProdId
    }
  })

  const reviews = await getAllReview(prodIds)
  const navs = contenfulData.naventries
  const navsData = await getNavDataNeeded(navs, contenfulData)
  const topBar = contenfulData.topBar[0].fields.contents.content

  return {
    props: {
      products,
      reviews,
      basicProdData,
      navs,
      navsData,
      topBar,
      searchPopular
    },
  }
}

export default Search
