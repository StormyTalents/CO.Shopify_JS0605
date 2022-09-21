import { useEffect } from 'react';
import { useAddToCartContext, useCartContext } from '@/context/Store'
import { useRouter } from 'next/router'
import { getDiscountProd, assignShopifyUserCheckout, getLocalData } from '@/utils/helpers'
import Image from 'next/image'
import cookieCutter from 'cookie-cutter'

function Page() {

  const addToCart = useAddToCartContext()
  const miniCart = useCartContext()[0]
  const router = useRouter()
  const { pid } = router.query

    async function applyDiscountCode() {
        const variantId = `gid://shopify/ProductVariant/${pid}`
        const prod = await getDiscountProd(variantId)
        const cart = await handleAddToCart(prod)
        const checkoutId = getLocalData()[1]
        const token = cookieCutter.get('_cds')
        const checkout = await assignShopifyUserCheckout(token,checkoutId)
        if (cart == "done") {
          window.location.href = checkout.webUrl.replace("aftco-test.myshopify.com","shop.aftco.com")
        }
        else {
          window.location.href = checkout.webUrl.replace("aftco-test.myshopify.com","shop.aftco.com")
        }
    }

    async function handleAddToCart(prod) { 
      const cartStatus = miniCart.find(cart => cart.variantId === prod.id )
      if(!cartStatus) {
        await addToCart({ 
          productTitle: prod.product.title,
          productHandle: prod.product.handle, 
          productImage: prod.image,
          productId: prod.product.id,
          variantId: prod.id,
          variantPrice: prod.price,
          variantTitle: prod.title,
          variantQuantity: 1,
          previousUrl: "",
          brand:prod.product.vendor,
          category:"discountProd",
          sku:prod.sku
        })
      }
      return "done"
     }


    useEffect(() => {
      if(pid){
        applyDiscountCode()
      }
    });
    
    return (
      <div className="page"> 
        <div className="loading" >
          <div className="loading--ico">
            <Image
              src={"/icons/loading.gif"}
              alt={"Preload"}
              width={64}
              height={64}
              layout="responsive"
            />
          </div>
        </div>
      </div>
    )
}

export default Page