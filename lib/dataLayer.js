function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export const GTM_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID

export const pageview = (url) => {
  
  window.dataLayer.push({
    event: 'pageview',
    page: url,
  })

  const itemStr = getCookie("_cdnc")
  const eventId = getCookie("_cns") 
  let cartTotal
  const cart = document.getElementById("miniprice")
  cartTotal = cart?cart.innerHTML:0.0 
    if (itemStr && itemStr.firstName) {
      const item = JSON.parse(itemStr)
      window.dataLayer.push({
        "event": "dl_user_data",
        "event_id": eventId,
        "cart_total": cartTotal? cartTotal : 0.0,
        "user_properties": {
        "visitor_type": "logged_in",
        "customer_id": item.id,
        "customer_email": item.email,
        "customer_order_count": item.orderCount,
        "customer_total_spent": item.orderSpend,
        "customer_tags": item.tag,
        "user_consent": "yes",
        }
      })
    }
    else {
      window.dataLayer.push({
        event: "dl_user_data",
        event_id: eventId,
        cart_total: cartTotal ? cartTotal : 0.0,
        user_properties: {
        visitor_type: "guest",
        },
      dataLayerName: 'dl_user_data'
      })
    }
}

export function dl_user_data(cartTotal) {

  if (typeof window !== 'undefined') {
    const itemStr = getCookie("_cdnc")
    const eventId = getCookie("_cns") 
    
    if (itemStr && itemStr.firstName) {
      const item = JSON.parse(itemStr)
      window.dataLayer.push({
        "event": "dl_user_data",
        "event_id": eventId,
        "cart_total": cartTotal? cartTotal : 0.0,
        "user_properties": {
        "visitor_type": "logged_in",
        "customer_id": item.id,
        "customer_email": item.email,
        "customer_order_count": item.orderCount,
        "customer_total_spent": item.orderSpend,
        "customer_tags": item.tag,
        "user_consent": "yes",
        }
      })
    }
    else {
      window.dataLayer.push({
        event: "dl_user_data",
        event_id: eventId,
        cart_total: cartTotal ? cartTotal : 0.0,
        user_properties: {
        visitor_type: "guest",
        },
      dataLayerName: 'dl_user_data'
      })
    }
  }
}

export function dl_login(cusomerData) {
  const data = JSON.parse(cusomerData)
  if (typeof window !== 'undefined') {
    const eventId = getCookie("_cns") 
    window.dataLayer.push({
      "event": "dl_login",
      "event_id": eventId,
      "user_properties": {
        "visitor_type": "logged_in",
        "customer_id": data.id,
        "customer_email": data.email,
        "customer_order_count": data.orderCount,
        "customer_total_spent": data.orderSpend,
      }
    });
  }
}

export function dl_sign_up(id,email) {
  
  if (typeof window !== 'undefined') {
    const eventId = getCookie("_cns") 
    window.dataLayer.push({
      "event": "dl_sign_up",
      "event_id": eventId,
      "user_properties": {
        "visitor_type": "logged_in",
        "customer_id": id,
        "customer_email": email,
        "customer_order_count": 0,
        "customer_total_spent": 0,
      }
    });
  }
}

export function dl_collection(prod, col, path) {

  if (typeof window !== 'undefined') {
    const eventId = getCookie("_cns") 
    const prodData = prod[0].node
    const prodIdsUrl = Buffer.from(prodData.id, 'base64').toString('binary')
    const realProdId = prodIdsUrl.replace("gid://shopify/Product/", "")
    const varIdsUrl = Buffer.from(prodData.variants.edges[0].node.id, 'base64').toString('binary')
    const realVarId = varIdsUrl.replace("gid://shopify/ProductVariant/", "")
    window.dataLayer.push({
      "event": "dl_view_item_list",
      "event_id": eventId,
      "ecommerce": {
      "currencyCode": "USD",
      "impressions": {
        "name": prodData.title,
        "id": prodData.variants.edges[0].node.sku,
        "product_id": realProdId,
        "variant_id": realVarId,
        "price": prodData.priceRange.minVariantPrice.amount,
        "brand": prodData.vendor,
        "position": 1,
        "category": prodData.productType,
        "list": path,
      },
      }
      });
  }
}

export function dl_select_item(product,path,pos) {

  if (typeof window !== 'undefined') {
    const eventId = getCookie("_cns") 
    const prodIdsUrl = Buffer.from(product.node.id, 'base64').toString('binary')
    const realProdId = prodIdsUrl.replace("gid://shopify/Product/", "")
    const varIdsUrl = Buffer.from(product.node.variants.edges[0].node.id, 'base64').toString('binary')
    const realVarId = varIdsUrl.replace("gid://shopify/ProductVariant/", "")
    window.dataLayer.push({
      "event": "dl_select_item",
      "event_id": eventId,
      "ecommerce": {
        "currencyCode": "USD",
        "click": {
          "actionField": {'list': path}, 
          "products": {
            "name": product.node.title.replace("'", ''),
            "id": product.node.variants.edges[0].node.sku,
            "product_id": realProdId,
            "variant_id": realVarId,
            "price": product.node.priceRange.minVariantPrice.amount,
            "brand": product.node.vendor.replace("'", ''),
            "position": pos + 1,
            "category": product.node.productType,
            "list": path,
          }
        }
      }
      });
  }
}

export function dl_search_results(item, term) {
  const impressions = item.map(function(prodData) {

      const myArr = prodData.swatchesInfo.split(";;;;");
      const colors = myArr.find((str,i) => str.includes(`variantId1`)) || ""

    return {
      "name": prodData.name,
      "id": prodData.sku,
      "product_id": prodData.id,
      "variant_id": colors.replace(" variantId1:",""),
      "price": prodData.salePrice,
      "brand": prodData.brand,
      "position": 1,
      "category": prodData.product_type,
      "list": term,
    };
  });

  if (typeof window !== 'undefined') {
    const eventId = getCookie("_cns") 
    const prodData = item[0]
    window.dataLayer.push({
      "event": "dl_search_results",
      "event_id": eventId,
      "ecommerce": {
        "currencyCode": "USD",
        "actionField": { "list": item },
        "impressions": impressions,
      }
    });
  }
}

export function dl_view_item(item) {
  if (typeof window !== 'undefined') {
    const eventId = getCookie("_cns") 
    const prevUrl = sessionStorage.getItem("prevPath")
    const prodIdsUrl = Buffer.from(item.id, 'base64').toString('binary')
    const realProdId = prodIdsUrl.replace("gid://shopify/Product/", "")
    const varIdsUrl = Buffer.from(item.variants.edges[0].node.id, 'base64').toString('binary')
    const realVarId = varIdsUrl.replace("gid://shopify/ProductVariant/", "")
    window.dataLayer.push({
      "event": "dl_view_item",
      "event_id": eventId,
      "ecommerce": {
        "currencyCode": "USD",
        "detail": {
          "actionField": {'list': prevUrl},
          "products": [{
            "name": item.title,
            "id": item.variants.edges[0].node.sku,
            "product_id": realProdId,
            "variant_id": realVarId,
            "image": item.images.edges[0].node.originalSrc,
            "price": item.variants.edges[0].node.price,
            "brand": item.vendor,
            "variant":item.variants.edges[0].node.title,
            "category": item.productType,
            "inventory": item.variants.edges[0].node.quantityAvailable,
            "list": prevUrl,
          }]
        }
      }
    });    
  }
}

export function dl_add_to_cart(item) {
  if (typeof window !== 'undefined') {
    const eventId = getCookie("_cns")
    const prevUrl = sessionStorage.getItem("prevPath")
    const prodIdsUrl = Buffer.from(item.id, 'base64').toString('binary')
    const realProdId = prodIdsUrl.replace("gid://shopify/Product/", "")
    const varIdsUrl = Buffer.from(item.variants.edges[0].node.id, 'base64').toString('binary')
    const realVarId = varIdsUrl.replace("gid://shopify/ProductVariant/", "")
    window.dataLayer.push({
      "event": "dl_add_to_cart",
      "event_id": eventId,
      "ecommerce": {
      "currencyCode": "USD",
        "add": {
        "actionField": {'list': prevUrl},
        "products": [{
          "name": item.title,
          "id": item.variants.edges[0].node.sku,
          "product_id": realProdId,
          "variant_id": realVarId,
          "image": item.images.edges[0].node.originalSrc,
          "price": item.variants.edges[0].node.price,
          "brand": item.vendor,
          "variant":item.variants.edges[0].node.title,
          "category": item.productType,
          "quantity": 1,
          "list": prevUrl,
          }]
        }
      }
    });
  }
}

export function dl_remove_from_cart(item) {

  if (typeof window !== 'undefined') {
    const eventId = getCookie("_cns")
    const prevUrl = sessionStorage.getItem("prevPath")
    const prodIdsUrl = Buffer.from(item.productId, 'base64').toString('binary')
    const realProdId = prodIdsUrl.replace("gid://shopify/Product/", "")
    const varIdsUrl = Buffer.from(item.variantId, 'base64').toString('binary')
    const realVarId = varIdsUrl.replace("gid://shopify/ProductVariant/", "")
    window.dataLayer.push({
      "event": "dl_remove_from_cart",
      "event_id": eventId,
      "ecommerce": {
      "currencyCode": "USD",
        "add": {
        "actionField": {'list': item.previousUrl},
        "products": [{
          "name": item.productTitle,
          "id": item.sku,
          "product_id": realProdId,
          "variant_id": realVarId,
          "image": item.productImage.originalSrc,
          "price": item.variantPrice,
          "brand": item.brand,
          "variant":item.variantTitle,
          "category": item.category,
          "quantity": 1,
          "list": prevUrl,
          }]
        }
      }
    });
  }
}

export function dl_view_cart(items) {

  if (typeof window !== 'undefined') {
    const eventId = getCookie("_cns")
    const cartItems = items.map(function(item, idx) {
      const prodIdsUrl = Buffer.from(item.productId, 'base64').toString('binary')
      const realProdId = prodIdsUrl.replace("gid://shopify/Product/", "")
      const varIdsUrl = Buffer.from(item.variantId, 'base64').toString('binary')
      const realVarId = varIdsUrl.replace("gid://shopify/ProductVariant/", "")
      return {
      position: idx,
      id: item.sku,
      product_id: realProdId,
      variant_id: realVarId,
      name: item.productTitle,
      category: item.category,
      quantity: item.variantQuantity,
      price: item.variantPrice,
      brand: item.brand,
      variant: item.variantTitle
      }
    })

    window.dataLayer.push({
      "event": "dl_view_cart",
      "event_id": eventId,
      "cart_total": "total",
      "ecommerce": {
      "currencyCode": "USD",
      "actionField": { "list": "Shopping Cart" },
      "impressions": cartItems,
      }
      });
  }
}