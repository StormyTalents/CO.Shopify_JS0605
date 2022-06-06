import { useState, useEffect } from 'react'
import { useUpdateCartQuantityContext, useCartContext } from '@/context/Store'
import Link from 'next/link'
import Price from '@/components/product/Price'
import { Plus, Minus, Close } from '@/components/icons'
import { getCartSubTotal, getTotalCartQuantity } from '@/utils/helpers'
import CheckOutButton from '@/components/product/CheckOutButton'
import Image from 'next/image'
import classNames from 'classnames'

function CartTable({ cart }) {
  const updateCartQuantity = useUpdateCartQuantityContext()
  const [cartItems, setCartItems] = useState([])
  const [subtotal, setSubtotal] = useState(0)
  const [freeShipping, setFreeShipping] = useState(0)
  const [progressBar, setprogressBar] = useState(0)
  const [quantityTotal, setQuantityTotal] = useState(0)
  const checkoutUrl = useCartContext()[1]

  useEffect(() => {
    setCartItems(cart)
    setSubtotal(getCartSubTotal(cart))
    setQuantityTotal(getTotalCartQuantity(cart))
    const shippingCalculation = 150 - getCartSubTotal(cart)
    setFreeShipping(shippingCalculation)
    const progress = 100 -  shippingCalculation
    setprogressBar(progress)
  }, [cart])

  function updateItem(id, quantity) {
    updateCartQuantity(id, quantity)
  }

  function up(id,max) {
    let qty = parseInt(document.getElementById("variant-"+id).value) + 1;
    if (document.getElementById("variant-"+id).value >= parseInt(max)) {
      qty = max;
    }
    document.getElementById("variant-"+id).value = qty;
    updateCartQuantity(id, qty)
  }
  function down(id, min) {
    let qty = parseInt(document.getElementById("variant-"+id).value) - 1;
    if (document.getElementById("variant-"+id).value <= parseInt(min)) {
      qty = min;
    }
    document.getElementById("variant-"+id).value = qty;
    updateCartQuantity(id, qty)
  }
  function remove(id) {
    updateCartQuantity(id, 0)
  }
  return (
    <div className="cart-content">
      <div className="cart--detail flex">
        <div className="cart--item--wrap">
          <div className={classNames("cart--headline", cart && cart.length >= 1 ? "cart-available":"cart--empty")}>
            { cart && cart.length >= 1 ? <h1 className='h2'>Shopping Cart ({quantityTotal})</h1> : <h1 className='h2 center'>Your cart is empty</h1>}
            <div className="discount--banner">
              <p>{ progressBar >= 150 ? "You get FREE shipping" : `You are $${freeShipping.toFixed(2)} away from FREE shipping` }</p>
              <div className="progress--bar"><div className="progress" style={{ width: `${progressBar}%` }}></div></div>
            </div>
            { cart && cart.length == 0 ? <Link href="/"><a className="big--btn shop--url button">Start Shopping</a></Link> : null }
          </div>
          {cartItems ? cartItems.map(item => (
            <div key={item.variantId} className="cart--item flex">
              <div className="cart--item-content flex">
                <div className="cart--item--img">
                  <Image
                    src={item.productImage.originalSrc?item.productImage.originalSrc:"/icons/logo.png"}
                    alt={item.productImage.altText?item.productImage.altText:"aftco"}
                    height={64}
                    width={64}
                    layout="responsive"
                    className={`hidden sm:inline-flex`}
                  />
                </div>
                
                <div className="cart--item--product--info">
                  <Link passHref href={`/products/${item.productHandle}`} className="cart--content--title">
                      {item.productTitle}
                  </Link>
                  <div className="cart--item--variant">{item.variantTitle}</div>
                  {item.category != "gift" && item.category != "discountProd" ?
                  <div className="cart-qty mobile">
                    <button id="down" aria-label="decrement qty"  className="btn btn-default" onClick={(e) => down(item.variantId,0)}><Minus/></button>
                    <input
                      type="number"
                      id={"variant-"+item.variantId}
                      name="variant-quantity-1"
                      value={item.variantQuantity}
                      onChange={(e) => updateItem(item.variantId, e.target.value)}
                      className="item--qty"
                    />
                    <button id="up" aria-label="increment qty" className="btn btn-default" onClick={(e) => up(item.variantId,10)}><Plus/></button>
                  </div>
                  :""}
                </div>
              </div>
              <div className="cart--item-content">
              {item.category != "gift" && item.category != "discountProd" ?
                <div className="cart-qty desktop">
                  <button id="down" aria-label="decrement qty"  className="btn btn-default" onClick={(e) => down(item.variantId,0)}><Minus/></button>
                  <input
                    type="number"
                    id={"variant-"+item.variantId}
                    name="variant-quantity-1"
                    value={item.variantQuantity}
                    onChange={(e) => updateItem(item.variantId, e.target.value)}
                    className="item--qty"
                  />
                  <button id="up" aria-label="increment qty" className="btn btn-default" onClick={(e) => up(item.variantId,10)}><Plus/></button>
                </div>
                :""}
              </div>
              <div className="cart--item-content">
                <Price currency="$" num={item.variantPrice} numSize="cart--content--price" />
              </div> 
              <div className="cart--item-content">
                {item.category != "gift" ?
                  <div className="cart--close" onClick={(e) => remove(item.variantId)}><Close/></div>
                :""}
              </div>
            </div>
          )) : ""}
        </div>
        { cart && cart.length >= 1 ? 
        <div className="cart--widget">
          <h2>Complete Your Order</h2>
          <div className="discount--banner">
            <p>{ progressBar >= 100 ? "You get FREE shipping" : `You are $${freeShipping.toFixed(2)} away from FREE shipping` }</p>
            <div className="progress--bar"><div className="progress" style={{ width: `${progressBar}%` }}></div></div>
          </div>
            <div className="total flex">
              <div className="total--title"><h4>Subtotal</h4></div>
              <div className="total--price">
                <h4><Price currency="$" num={subtotal} numSize="cart--content--price" /> </h4>
              </div>
          </div>
          <div className="checkout">
            <CheckOutButton webUrl={checkoutUrl} />
          </div>
          <h3>Need Help?</h3>
          <Link passHref href="mailto:customercare@aftco.com">
            customercare@aftco.com
          </Link>
          <Link passHref href="tel:1-877-489-4278">
            (877)489-4278
          </Link>
        </div>
        : ""}
      </div>
      
    </div>
  )
}

export default CartTable
