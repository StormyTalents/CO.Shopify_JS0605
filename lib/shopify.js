const domain = process.env.SHOPIFY_STORE_DOMAIN
const checkoutDomain = process.env.SHOPIFY_CHECKOUT_DOMAIN
const storefrontAccessToken = process.env.SHOPIFY_STORE_FRONT_ACCESS_TOKEN
const apiPassword = process.env.SHOPIFY_API_PASSWORD
const multipassKey = process.env.SHOPIFY_MULTIPASS_SECRET

import multipass from 'multipassify';

async function callShopify(query) {
  const fetchUrl = `https://${domain}/api/2022-01/graphql.json`;

  const fetchOptions = {
    endpoint: fetchUrl,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  };

  try {
    const data = await fetch(fetchUrl, fetchOptions).then((response) =>
      response.json(),
    );
    return data;
  } catch (error) {
    try {
      const data = await fetch(fetchUrl, fetchOptions).then((response) =>
        response.json(),
      );
      return data;
    } catch (error) {
      throw new Error("Could not fetch products!");
    }
  }
}

async function callCheckoutShopify(query,utm) {
  const utmO = utm ? JSON.parse(utm.utmc) : null
  const utmUrl = utm && utm.utmc ? `?utm_source=${encodeURIComponent(utmO.utm_source)}&utm_medium=${encodeURIComponent(utmO.utm_medium)}&utm_campaign=${encodeURIComponent(utmO.utm_campaign)}&utm_content=${encodeURIComponent(utmO.utm_content)}&utm_id=${encodeURIComponent(utmO.utm_id)}&utm_term=${encodeURIComponent(utmO.utm_term)}` : ""
  
  const fetchUrl = `https://${checkoutDomain}/api/2022-01/graphql.json${utmO ? utmUrl : ""}`;

  const fetchOptions = {
    endpoint: fetchUrl,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  };

  try {
    const data = await fetch(fetchUrl, fetchOptions).then((response) =>
      response.json(),
    );
    return data;
  } catch (error) {
    try {
      const data = await fetch(fetchUrl, fetchOptions).then((response) =>
        response.json(),
      );
      return data;
    } catch (error) {
      throw new Error("Could not update checkout!"); 
    }
  }
}

async function adminAPi(query) {
  const fetchUrl = `https://${domain}/admin/api/2022-04/graphql.json`;

  const fetchOptions = {
    endpoint: fetchUrl,
    method: "POST",
    headers: {
      "X-Shopify-Access-Token": apiPassword,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  };

  try {
    const data = await fetch(fetchUrl, fetchOptions).then((response) =>
      response.json(),
    );
    return data;
  } catch (error) {
    throw new Error("Could not fetch products!");
  }
}

async function restAdminAPi(data) {
  const fetchUrl = `https://${domain}/admin/api/2022-04/gift_cards/${data}.json`;

  const fetchOptions = {
    endpoint: fetchUrl,
    method: "GET",
    headers: {
      "X-Shopify-Access-Token": apiPassword,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
  };

  try {
    const data = await fetch(fetchUrl, fetchOptions).then((response) =>
      response.json(),
    );
    return data;
  } catch (error) {
    throw new Error("Could not fetch products!");
  }
}

export async function multipassEncode(email, host) {
  const multipassify = new multipass(multipassKey);
  const customerData = { email: email, return_to : host+'/account'};
  const tokenMultipass = multipassify.encode(customerData);
  return tokenMultipass
}

const delay = (ms = 1000) => new Promise(r => setTimeout(r, ms));

async function getAllProducts(cursor) {
  const fetchUrl = `https://${domain}/api/2021-04/graphql.json`;

  const query =
    `{
        products(first: 100${cursor?`,after:"${cursor}"`:""}) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              id
              title
              handle
              tags
              vendor
              productType
              priceRange {
                minVariantPrice {amount}
              }
              images(first: 100) {
                edges {
                  node {
                    originalSrc
                    smallImage: transformedSrc(maxWidth: 325)   
                    altText             
                  }
                }
              }
              options {
                name
                values
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    title
                    sku
                    price 
                    compareAtPrice     
                  }
                }
              }
            }
          }
        }
    }`
  ;

  const fetchOptions = {
    endpoint: fetchUrl,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  };

  try {
    const data = await fetch(fetchUrl, fetchOptions).then((response) =>
      response.json(),
    );
    return data;
  } catch (error) {
    throw new Error("Could not fetch products!");
  }
}

async function getAllProductsInCollection(data, cursor, sort) {
  const fetchUrl = `https://${domain}/api/2021-04/graphql.json`;

  const query =
    `{
      collectionByHandle(handle: "${data}") {
        id
        title
        products(first: 100, sortKey:${sort}${cursor?`,after:"${cursor}"`:""}) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              id
              title
              handle
              tags
              createdAt
              vendor
              productType
              priceRange {
                minVariantPrice {amount}
              }
              images(first: 100) {
                edges {
                  node {
                    smallImage: transformedSrc(maxWidth: 325)   
                    altText             
                  }
                }
              }
              options {
                id
                name
                values
              }
              variants(first: 100) {
                edges {
                  node {
                    id
                    title
                    sku
                    price 
                    compareAtPrice     
                  }
                }
              }
            }
          }
        }
      }
    }`
  ;

  const fetchOptions = {
    endpoint: fetchUrl,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  };

  try {
    const data = await fetch(fetchUrl, fetchOptions).then((response) =>
      response.json(),
    );
    return data;
  } catch (error) {
      try {
        await delay();
        const data = await fetch(fetchUrl, fetchOptions).then((response) =>
          response.json(),
        );
        return data;
      } catch (error) {
        throw new Error("Could not fetch collection!");
      }
  }
}

export async function getAllProductsInCollectionRichText(data) {
  const fetchUrl = `https://${domain}/api/2021-04/graphql.json`;

  const query =
    `{
      collectionByHandle(handle: "${data}") {
        id
        title
        products(first: 16) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              id
              title
              handle
              tags
              createdAt
              vendor
              priceRange {
                minVariantPrice {amount}
              }
              images(first: 100) {
                edges {
                  node {
                    smallImage: transformedSrc(maxWidth: 325)   
                    altText             
                  }
                }
              }
              options {
                id
                name
                values
              }
              variants(first: 100) {
                edges {
                  node {
                    id
                    title
                    sku
                    price 
                    compareAtPrice     
                  }
                }
              }
            }
          }
        }
      }
    }`
  ;

  const fetchOptions = {
    endpoint: fetchUrl,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  };

  try {
    const data = await fetch(fetchUrl, fetchOptions).then((response) =>
      response.json(),
    );
    return data;
  } catch (error) {
      try {
        const data = await fetch(fetchUrl, fetchOptions).then((response) =>
          response.json(),
        );
        return data;
      } catch (error) {
        throw new Error("Could not fetch products!");
      }
  }
}

export async function getProductSlugs() { 
  const promises = [];
  let cursors
  let state = true
  for (let i = 0 ; state == true; i++) {
    if(i >= 1 && state == true) {
      promises? cursors = promises[i-1].data.products.edges[99].cursor:""
    }
    const result = await getAllProducts(cursors)
    promises.push(result)
    if(i >= 1) {
      state = result.data.products.pageInfo.hasNextPage
    }
  }
  const data = await Promise.all(promises)
  const prod = {"allProduct": data}
  let allProduct = []
  for (let i = 0; i < prod.allProduct.length; i++) {
    allProduct = allProduct.concat(prod.allProduct[i].data.products.edges)
  }
  return (allProduct)
}

export async function getCollectionDetail(id) {
  const query =
    `{
      collection(id: "${id}") {
        handle
      }
    }`
  ;

  const response = await adminAPi(query);
  const collection = response.data.collection
    ? response.data.collection
    : [];

  return collection;
}

export async function getCollectionDetailRichText(collection) {

  let productsCollection = []
  for (let i = 0 ; i < collection.length; i++) {
    const id = Buffer.from(collection[i].fields.shopifySource, 'base64').toString('binary')
    const colSlug = await getCollectionDetail(id)
    const getProductsCollection = await getAllProductsInCollectionRichText(colSlug.handle)
    productsCollection.push({col:collection[i].sys.id, prod:getProductsCollection.data.collectionByHandle.products.edges})
  }
  
  return productsCollection
}

async function getRedirects(cursor) {
  const query =
  `{
    urlRedirects(first: 100${cursor?`,after:"${cursor}"`:""}) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          path
          target
        }
      }
    }
  }`
  ;

  const response = await adminAPi(query);
  const redirect = response
    ? response
    : [];

  return redirect;
}

export async function getAllRedirects() { 
  const promises = [];
  let cursors
  let state = true
  for (let i = 0 ; state == true; i++) {
    if(i >= 1 && state == true) {
      promises? cursors = promises[i-1].data.urlRedirects.edges[99].cursor:""
    }
    const result = await getRedirects(cursors)
    promises.push(result)
    if(i >= 1) {
      state = result.data.urlRedirects.pageInfo.hasNextPage
    }
  }
  const data = await Promise.all(promises)
  const prod = {"allRedirects": data}
  let allRedirects = []
  for (let i = 0; i < prod.allRedirects.length; i++) {
    allRedirects = allRedirects.concat(prod.allRedirects[i].data.urlRedirects.edges)
  }
  return (allRedirects)
}

export async function getShopifyCollectionSlugs(collectionIds) { 
  const promises = [];
  for (let i = 0; i < collectionIds.length; i++) { 
    const id = collectionIds[i].fields.shopifySource?Buffer.from(collectionIds[i].fields.shopifySource, 'base64').toString('binary'):null
    const result = await getCollectionDetail(id)
    promises.push(result)
  }
  const data = await Promise.all(promises)
  return (data)
}

export async function getProductsInCollection(collectionSlug, sort) {
  const promises = [];
  let cursors
  let state = true
  for (let i = 0 ; state == true; i++) {
    if(i >= 1 && state == true) {
      promises? cursors = promises[i-1].data.collectionByHandle.products.edges[99].cursor:""
    }
    const result = await getAllProductsInCollection(collectionSlug, cursors, sort)
    state = result.data.collectionByHandle.products.pageInfo.hasNextPage
    promises.push(result)
  }
  
  const data = await Promise.all(promises)
  const prod = {"allProduct": data}
  let allProduct = []
  for (let i = 0; i < prod.allProduct.length; i++) {
    allProduct = allProduct.concat(prod.allProduct[i].data.collectionByHandle.products.edges)
  }
  return (allProduct)
}

export async function getProduct(handle) {
  const query =
    `{
      productByHandle(handle: "${handle}") {
        id
        title
        handle
        descriptionHtml
        tags
        vendor
        seo {
          description
          title
        }
        images(first: 100) {
          edges {
            node {
              id
              originalSrc
              height
              width     
              altText             
            }
          }
        }
        options {
          id
          name
          values
        }
        variants(first: 250) {
          edges {
            node {
              id
              title
              price
              compareAtPrice
              sku
              quantityAvailable
              availableForSale
              selectedOptions{
                name
                value
              } 
              product {
                id
                handle
                title
              }               
            }
          }
        }
        productType
        collections(first: 50) {
    		  edges {
    		    node {
              handle
              id
    		    }
    		  }
    		}
        spec: metafield(namespace:"c_f",key:"product_specs") {
          value
        }
        blurb: metafield(namespace:"c_f",key:"product_blurb") {
          value
        }
      }
    }`
  ;

  const response = await callShopify(query);

  const product = response.data.productByHandle
    ? response.data.productByHandle
    : [];

  return product;
}

export async function getProductMetafields(handle) {
  const query =
    `{
      productByHandle(handle: "${handle}") {
        id
        title
        spec: metafield(namespace:"c_f",key:"product_specs") {
          id
          value
        }
        blurb: metafield(namespace:"c_f",key:"product_blurb") { 
          id
          value
        }
      } 
    }`
  ;

  const response = await adminAPi(query);
  const product = response.data.productByHandle
    ? response.data.productByHandle
    : [];

  return product;
}

export async function getVariantProduct(id) {
  const query =
    `{
      productVariant(id:"${id}") {
        id
        title
        price
        sku
        image {
          originalSrc
          id
          height
          width
          altText
        }
        product {
          id
          title
          handle
          vendor
          productType
        }
      }
    }`
  ;

  const response = await adminAPi(query);
  const product = response.data.productVariant
    ? response.data.productVariant
    : [];

  return product;
}

export async function createCheckout(lineItems, userEmail, utm) {

  let formattedLineItems
  if(lineItems.length > 0) {
    formattedLineItems = lineItems.map(item => {
      return `{
        variantId: "${item.variantId}",
        quantity:${item.quantity}
      }`  
    })
  } else {
    formattedLineItems = `{ variantId: "${lineItems.variantId}", quantity: ${lineItems.quantity} }`
  }

  const utmO = utm ? JSON.parse(utm.utmc) : ""
  const source = utm ? utmO.utm_source == "facebook" ? "fbclid" : "gclid" : "fbclid"
  const gaAttribute = utm ? `[
    {key:"_elevar__ga",value:"${utm.ga ? utm.ga : 'null'}"},
    {key:"_elevar__fbp",value:"${utm.fbp ? utm.fbp : 'null'}"},
    {key:"_elevar__fbc",value:"${utm.fbc ? utm.fbc : 'null'}"},
    {key: "_elevar_visitor_info",value:"{'${source}':'${utmO.utm_id}','utm_source':'${utmO.utm_source}','utm_medium':'${utmO.utm_medium}','utm_campaign':'${utmO.utm_campaign}','utm_content':'${utmO.utm_content}','utm_term':'${utmO.utm_term}'}"}
  ]` : null
  const gaString = JSON.stringify(gaAttribute)

  const login =
    `mutation 
      {
        checkoutCreate(input: {
          lineItems: [${formattedLineItems}],
          email:"${userEmail}",
          ${utmO.utm_content ? `customAttributes: ${gaAttribute}` : "" }
        }) {
          checkout {
             id
             webUrl
             lineItems(first: 250) {
               edges {
                 node {
                   id
                   title
                   quantity
                   discountAllocations {
                    allocatedAmount {
                      amount
                    }
                   }
                 }
               }
             }
          }
          checkoutUserErrors {
            message
          }
        }
      }      
    `
  ;

  const notLogin =
    `mutation 
      {
        checkoutCreate(input: {
          lineItems: [${formattedLineItems}],
          ${utmO.utm_content ? `customAttributes: ${gaAttribute}` : "" }
        }) {
          checkout {
             id
             webUrl
             lineItems(first: 250) {
               edges {
                 node {
                   id
                   title
                   quantity
                   discountAllocations {
                    allocatedAmount {
                      amount
                    }
                   }
                 }
               }
             }
          }
          checkoutUserErrors {
            message
          }
        }
      }      
    `
  ;

  const response = await callCheckoutShopify(userEmail?login:notLogin, utm);
  const checkout = response.data.checkoutCreate
    ? {status:"success", data: response.data}
    : {status:"error", data: response.errors};

  return checkout;
}

export async function updateCheckout(id, lineItems) {   

  let formattedLineItems
  if(lineItems.length > 0) {
    formattedLineItems = lineItems.map(item => {
      return `{
        variantId: "${item.variantId}",
        quantity:${item.quantity}
      }`  
    })
  } else {
    formattedLineItems = `{ variantId: "${lineItems.variantId}", quantity: ${lineItems.quantity} }`
  }

  const query =
    `mutation 
      {
        checkoutLineItemsReplace(lineItems: [${formattedLineItems}], checkoutId: "${id}") {
          checkout {
             id
             webUrl
             lineItems(first: 250) {
               edges {
                 node {
                   id
                   title
                   quantity
                   discountAllocations {
                    allocatedAmount {
                      amount
                    }
                   } 
                 }
               }
             }
          }
          userErrors {
            message
          }
        }
      }      
    `
  ;

  const response = await callCheckoutShopify(query,null);
console.log(response)
  const checkout = response.data.checkoutLineItemsReplace
    ? {status:"success", data: response.data}
    : {status:"error", data: response.errors} ;

  return checkout;
}

export async function assignUserCheckout(token, checkoutId) {  

  const loginQuery =
    `mutation checkoutCustomerAssociateV2 {
      checkoutCustomerAssociateV2(checkoutId: "${checkoutId}", customerAccessToken: "${token}") {
        checkout {
          id
          webUrl
        }
      }
    }     
    `
  ;

  const logoutQuery =
    `mutation checkoutCustomerDisassociateV2 {
      checkoutCustomerDisassociateV2(checkoutId: "${checkoutId}") {
        checkout {
          id
          webUrl
        }
      }
    }     
    `
  ;
  const response = await callCheckoutShopify(token?loginQuery:logoutQuery,null);

  let checkout 
  if(token) {
    checkout = response.data.checkoutCustomerAssociateV2.checkout
    ? response.data.checkoutCustomerAssociateV2.checkout
    : [];
  }
  else {
    checkout = response.data.checkoutCustomerDisassociateV2.checkout
    ? response.data.checkoutCustomerDisassociateV2.checkout
    : [];
  }
  return checkout;
}

export async function applyDiscountCheckout(discount, checkoutId) {   

  const query =
    `mutation 
      {
        checkoutDiscountCodeApplyV2(checkoutId: "${checkoutId}", discountCode: "${discount}") {
          checkout {
             id
             lineItems(first: 250) {
               edges {
                 node {
                   id
                   title
                   quantity
                   discountAllocations {
                    allocatedAmount {
                      amount
                    }
                   }
                 }
               }
             }
          }
          checkoutUserErrors {
            code
            field
            message
          }
        }
      }      
    `
  ;

  const response = await callCheckoutShopify(query);

  const checkout = response.data.checkoutDiscountCodeApplyV2
    ? response.data.checkoutDiscountCodeApplyV2
    : [];

  return checkout;
}

export async function removeDiscountCheckout(checkoutId) {   

  const query =
    `mutation 
      {
        checkoutDiscountCodeRemove(checkoutId: "${checkoutId}") {
          checkout {
             id
             lineItems(first: 250) {
               edges {
                 node {
                   id
                   title
                   quantity
                   discountAllocations {
                    allocatedAmount {
                      amount
                    }
                   }
                 }
               }
             }
          }
          checkoutUserErrors {
            code
            field
            message
          }
        }
      }      
    `
  ;

  const response = await callCheckoutShopify(query);

  const checkout = response.data.checkoutDiscountCodeRemove
    ? response.data.checkoutDiscountCodeRemove
    : [];

  return checkout;
}

export async function getProdNeeded(content, prods, contentfulBannerList) {

  let prodList = []
  let newArival = null
  let allProdNeeded = null
  function bannerList(products) {
    const bannerLists = []
    products.map((product) =>
        bannerLists.push(contentfulBannerList.find((idxs) => {
            return idxs.sys.id === product.sys.id;
            })
        ))
        
    return (bannerLists)
  }

  content.map((data, i) => 
      data.nodeType == "embedded-entry-block" ? 
        <>
          {data.data.target.sys.contentType.sys.id == "productsBanner" ? 
              bannerList(data.data.target.fields.productList).map((product, idx) => {
                if(product.fields.product) {
                  const prodData = prods.find((idxs) => {
                    return idxs.node.id === product.fields.product;
                    })
                  if (prodData != undefined ) {
                    prodList.push(prodData)
                  }
                }
              }
              )
          :""}
          {data.data.target.sys.contentType.sys.id == "productsList" ? 
              newArival = prods.slice(Math.max(prods.length - 10, 0))
            :""}
        </>
      :""
  )

  if(prodList != null && newArival != null) {
    allProdNeeded = prodList.concat(newArival)
  }
  else if(prodList != null && newArival == null) {
    allProdNeeded = prodList
  }
  else if(prodList == null && newArival != null) {
    allProdNeeded = newArival
  }
  return allProdNeeded
}

export async function getCusomerToken(email,password) {
  const query = `
  mutation customerAccessTokenCreate {
    customerAccessTokenCreate(input: {
      email: "${email}",
      password: "${password}"
    }) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`

  const response = await callShopify(query);
  const token = response.data? response.data: [];
  return token;
}

export async function createCustomer(email,password,firstname,Lastname) {
  
  const query = `
  mutation customerCreate {
    customerCreate(input: {
      email: "${email}",
      password: "${password}",
      firstName: "${firstname}",
      lastName: "${Lastname}"
    }) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
  
`

  const response = await callShopify(query);
  const token = response.data
    ? response.data
    : [];

  return token;
}

export async function recoverCustomer(email) {
  const query = `
  mutation customerRecover {
    customerRecover(email: "${email}") {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`

  const response = await callShopify(query);
  const token = response.data
    ? response.data
    : [];

  return token;
}

export async function activeCustomer(acu,pass) {
  const query = `
  mutation customerActivateByUrl {
    customerActivateByUrl(activationUrl: "${acu}", password:"${pass}") {
      customer {
        id
        email
        firstName
        lastName
        tags
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`

  const response = await callShopify(query);
  const token = response.data
    ? response.data
    : [];

  return token;
}

export async function resetCustomer(resp,pass) {
  const query = `
  mutation customerResetByUrl {
    customerResetByUrl(resetUrl: "${resp}", password:"${pass}") {
      customer {
        id
        email
        firstName
        lastName
        tags
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`

  const response = await callShopify(query);
  const token = response.data
    ? response.data
    : [];

  return token;
}

export async function getCusomerData(token) {
  const query = `
  {
    customer(customerAccessToken: "${token}") {
      id
      email
      firstName
      lastName
      tags
      defaultAddress {
        firstName
        lastName
        company
        address1
        city
        province
        zip
        country
      }
      orders(first: 100) {
        edges {
          node {
            id
            name
            processedAt 
            totalPriceV2 {
              amount
            }
            lineItems(first:100){
              edges {
                node {
                  title
                  variant {
                    title
                    product {
                      handle
                    }
                    image {
                      altText
                      smallImage: transformedSrc(maxWidth: 150)
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

  const response = await callShopify(query);
  const customer = response
    ? response
    : [];

  return customer;
}

export async function getCusomerAddress(token) {
  const query = `
  {
    customer(customerAccessToken: "${token}") {
      defaultAddress {
        id
        firstName
        lastName
        address1
        address2
        city
        province
        zip
        country
        phone
        company
      }
      addresses (first:100) {
        edges {
          node {
            id
            firstName
            lastName
            address1
            address2
            city
            province
            zip
            country
            phone
            company
          }
        }
      }
    }
  }
`

  const response = await callShopify(query);
  const customer = response
    ? response
    : [];

  return customer;
}

export async function getOrderData(id) {
  const query = `
  {
    order(id:"gid://shopify/Order/${id}") {
      name
      lineItems(first:100) {
        edges {
          node {
            title
            variantTitle
            product {
              handle
            }
            originalTotalSet{
              shopMoney {
                amount
              }
            }
            image {
              altText
              smallImage: transformedSrc(maxWidth: 150)
            }
          }
        }
      }
      billingAddress {
        firstName
        lastName
        address1
        city
        province
        zip
        country
      }
      shippingAddress {
        firstName
        lastName
        address1
        city
        province
        zip
        country
      }
      cancelReason
      cancelledAt
      createdAt
      fullyPaid
      displayFinancialStatus
      displayFulfillmentStatus
      fulfillments {
        displayStatus
        trackingInfo {
          number
          url
        }
      } 
      totalDiscounts
      shippingLine {
        title
      }
      totalShippingPrice
      taxLines {
        title
        ratePercentage
        priceSet {
          shopMoney {
            amount
          }
        }
      }
      subtotalPrice
      totalPrice
    }
  }
`

  const response = await adminAPi(query);
  const order = response
    ? response
    : [];

  return order;
}

export async function updateAddress(newAddress) {
  const query = `
    mutation customerAddressUpdate { 
      customerAddressUpdate(
        customerAccessToken: "${newAddress.token}"
        id: "${newAddress.id}"
        address: {
          firstName: "${newAddress.first_name}",
          lastName: "${newAddress.last_name}",
          company: "${newAddress.company}",
          address1: "${newAddress.address1}",
          address2: "${newAddress.address2}",
          city: "${newAddress.city}",
          country: "${newAddress.country}",
          province: "${newAddress.province}",
          zip: "${newAddress.zip}",
          phone: "${newAddress.phone}",
        }
      ) {
        customerAddress {
          id
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  
`

  const response = await callShopify(query);
  const order = response
    ? response
    : [];

  return order;
}

export async function addNewAddress(data) {
  const newAddress = data.newAddress
  const query = `
    mutation customerAddressCreate {
      customerAddressCreate(
        customerAccessToken: "${newAddress.token}"
        address: {
          firstName: "${newAddress.first_name}",
          lastName: "${newAddress.last_name}",
          company: "${newAddress.company}",
          address1: "${newAddress.address1}",
          address2: "${newAddress.address2}",
          city: "${newAddress.city}",
          country: "${newAddress.country}",
          province: "${newAddress.province}",
          zip: "${newAddress.zip}",
          phone: "${newAddress.phone}",
        }
      ) {
        customerAddress {
          id
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `

  const response = await callShopify(query);
  const order = response
    ? response
    : [];

  return order;
}

export async function deleteAddress(newAddress) {

  const query = `
    mutation customerAddressDelete {
      customerAddressDelete(id: "${newAddress.id}", customerAccessToken: "${newAddress.token}") {
        customerUserErrors {
          code
          field
          message
        }
        deletedCustomerAddressId
      }
    }
  `

  const response = await callShopify(query);

  const order = response
    ? response
    : [];

  return order;
}

export async function setDefaultAddress(newAddress) {
  const query = `
    mutation customerDefaultAddressUpdate {
      customerDefaultAddressUpdate(
        customerAccessToken: "${newAddress.token}"
        addressId: "${newAddress.id}"
      ) {
        customer {
          id
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `

  const response = await callShopify(query);
  const order = response
    ? response
    : [];

  return order;
}

export async function searchOrder(data) {
  const query = `
  {
    orders(first:1, query:"name:${data}") {
      edges {
        node {
          id
          lineItems(first:100){
              edges {
                node {
                  title
                  id
                  variant {
                    title
                  }
                }
              }
            }
        }
      }
    }
  }
  `

  const response = await adminAPi(query);
  const order = response
    ? response
    : [];

  return order;
}

export async function searchGiftCard(data) {
  const query = `
  {
    giftCard(id:"gid://shopify/GiftCard/16191939") {
      id
      maskedCode
      lastCharacters
      giftCardCode
    }
  }
  `

  const response = await adminAPi(query);
  const order = response
    ? response
    : [];

  return order;
}