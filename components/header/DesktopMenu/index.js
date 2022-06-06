import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import NavBar from '@/components/header/DesktopMenu/NavBar'
import Search from '@/components/header/search'
import { dl_view_cart } from '@/lib/dataLayer'

import { useCartContext, useUpdateCartStateContext } from '@/context/Store'
import { Cart } from '@/components/icons'
import CartMini from '@/components/header/CartMini'
import classNames from 'classnames'
import logo from '@/img/icons/logo.png'

function Nav({ navs, menuSlug, basicProdData, searchPopular }) {
  
  const updateCartItemState = useUpdateCartStateContext()
  const cart = useCartContext()[0]
  const [cartItems, setCartItems] = useState(0)
  
  const miniCart = useCartContext()[3]

  useEffect(() => {
    let numItems = 0
    if(cart) {
      cart.forEach(item => {
        numItems += item.variantQuantity
      })
      setCartItems(numItems)
    }
  }, [cart])


  async function updateCartState() {
    updateCartItemState(!miniCart)
    if(!miniCart) {
      dl_view_cart(cart)
    }
  }

  return (
    <div className="main--nav">
        <div className="container flex">
            <div className="logo">
                <Link href="/" passHref>
                    <a className="logo--link">
                        <Image src={logo} alt="Picture of the author" layout="responsive" width={100} height={38} placeholder="blur" priority/>
                    </a>
                </Link>
            </div>
                <NavBar navs={navs} menuSlug={menuSlug} vColor={basicProdData ? basicProdData.vColor : ""} badge={basicProdData ? basicProdData.badge : ""} classs="desktop"/> 
            <div className="mini--cart--header cart-- flex">
                <Search vColor={basicProdData ? basicProdData.vColor : ""} searchPopular={searchPopular}/>
                <div className="focus:outline-none relative mini--cart--ico" onClick={updateCartState}>
                    <button aria-label="cart" className="cart--ico-wrap"><Cart /></button>
                    { cartItems === 0 ? null : <div className="cart--total--qty" > {cartItems} </div> }
                </div>
                <div className={classNames("mini--cart", {'miniCart--active': miniCart})} aria-hidden="true" >
                    <CartMini cart={cart} basicProdData={basicProdData}/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Nav
