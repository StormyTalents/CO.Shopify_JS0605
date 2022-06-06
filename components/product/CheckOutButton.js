import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { getLocalData, createShopifyCheckout, updateShopifyCheckout, saveLocalData } from '@/utils/helpers'
import cookieCutter from 'cookie-cutter'
import Image from 'next/image'

function CheckOutButton() {

  const [error, setError] = useState(null)
  const [onload, setOnload] = useState(null)

  async function updateCheckout(cart,utm,checkoutId) {
    const getCheckout = await updateShopifyCheckout(cart, checkoutId)
    if(getCheckout.checkout.status == "success") {
      const checkoutData = getCheckout.checkout.data.checkoutLineItemsReplace && getCheckout.checkout.data.checkoutLineItemsReplace.checkout
      const errorM = getCheckout.checkout.data.checkoutLineItemsReplace.userErrors.length != 0 && getCheckout.checkout.data.checkoutLineItemsReplace.userErrors[0].message
      if(errorM) {
        saveLocalData(cart, "", "", "", "")
        setError(errorM)
        setOnload(false)
      } else {
        saveLocalData(cart, checkoutData.id, checkoutData.webUrl, "", "")
        window.location.href = checkoutData.webUrl.replace("aftco-test.myshopify.com","shop.aftco.com")
      }
    } else {
      if(getCheckout.checkout.data[0].message == "Checkout is already completed.") {
        createCheckout(cart,utm)
      } else {
        saveLocalData(cart, "", "", "", "")
        setError("Update checkout Error please clear all item from cart")
        setOnload(false)
      }
    }
  }

  async function createCheckout(cart,utm) {
    const getCheckout = await createShopifyCheckout(cart, null, utm)
    if(getCheckout.checkout.status == "success") {
      const checkoutData = getCheckout.checkout.data.checkoutCreate && getCheckout.checkout.data.checkoutCreate.checkout
      const errorM = getCheckout.checkout.data.checkoutCreate.checkoutUserErrors.length != 0 && getCheckout.checkout.data.checkoutCreate.checkoutUserErrors[0].message
      if(errorM) {
        setError(errorM)
        setOnload(false)
      } else {
        saveLocalData(cart, checkoutData.id, checkoutData.webUrl, "", "")
        window.location.href = checkoutData.webUrl.replace("aftco-test.myshopify.com","shop.aftco.com")
      }
    } else {
      saveLocalData(cart, "", "", "", "")
      setError("Create checkout Error please clear all item from cart")
      setOnload(false)
    }
  }

  async function goToCheckout() {
    setOnload(true)
    const checkoutId = getLocalData()[1]
    const cart = getLocalData()[0]

    const getGa = cookieCutter.get('_ga')
    const getFbp = cookieCutter.get('_fbp')
    const getFbc = cookieCutter.get('_fbc')
    const getUtm = localStorage.getItem("UTM")
    const utm = getUtm ? {ga:getGa,fbp:getFbp,fbc:getFbc,utmc:getUtm} : null

    if(checkoutId) {
      updateCheckout(cart,utm,checkoutId)
    } else {
      createCheckout(cart,utm)
    }
  }

  return (
    <>
      {error ? <p center style={{color:"red"}} className="mb-20 center">{error}</p> : "" }
      <div className='button--with--loading'>
        { onload?
            <div className="loading">
              <div className="loading--ico">
                <Image
                  src={"/icons/loading.gif"}
                  alt={"aftco"}
                  width={64}
                  height={64}
                  layout="responsive"
                />
              </div>
            </div>
          :""
        }
        <button
          aria-label="checkout-products"
          className="big--btn checkout--url"
          onClick = {goToCheckout}
        >
      <FontAwesomeIcon icon={faLock} color="white" /> Secure Checkout 
      </button>
      </div>
    </>
  )
}

export default CheckOutButton
