import { useState, useEffect  } from 'react'
import SEO from '@/components/SEO'
import CartTable from '@/components/product/CartTable'
import { useCartContext } from '@/context/Store'
import { getContenfulData} from '@/lib/cache'
import { getNavDataNeeded } from '@/lib/contentful'
import { cartRelated, recommendedProduct } from '@/lib/nosto' 
import RelatedProduct from '@/components/product/RelatedProduct'

function CartPage({basicProdData}) {

  const [cart, checkoutUrl] = useCartContext()
  const [nosto, setNosto] = useState(0)
  if (cart ) {
  const items = cart.map((cartItem, i) => {
    return {
      productId: Buffer.from(cartItem.productId, 'base64').toString('binary').replace("gid://shopify/Product/", ""),
      skuId: Buffer.from(cartItem.variantId, 'base64').toString('binary').replace("gid://shopify/ProductVariant/", ""),
      name: cartItem.productTitle,
      unitPrice: parseFloat(cartItem.variantPrice),
      priceCurrencyCode: "USD",
      quantity: cartItem.variantQuantity
    };
    });

    cartRelated(items).then((value) => { nosto == 0 ? setNosto ( value ) : ""  })
  }
  else {
    recommendedProduct().then((value) => { nosto == 0 ? setNosto ( value ) : ""  })
  }

  const[mobile, setMobile] = useState(false) 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const w = window.innerWidth;
      if(w <= 768) {
        setMobile(true)
      } 
    }
  },[]);

  return (
    <div className="cart--page mt-50">
      <SEO title="Cart Page" description="Cart Page of Aftco"/> 
      <div className='container'>
        <CartTable 
          cart={cart}
        />
        {nosto.length >= 1 ?
          <RelatedProduct 
            product={nosto} 
            cart={cart.length} 
            slider={mobile} sliderSet={2}
            gridSet={4} 
            vColor={basicProdData.vColor} 
            star 
          />
        :""} 
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const contenfulData = await getContenfulData()
  const searchPopular = contenfulData.searchPopular
  const navs = contenfulData.naventries
  const navsData = await getNavDataNeeded(navs, contenfulData)
  const topBar = contenfulData.topBar[0].fields.contents.content
  const basicProdData = {"vColor":contenfulData.vColor, "badge":contenfulData.badge, "discount":contenfulData.discount,"gwp":contenfulData.gwp}

  return {
    props: {
      navs,
      navsData,
      topBar,
      basicProdData,
      searchPopular
    },
  }
}

export default CartPage
