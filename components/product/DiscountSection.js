import { useState } from 'react'
import { useUpdateDiscountCodes, useCartContext, useAddToCartContext } from '@/context/Store'
import { applyDiscount, removeDiscount, getLocalData, getDiscountProd } from '@/utils/helpers'

function Discount({discount}) {
  
    const updateDiscount = useUpdateDiscountCodes()
    const discountCodeState = useCartContext()[6]
    const miniCart = useCartContext()[0]
    const [showDiscount, setShowDiscount] = useState(false)
    const addToCart = useAddToCartContext()
    
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
          category:discountCodeState,
          sku:prod.sku
        })
      }
      return "done"
     }
     
    async function appDsc(disc,check) {
      const checkoutData = await applyDiscount(disc,check)
      if(checkoutData.checkoutUserErrors.length == 0) {
        updateDiscount(disc, checkoutData.checkout.lineItems.edges)
        setShowDiscount(false)
      }
      else {
        updateDiscount("error", checkoutData.checkout.lineItems.edges)
        setShowDiscount(false)
      }
    }

    async function applyDiscountCode(e) {
        e.preventDefault();
        const checkoutId = getLocalData()[1]
        const formData = new FormData(e.target);
        const discountCode  = Object.fromEntries(formData.entries())
        const bogo = discount.find(disc => disc.title === discountCode.discount )
        if (bogo) {
          const variantId = Buffer.from(bogo.appliedTo, 'base64').toString('binary')
          const prod = await getDiscountProd(variantId)
          const cart = await handleAddToCart(prod)
          if (cart == "done") {
            appDsc(discountCode.discount,checkoutId)
          }
        }
        else {
          appDsc(discountCode.discount,checkoutId)
        }
        
      }

    async function removeDiscountCode() {
      const checkoutId = getLocalData()[1]
      const checkoutData = await removeDiscount(checkoutId)
      if(checkoutData.checkoutUserErrors.length == 0) {
        updateDiscount(null, null)
        setShowDiscount(false)
      }
      else {
        updateDiscount("error", checkoutData.checkout.lineItems.edges)
      }
    }

  return (
    <form method="post" className='discount--section customer-form-gird' onSubmit={(e) => applyDiscountCode(e)}>
        {showDiscount?
        <>
            <div className="field">
                <input type="text" id="discount" name="discount" placeholder="Enter Promo Code" />
                <label for="discount">Enter Promo Code</label>
            </div>
            <button type="submit" aria-label="apply-discount" className="button blue" >
                Apply Discount
            </button>
        </>
        :
        discountCodeState?
        <>
            <h5>Discount Code : {discountCodeState != "error"?discountCodeState:<span className='error'>Discount code not valid</span>} <span onClick={removeDiscountCode} className="discount--cta">(Remove)</span></h5>
            <h5>Add another discount code? <span onClick={() => setShowDiscount(!showDiscount)} className="discount--cta">click here</span></h5>
        </>
        :
        <h5>Have a discount code? <span onClick={() => setShowDiscount(!showDiscount)} className="discount--cta">click here</span></h5>
            
        }
    </form>
  )
}

export default Discount