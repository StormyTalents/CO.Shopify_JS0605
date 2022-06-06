import { createContext, useContext, useState, useEffect } from 'react'
import { createShopifyCheckout, updateShopifyCheckout, setLocalData, saveLocalData } from '@/utils/helpers'
import { navRecommendedProduct } from '@/lib/nosto'
import cookieCutter from 'cookie-cutter'

const CartContext = createContext()
const AddToCartContext = createContext() 
const UpdateCartQuantityContext = createContext() 
const UpdateCartStateContext = createContext()
const UpdateDiscountCodes = createContext()
const UpdateVipDiscountCodes = createContext()
const SearchString = createContext()

export function useCartContext() {
  return useContext(CartContext) 
}

export function useAddToCartContext() {
  return useContext(AddToCartContext)
}

export function useUpdateCartQuantityContext() {
  return useContext(UpdateCartQuantityContext)
}

export function useUpdateCartStateContext() {
  return useContext(UpdateCartStateContext)
}

export function useUpdateDiscountCodes() {
  return useContext(UpdateDiscountCodes)
}

export function useUpdateVipDiscountCodes() {
  return useContext(UpdateVipDiscountCodes)
}

export function useSearchString() {
  return useContext(SearchString) 
}


export function CartProvider({ children }) {
  const [cart, setCart] = useState(null)
  const [checkoutId, setCheckoutId] = useState('')
  const [checkoutUrl, setCheckoutUrl] = useState('')
  const [discount, setDiscount] = useState('')
  const [discountLine, setDiscountLine] = useState('')
  const [isLoading, setisLoading] = useState(false)
  const [miniCart, setMiniCart] = useState(false)
  const [search, setSearch] = useState('')
  const [navRecoProduct, setNavRecoProduct] = useState('')
  const [vipDiscount, setVipDiscount] = useState('')

  useEffect(() => { 
    setLocalData(setCart, setCheckoutId, setCheckoutUrl, setDiscount, setDiscountLine)
    setVipDiscountCookies()
  }, [])

  useEffect(() => {
    // do this to make sure multiple tabs are always in sync
    const onReceiveMessage = (e) => {
      setLocalData(setCart, setCheckoutId, setCheckoutUrl, setDiscount, setDiscountLine)
    }
    getNavRecoProd()
    window.addEventListener("storage", onReceiveMessage);
    return () => {
      window.removeEventListener("storage", onReceiveMessage);
    }
  }, [])

  async function addToCart(newItem) {
    setisLoading(true)
    setMiniCart(true)
    
    const getEmail = cookieCutter.get('_cdnc')
    const getGa = cookieCutter.get('_ga')
    const getFbp = cookieCutter.get('_fbp')
    const getFbc = cookieCutter.get('_fbc')
    const getUtm = localStorage.getItem("UTM")
    const utm = getUtm ? {ga:getGa,fbp:getFbp,fbc:getFbc,utmc:getUtm} : null
    let email = null
    if(getEmail && getEmail != "null") {
      email = JSON.parse(getEmail).email
    }
    // empty cart
    if (cart.length === 0) {
      setCart([
        newItem
      ])
      //const response = await createShopifyCheckout(newItem, email, utm)
      //setCheckoutId(response.checkout.id)
      //setCheckoutUrl(response.checkout.webUrl)
      //setDiscountLine(response.checkout.lineItems.edges)
      saveLocalData(newItem, checkoutId, checkoutUrl, discount, "response.checkout.lineItems.edges")

    } else {
      let newCart = [...cart]
      let itemAdded = false
      // loop through all cart items to check if variant
      // already exists and update quantity
      newCart.map(item => {
        if (item.variantId === newItem.variantId) {
          item.variantQuantity += newItem.variantQuantity
          itemAdded = true
        }
      })

      let newCartWithItem = [...newCart]
      if (itemAdded) {
      } else {
        // if its a new item than add it to the end
        newCartWithItem = [...newCart, newItem]
      }

      setCart(newCartWithItem)
      //const response = await updateShopifyCheckout(newCartWithItem, checkoutId)
      //setDiscountLine(response.lineItems.edges)
      saveLocalData(newCartWithItem, checkoutId, checkoutUrl, discount, "response.lineItems.edges")
    }
    setisLoading(false)
  }

  async function updateCartItemQuantity(id, quantity) {
    setisLoading(true)
    let newQuantity = Math.floor(quantity)
    if (quantity === '') {
      newQuantity = ''
    }
    let newCart = [...cart]
    newCart.forEach(item => {
      if (item.variantId === id) {
        item.variantQuantity = newQuantity
      }
    })

    // take out zeroes items
    newCart = newCart.filter(i => i.variantQuantity !== 0)
    setCart(newCart)

    let updatedCheckoutId = checkoutId
    let updatedCheckoutUrl = checkoutUrl
    if(newCart.length == 0) {
      setCheckoutId('')
      setCheckoutUrl('')
      updatedCheckoutId = ""
      updatedCheckoutUrl = ""
    }
    
    //const response =  await updateShopifyCheckout(newCart, checkoutId)

    //setDiscountLine(response.lineItems.edges)
    saveLocalData(newCart, updatedCheckoutId, updatedCheckoutUrl, discount, "response.lineItems.edges")
    setisLoading(false)
  }

  function updateCartItemState(data) {
    setMiniCart(data)
  }

  function updateDiscount(discountCode,lineItem) {
    setDiscount(discountCode)
    setDiscountLine(lineItem)
    saveLocalData(cart, checkoutId, checkoutUrl, discountCode , lineItem)
  }

  function updateVipDiscount(vipDiscountCode) {
    setVipDiscount(vipDiscountCode)
  }

  function setVipDiscountCookies() {
    const disc = cookieCutter.get('_cdt')
    if(disc && disc != "null") {
      setVipDiscount(JSON.parse(disc))
    }
  }


  function updateSearch(data) {
    if(data != '' && data != undefined && data != null) {
    setSearch(data)
    }
    else {
      setSearch(null)
    }
  }

  async function getNavRecoProd() {
    const recoProduct = await navRecommendedProduct()
    setNavRecoProduct(recoProduct)
  }

  return (
    <CartContext.Provider value={[cart, checkoutUrl, isLoading, miniCart, search, navRecoProduct, discount, discountLine, vipDiscount ]}>
      <AddToCartContext.Provider value={addToCart}>
        <UpdateCartQuantityContext.Provider value={updateCartItemQuantity}>
          <UpdateCartStateContext.Provider value={updateCartItemState}>
            <SearchString.Provider value={updateSearch}>
              <UpdateDiscountCodes.Provider value={updateDiscount}>
                <UpdateVipDiscountCodes.Provider value={updateVipDiscount}>
                {children}
                </UpdateVipDiscountCodes.Provider>
              </UpdateDiscountCodes.Provider>
            </SearchString.Provider>
          </UpdateCartStateContext.Provider>
        </UpdateCartQuantityContext.Provider>
      </AddToCartContext.Provider>
    </CartContext.Provider>
  )
}
