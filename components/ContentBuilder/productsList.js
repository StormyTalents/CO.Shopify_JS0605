import { useState, useEffect } from 'react'
import RelatedProduct from '@/components/product/RelatedProduct'
import { useCartContext } from '@/context/Store'
import { getNostoProd } from '@/utils/helpers'
import cookieCutter from 'cookie-cutter'
import { useRouter } from 'next/router'

function prodList(node) {

  const router = useRouter()
  const [sliderSize, setSliderSize] = useState(5)
  const [frontRelated, setFrontRelated] = useState(null)
  const nosto = useCartContext()[5]
  const carousel = node.data.carousel ? "yes" : "no"

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
    const FrontPageProd = await getNostoProd("front",sessionId)
    setFrontRelated(FrontPageProd.product[0].primary)
  }

  useEffect(() => {
    
    if (typeof window !== 'undefined') {
        const width = window.innerWidth 
        if(width <= 769) {
          setSliderSize(2)
        }
    }

    const type = node.data.productSourceType
    if(type == "Nosto") {
      getRelatedProd()
    }
    else if(type == "Collection") {
      const thisCollection = node.productsCollection.find( prod => prod.col === node.data.collection.sys.id)
      if (typeof window !== 'undefined') {
        const width = window.innerWidth 
        if(width > 769 && thisCollection.prod.length <= 4) {
          setSliderSize(thisCollection.prod.length)
        }
      }
      setFrontRelated(thisCollection.prod.slice(0,16))
    }
    else if(type == "New Arrival") {
      const newArrival = node.products.slice(Math.max(node.products.length - 10, 0))
      setFrontRelated(newArrival)
    }
    else {
      setFrontRelated(nosto) 
    }
  },[router.asPath])

    return (
        <div className="container">
          <div className={`product--list--section ${node.data.showTitle == true?"mt-75":""}`}>
            {frontRelated && 
              <RelatedProduct 
                product={frontRelated}
                cart={0} 
                star 
                slider={carousel}
                sliderSet={sliderSize} 
                title={node.data.showTitle == true?node.data.title:""} 
                vColor={node.basicProdData.vColor} 
                contenfulData={node.basicProdData}
                badge={node.basicProdData.badge} 
                prodType={node.data.productSourceType}
                reviews={node.reviews}
              />
            }
          </div>
        </div>
    )
}

export default prodList