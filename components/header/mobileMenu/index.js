import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import MobileMenu from '@/components/header/mobileMenu/MobileSubMenu'
import Search from '@/components/header/search'
import { dl_view_cart } from '@/lib/dataLayer'
import { Close } from '@/components/icons' 
import { useRouter } from 'next/router'

import { useCartContext, useUpdateCartStateContext } from '@/context/Store'
import { Cart } from '@/components/icons'
import CartMini from '@/components/header/CartMini'
import classNames from 'classnames'
import logo from '@/img/icons/logo.png'

function Nav({ navs, menuSlug, basicProdData, searchPopular }) {

  const miniCart = useCartContext()[3]
  const router = useRouter();
  
  const updateCartItemState = useUpdateCartStateContext()
  const cart = useCartContext()[0]
  const [cartItems, setCartItems] = useState(0)
  const [mobMenu, setMobMenu] = useState(false)
  const [url, setUrl] = useState(router.asPath)

  useEffect(() => {
    let numItems = 0
    cart.forEach(item => {
      numItems += item.variantQuantity
    })
    setCartItems(numItems)
  }, [cart])

  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      updateCartItemState(false)
      setMobMenu(false)
      setUrl(url)
    } 
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router.events])

  async function updateCartState() {
    updateCartItemState(!miniCart)
    if(!miniCart) {
      dl_view_cart(cart)
    }
  }

  function setMobMenuFixed() {
    setMobMenu(!mobMenu)
    if (mobMenu) {
      document.querySelector("body").classList.remove("stay")
    }
    else {
      document.querySelector("body").classList.add("stay")
    }
  }

  return (
      <div className="main--nav">
        <div className="container flex">
          <button className="mobile--menu mobile" onClick={setMobMenuFixed} aria-label="menu">
            <div id="nav-icon4">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
          <div className="logo">
            <Link href="/" passHref>
              <a className="logo--link">
              <Image src={logo} alt="Picture of the author" layout="responsive" width={100} height={38} placeholder="blur" priority/>
              </a>
            </Link>
          </div>
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
        <div className='mobileMenu--wrap mobile'>
            <div className={classNames("mob--menu full", {'open':mobMenu})} role="dialog" aria-modal="true" aria-label="menu">
              <div className='close--trap' onClick={setMobMenuFixed}></div>
                <div className='mob--menu--wrap'>
                    <button className="close" onClick={setMobMenuFixed} aria-label="Close">
                        <Close/>
                    </button>
                    <MobileMenu navs={navs} menuSlug={menuSlug} vColor={basicProdData ? basicProdData.vColor : ""} url={url}/>
                    <button className="sr-only" onFocus={setMobMenuFixed} aria-label="menu"></button>
                </div>
            </div>
        </div>
      </div>
  )
}

export default Nav
