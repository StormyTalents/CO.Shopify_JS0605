import { getAllProducts, getContenfulData, getSumaryReview } from '@/lib/cache'

function SaveCustomer() {
  if (typeof window !== 'undefined') {
    const now = new Date()
    window.addEventListener('message', function(e) {
      if (e.origin == "https://aftco.com") {
        const item = {
          value: e.data,
          expiry: now.getTime() + 86400000,
        }
        localStorage.setItem("customerid", JSON.stringify(item))
      }
    }, false);
}

  return (
    <div className="home--index--page">
      save customer
    </div>
  )
}

export async function getStaticProps() {
  const products = await getAllProducts()
  const contenfulData = await getContenfulData()
  
  const prodIds = products.map((prodId) => {    
    const prodIdsUrl = Buffer.from(prodId.node.id, 'base64').toString('binary')
    const realProdId = prodIdsUrl.replace("gid://shopify/Product/", "")
    return {
      productId: realProdId
    }
  })
 
  const reviews = await getSumaryReview(prodIds)
  

  return {
    props: {
      products,
      reviews,
      contenfulData,
    },
  }
}
export default SaveCustomer
