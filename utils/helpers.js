export function saveLocalData(cart, checkoutId, checkoutUrl,discount,discountLine) {
  localStorage.setItem(process.env.NEXT_PUBLIC_LOCAL_STORAGE_NAME, JSON.stringify([cart, checkoutId, checkoutUrl, discount, discountLine]))
}
r
export async function getCustomerToken(customerData) {
  const data = await fetch('/api/customer-token', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({detail:customerData,type:"token"}),
  })
  const response = await data.json() 
  
  return response
}

export async function createNewCustomer(customerData) {
  const data = await fetch('/api/customer-token', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({detail:customerData,type:"create"}),
  })
  const response = await data.json()
  
  return response
}

export async function sendRecoverEmail(email) {
  const data = await fetch('/api/customer-token', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({email:email,type:"recover"}),
  })
  const response = await data.json()
  
  return response
}

export async function getCustomerData(token) {
  const data = await fetch('/api/customer-token', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({token:token,type:"csdata"}),
  })
  const response = await data.json()
  return response
}

export async function setActivateCustomer(acu,pass) {
  const data = await fetch('/api/customer-token', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({acu:acu, pass:pass, type:"activeC"}),
  })
  const response = await data.json()
  return response
}

export async function setResetCustomer(resp,pass) {
  const data = await fetch('/api/customer-token', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({resp:resp, pass:pass, type:"reset"}),
  })
  const response = await data.json()
  return response
}

export async function getCustomerUpdatedAddress(addr,type) {
  const data = await fetch('/api/customer-address', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({data:addr,type:type}),
  })
  const response = await data.json()
  return response
}

export async function updateAdress(addr) {
  
  const data = await fetch('/api/customer-address', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({data:addr.newAddress,type:"update"}),
  })
  const response = await data.json()
  return response
}

export async function addAdress(addr) {
  const data = await fetch('/api/customer-address', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    }, 
    body: JSON.stringify({data:addr,type:"add"}),
  })
  const response = await data.json()
  return response
}

export async function deleteAddress(addr) {

  const data = await fetch('/api/customer-address', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({data:addr,type:"delete"}),
  })
  const response = await data.json()
  return response
}

export async function setDefaultAddress(addr) {

  const data = await fetch('/api/customer-address', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({data:addr,type:"set"}),
  })
  const response = await data.json()
  return response
} 

export async function getProvince(country) {
  const data = await fetch(`/json/countries/${country}.json`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
    },
  })

  try {
    const response = await data.json()
    return response;
  } catch (error) {
    return "Not Found";
  }
}

export function getLocalData() {
  return JSON.parse(localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_STORAGE_NAME))
}

export function setLocalData(setCart, setCheckoutId, setCheckoutUrl, setDiscount, setDiscountLine) {
  const localData = getLocalData()

  if (localData) {
    if (Array.isArray(localData[0])) {
      setCart([...localData[0]])
    }
    else {
      setCart([localData[0]]) 
    }
    setCheckoutId(localData[1])
    setCheckoutUrl(localData[2])
    setDiscount(localData[3])
    setDiscountLine(localData[4])
  }
  else {
    setCart([]) 
  }
}

export async function createShopifyCheckout(cart,email, utm) {

  let lineItems 
  if(cart.length > 0) {
    lineItems = cart.map(item => {
      return {
        variantId: item['variantId'],
        quantity: item['variantQuantity']
      }
    })
  } else {
    lineItems = {variantId: cart.variantId, quantity: cart.variantQuantity}
  } 

  const data = await fetch('/api/create-checkout', { 
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ lineItems:lineItems, userEmail:email, utm:utm }),
  })
  const response = await data.json()
  return response
}

export async function updateShopifyCheckout(updatedCart, checkoutId) {

  let lineItems 
  if(updatedCart.length > 0) {
    lineItems = updatedCart.map(item => {
      return {
        variantId: item['variantId'],
        quantity: item['variantQuantity']
      }
    })
  } else {
    lineItems = {variantId: updatedCart.variantId, quantity: updatedCart.variantQuantity}
  } 
  
  const data = await fetch('/api/update-checkout', { 
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ checkoutId, lineItems, type:"updateLine"}),
  })
  const response = await data.json()
  return response
}

export async function multipassLogin(email,host) {
  
  const data = await fetch('/api/multipass', { 
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ email:email, host:host }),
  })
  const response = await data.json()
  return response
}

export async function assignShopifyUserCheckout(token, checkoutId) {
  const data = await fetch('/api/update-checkout', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    }, 
    body: JSON.stringify({ token, checkoutId, type:"updateUser"}),
  })
  const response = await data.json()
  return JSON.parse(response.checkout)
}

export async function applyDiscount(discount, checkoutId) {
  const data = await fetch('/api/update-checkout', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ discount, checkoutId, type:"applyDiscount" }),
  })
  const response = await data.json()
  return JSON.parse(response.checkout)
}

export async function removeDiscount(checkoutId) {
  const data = await fetch('/api/update-checkout', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({checkoutId, type:"removeDiscount" }),
  })
  const response = await data.json()
  return JSON.parse(response.checkout)
}

export async function getDiscountProd(id) {
  const data = await fetch('/api/get-product', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({id}),
  })
  const response = await data.json()
  return response.product
}

export function getCartSubTotal(cart,vipDiscount) { 
  // VIP DISCOUNT
  function vipDiscountCal(brand) {
    let vipApplied = null
    let vipNotApplied = null
    if(vipDiscount) {
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
    } else {
      return null
    }
  }

  if(cart) {
    if (cart.length === 0) {
      return 0
    }
    else {
      let totalPrice = 0
      cart.forEach(item => {
        const vipDiscountAmount = vipDiscountCal(item.brand);
        const varPrice = item.variantPrice - (item.variantPrice * (vipDiscountAmount / 100))
        totalPrice += parseInt(item.variantQuantity) * parseFloat(varPrice)
        }
      )
      return Math.round(totalPrice * 100) / 100
    }
  }
}

export function getTotalCartQuantity(cart) {
  if(cart) {
    if ( cart.length === 0) {
      return 0
    }
    else {
      let totalQuantity = 0
      cart.forEach(item => totalQuantity += parseInt(item.variantQuantity))
      return totalQuantity
    }
  }
}

export async function sendSearchOrder(dataOrder) {
  const orderNumber = dataOrder.replace("#","")
  const data = await fetch('/api/customer-order', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({orderNumber}),
  })
  const response = await data.json()
  return response
}

export async function getNostoProd(status, sessionId, id, slug) {

  const data = await fetch('/api/sync-nosto', { 
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({type:status, sessionId:sessionId, prodId:id, slug:slug}),
  })
  const response = await data.json()
  return response
}

export async function signUpKlavio(email) {

  const data = await fetch('/api/klaviyo-api', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({email:email,type:"signup"}),
  })
  const response = await data.json()
  return response
}

export async function backInStockKlavio(order) {

  const variantId = Buffer.from(order.target.varid.value, 'base64').toString('binary')
  const realVariantId = variantId.replace("gid://shopify/ProductVariant/", "")

  const data = await fetch('/api/klaviyo-api', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({email:order.target.email.value, varId:realVariantId, type:"order"}),
  })
  const response = await data.json()
  return response
}