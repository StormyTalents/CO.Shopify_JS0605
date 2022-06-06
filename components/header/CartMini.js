import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useUpdateCartQuantityContext, useUpdateCartStateContext, useCartContext, useAddToCartContext } from '@/context/Store'
import Price from '@/components/product/Price'
import { Plus, Minus, Close } from '@/components/icons'
import { getCartSubTotal, getTotalCartQuantity, getDiscountProd } from '@/utils/helpers'
import CheckOutButton from '@/components/product/CheckOutButton'
import DiscountSection from '@/components/product/DiscountSection'
import { cartRelated, recommendedProduct } from '@/lib/nosto'
import RelatedProduct from '@/components/product/RelatedProduct' 
import { dl_user_data, dl_remove_from_cart } from '@/lib/dataLayer'
import { useRouter } from 'next/router'
import cookieCutter from 'cookie-cutter'

function CartTable({ cart, basicProdData }) {

  const discount = basicProdData ? basicProdData.discount : ""
  const vColor = basicProdData ? basicProdData.vColor : ""
  const badge = basicProdData ? basicProdData.badge : ""
  const gwp = basicProdData ? basicProdData.gwp : ""
  const router = useRouter()

  const updateCartQuantity = useUpdateCartQuantityContext() 
  const [cartItems, setCartItems] = useState([])
  const [subtotal, setSubtotal] = useState(0)
  const [freegift, setFreeGift] = useState(false)
  const [quantityTotal, setQuantityTotal] = useState(0)
  const [freeShipping, setFreeShipping] = useState(0)
  const [progressBar, setprogressBar] = useState(0)
  const [nosto, setNosto] = useState(0)
  const vipDiscount = useCartContext()[8] || null
  const dicountLine = useCartContext()[7]
  const discountCodeState = useCartContext()[6]
  const checkout = useCartContext()[1]
  
  useEffect(() => {
    if(cart) {
      const cartSubTotal = getCartSubTotal(cart, vipDiscount)
      setCartItems(cart)
      setSubtotal(cartSubTotal)
      setQuantityTotal(getTotalCartQuantity(cart))

      const shippingCalculation = 150 - cartSubTotal
      setFreeShipping(shippingCalculation)
      const progress = (cartSubTotal / 150) * 100
      setprogressBar(progress)
      applyGwp()
      setFreeGift(false)
  
  
      const getEmail = cookieCutter.get('_cdnc')
      const Email = getEmail && getEmail != "null" ? JSON.parse(getEmail).email : null
  
      if( !router.asPath.includes("products") && !router.asPath.includes("collections") && typeof window !== 'undefined') {
        window.wunderkind = {
          email: Email,
          cart_qty: getTotalCartQuantity(cart),
          cart_value: getCartSubTotal(cart, vipDiscount),
          email_submit: ""
        }
      }
    }
    
  }, [cart, dicountLine])

  function updateItem(id, quantity) {
    updateCartQuantity(id, quantity)
  } 

  const miniCart = useCartContext()[3]
  const updateCartItemState = useUpdateCartStateContext()

  function updateCartState() {
    updateCartItemState(!miniCart)
  }

  function up(id,max) {
    let qty = parseInt(document.getElementById("variant-"+id).value) + 1;
    if (document.getElementById("variant-"+id).value >= parseInt(max)) {
      qty = max;
    }
    document.getElementById("variant-"+id).value = qty;
    updateCartQuantity(id, qty)
    if (typeof window !== 'undefined' && window.dataLayer != undefined) {
      dl_user_data(getCartSubTotal(cart, vipDiscount))
      }
  }

  function down(id, min, idx) {
    let qty = parseInt(document.getElementById("variant-"+id).value) - 1;
    if (document.getElementById("variant-"+id).value <= parseInt(min)) {
      qty = min;
    }
    document.getElementById("variant-"+id).value = qty;
    if (window.dataLayer != undefined) {
      dl_user_data(getCartSubTotal(cart, vipDiscount))
      if(qty == 0) {
        dl_remove_from_cart(cart[idx])
      }
    }
    updateCartQuantity(id, qty)
  }

  function remove(id, idx) {
    if (window.dataLayer != undefined) {
      dl_user_data(getCartSubTotal(cart, vipDiscount))
      dl_remove_from_cart(cart[idx])
    }
    updateCartQuantity(id, 0)
  }

  if (cart && cart.length >= 1 ) {
  const items = cart.map((cartItem, i) => {
    const prod =  cartItem.productId.includes("Product") ? 
                  cartItem.productId.replace("gid://shopify/Product/", "") : 
                  Buffer.from(cartItem.productId, 'base64').toString('binary').replace("gid://shopify/Product/", "")

    const sku = cartItem.variantId.includes("Product") ? 
                cartItem.variantId.replace("gid://shopify/Product/", "") : 
                Buffer.from(cartItem.variantId, 'base64').toString('binary').replace("gid://shopify/Product/", "")
    return {
      productId: prod,
      skuId: sku,
      name: cartItem.productTitle,
      unitPrice: parseFloat(cartItem.variantPrice),
      priceCurrencyCode: "USD",
      quantity: cartItem.variantQuantity
    };
    });

    cartRelated(items).then((value) => { nosto == 0 ? setNosto ( value ) : ""  })
  } else {
    recommendedProduct().then((value) => { nosto == 0 ? setNosto ( value ) : ""  })
  }
  
function price (productTitle, variantPrice, variantQuantity, productCol, compareAtPrice) {

  let price = null
  if(dicountLine && discountCodeState && discountCodeState != "error") {
    const discount = dicountLine.find(dsc => dsc.node.title === productTitle)
    if(discount && discount.node.discountAllocations.length != 0) {
      const calPrice = (variantPrice * variantQuantity) - discount.node.discountAllocations[0].allocatedAmount.amount
      price = calPrice <= 0 ? "Free" : calPrice;
    }
    else {
      price = null
    }
  }
  
  return (
    <Price
      currency="$"
      num={variantPrice * variantQuantity}
      discountPrice={price}
      compareAtPrice={compareAtPrice}
      vip={vipDiscount && vipDiscountCal(productCol)}
      numSize="cart--content--price"
    />
  )
}

  // VIP DISCOUNT
  function vipDiscountCal(brand) {
    let vipApplied = null
    let vipNotApplied = null

    if (vipDiscount.appliedTo) {
      vipApplied = vipDiscount.appliedTo.find( vip => vip == brand )
      if(vipApplied) {
        return vipDiscount.amountIn
      }
      else {
        return null
      }
    }
    else {
      if (vipDiscount.notAppliedTo) {
        vipNotApplied = vipDiscount.notAppliedTo.find( vip => vip == brand )
        if (vipNotApplied) {
          return null
        }
        else {
          return vipDiscount.amountIn
        }
      }
      else {
        return vipDiscount.amountIn
      }
    }
  }

  // GIFT with PURCHASE
  const addToCart = useAddToCartContext()
  async function applyGwp() {
    const gwpStatus = cart && gwp.filter(item => cart.some(wp => item.fields.product === wp.productId))
    const gwpRemove = cart && cart.filter(item => gwp.some(wp => item.variantId === Buffer.from(wp.fields.gift, 'base64').toString('binary')))

    if(gwpStatus.length > 0 && gwpRemove.length == 0 && !freegift && checkout) {
      setFreeGift(true)
      gwpStatus.map( async(item) => {
        const prod = await getDiscountProd(item.fields.gift)
        await handleAddToCart(prod)
        }
      )
      
    } 
    if(gwpStatus.length == 0 && gwpRemove.length > 0) {
      setFreeGift(false)
      gwpRemove.forEach( item => {
        updateCartQuantity(item.variantId, 0)
      })
    }
  }

  async function handleAddToCart(prod) { 
    const cartStatus = cart.find(cart => cart.variantId === prod.id )
    
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
        category:"gift",
        sku:prod.sku
      })
    }
    return "done"
   }

  return (
    <div className="mini--cart-content">
      <div className="mini--cart--content--header">
        <div className="mini--cart--headline">
          <h5>CART <span aria-label="total-cart" aria-description="Item in cart" id="minicartqty">{quantityTotal}</span></h5>
          <div className="discount--banner">
            <p>{ progressBar >= 100 ? "You get FREE shipping" : `You are $${freeShipping.toFixed(2)} away from FREE shipping` }</p>
            <div className="progress--bar"><div className="progress" style={{ width: `${progressBar}%` }}></div></div>
          </div>
          <div className="cart--close" onClick={(e) => updateCartState()}><Close/></div>
        </div>
        {cart && cart.length == 0 ?<h3>Your cart is empty</h3>:null}
        {
          subtotal === 0 ?
            null
            :
            <div className="mini--cart--total flex">
              <div className="total--title"><h4>Subtotal</h4></div>
              <div className="total--price">
                <h4><Price currency="$" num={subtotal} numSize="cart--content--price" id="miniprice"/> </h4>
              </div>
            </div>
        }
        <div className="cart--mini--checkout">
          {cart && cart.length >= 1 && 
            <>
              {
                //<DiscountSection discount={discount}/>
              }

              <CheckOutButton /> 
              
              <button className="button" onClick={(e) => updateCartState()}>Continue Shopping</button> 
            </>
            }
        </div>
      </div>
      <div className="cart--item--wrap">
        {cartItems.map((item, index) => (
          <div key={item.variantId} className="cart--item flex">
            <div className="cart--item--img">
              <Image
                src={item.productImage && item.productImage.originalSrc?item.productImage.originalSrc:"/icons/logo.png"}
                alt={item.productImage && item.productImage.altText?item.productImage.altText:"aftco"}
                height={64}
                width={64}
                layout="responsive"
                className={`hidden sm:inline-flex`}
              />
            </div>
            <div className="cart--item-content">
              <Link passHref href={`/products/${item.productHandle}`} className="cart--content--title">
                    {item.productTitle}
              </Link>
              <div className="cart--item--variant">{item.variantTitle}</div>
              {item.category != "gift" && item.category != "discountProd" ?
                <div className="cart-qty">
                  <button id="down" aria-label="decrement qty" className="btn btn-default" onClick={() => down(item.variantId, 0, index)}><Minus/></button>
                  <input
                    type="number"
                    id={"variant-"+item.variantId}
                    name="variant-quantity-1"
                    value={item.variantQuantity}
                    onChange={(e) => updateItem(item.variantId, e.target.value)}
                    className="item--qty"
                  />
                  <button id="up" aria-label="increment qty" className="btn btn-default" onClick={() => up(item.variantId,10, index)}><Plus/></button>
                </div>
              :""} 
              {price(item.productTitle, item.variantPrice, item.variantQuantity, item.brand, item.compareAtPrice)}
            </div>
            
              <div className="cart--item-remove">
              {item.category != "gift" ?
                <div className="cart--close" onClick={(e) => remove(item.variantId, index)}><Close/></div>
                :""
              }
              </div>
            
          </div>
        ))}
      </div>
      {nosto.length >= 1 ?
        <RelatedProduct product={nosto} star cart={cart.length} slider={"yes"} sliderSet={2} vColor={vColor} badge={badge} prodType={"Nosto"}/>  
      :""}
    </div>
  )
}

export default CartTable
