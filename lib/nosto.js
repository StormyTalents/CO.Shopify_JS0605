const btoa = require('btoa');

async function callNosto(query) {
    const fetchUrl = `https://api.nosto.com/v1/graphql`;
    const token = Buffer.from(`Pbiurp6ZP0pq8wSg6g1vM17mfRXmMmZ5cEqMiU79ICQgcDTnTVa13F0FwCVTLZiJ`, 'utf8').toString('base64')
    
    const fetchOptions = {
      endpoint: fetchUrl,
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        'Authorization': 'Basic ' + btoa(":" + "Pbiurp6ZP0pq8wSg6g1vM17mfRXmMmZ5cEqMiU79ICQgcDTnTVa13F0FwCVTLZiJ")
      },
      body: JSON.stringify({ query }),
    };
  
    try {
      const data = await fetch(fetchUrl, fetchOptions).then((response) =>
        response.json(),
      );
      return data;
    } catch (error) {
      throw new Error("Could not fetch Nosto products!");
    }
  }

  export async function newSession() {
    const query =
      `mutation {
        newSession(referer: "https://google.com?q=shoes")
      }    
      `
    ;
  
    const response = await callNosto(query);
    const recoProd = response
      ? response.data.newSession
      : [];
    return recoProd;
  }

  export async function cartRelated(items) {
    const item = JSON.stringify({ items })
    const itemUnquoted = item.replace(/"([^"]+)":/g, '$1:');
    let sessionId = "6191e5ef4c599042956477a5";

    const query =
      `mutation {
        updateSession(by: BY_CID, id: "${sessionId}",
          params: {
            event: {
              type: VIEWED_PRODUCT
              target: "400"
            }
            cart: ${itemUnquoted}
          }) {
          pages {
            forCartPage(params: {
              isPreview: false
            }, value: 0) {
              divId
              resultId
              primary {
                name 
                productId
                imageUrl
                listPrice
                price
                url
                reviewCount
                ratingValue
                brand
                skus {
                  name
                  imageUrl
                }
                tags1
              }
            }
          }
        }
      }     
      `
    ;
    
    const response = await callNosto(query);
    const recoProd = response
      ? response.data.updateSession.pages.forCartPage[0].primary
      : [];
    return recoProd;
  }

  export async function productRelated(items, sessionId) {

    const query =
      `mutation {
        updateSession(by: BY_CID, id: "${sessionId}",
          params: {
            event: {
              type: VIEWED_PRODUCT
              target: "${items}"
              ref: "FP-TRENDINGGEAR-geo"
            }
          }
        ) {
          pages {
            forProductPage(params: {
              isPreview: false
            }, product: "${items}") {
              divId
              resultId
              primary {
                name 
                productId
                imageUrl
                listPrice
                price
                url
                reviewCount
                ratingValue
                brand
                skus {
                  name
                  imageUrl
                }
                tags1
              }
            }
          }
        }
      }  
      `
    ;
    
    const response = await callNosto(query);
    const recoProd = response
      ? response.data.updateSession.pages.forProductPage
      : [];
    return recoProd;
  }

  export async function collectionRelated(cat, sessionId, slug) {

    const query =
      `mutation {
        updateSession(by: BY_CID, id: "${sessionId}",
          params: {
            event: {
              type: VIEWED_CATEGORY
              target: "/${slug}"
              ref: "FP-TRENDINGGEAR-geo"
            }
          }
        ) {
          pages {
            forCategoryPage(params: {
              isPreview: false
            }, category: "${cat}") {
              divId
              resultId
              primary {
                name 
                productId
                imageUrl
                listPrice
                price
                url
                reviewCount
                ratingValue
                brand
                skus {
                  name
                  imageUrl
                }
                tags1
              }
            }
          }
        }
      }  
      `
    ;
    
    const response = await callNosto(query);

    const recoProd = response
      ? response.data.updateSession.pages.forCategoryPage
      : [];
    return recoProd;
  }

  export async function homeRelated(sessionId) {

    const query =
      `mutation {
        updateSession(by: BY_CID, id: "${sessionId}",
          params: {
            event: {
              type: VIEWED_PAGE
              target: "https://aftco.com/"
            }
          }
        ) {
          pages {
            forFrontPage(params: {
              isPreview: false
            }) {
              divId
              resultId
              primary {
                name 
                productId
                imageUrl
                listPrice
                price
                url
                reviewCount
                ratingValue
                brand
                skus {
                  name
                  imageUrl
                }
                tags1
              }
            }
          }
        }
      }  
      `
    ;
    
    const response = await callNosto(query);
    const recoProd = response
      ? response.data.updateSession.pages.forFrontPage
      : [];
    return recoProd;
  }

  export async function recommendedProduct() {
    let sessionId = "6191e5ef4c599042956477a5"

    const query =
      `mutation {
        updateSession(by: BY_CID, id: "${sessionId}",
          params: {
            event: {
              type: VIEWED_PAGE
              target: "https://aftco.com/"
            }
          }
        ) {
          recos ( preview: false, image: VERSION_7_200_200) {
            toplist(hours: 168, sort: BUYS, params: {
              minProducts: 1
              maxProducts: 5
            }) {
              primary {
                name 
                productId
                imageUrl
                listPrice
                price
                url
                reviewCount
                ratingValue
                brand
                skus {
                  name
                  imageUrl
                }
                tags1
              }
            }
          }
        }
      }      
      `
    ;
    
    const response = await callNosto(query);
    const recoProd = response
      ? response.data.updateSession.recos.toplist.primary
      : [];
    return recoProd;
  }

  export async function navRecommendedProduct() {
    let sessionId = "6191e5ef4c599042956477a5"

    const query =
      `mutation {
        updateSession(by: BY_CID, id: "${sessionId}",
          params: {
            event: {
              type: VIEWED_PAGE
              target: "https://aftco.com/"
            }
          }
        ) {
          recos ( preview: false, image: VERSION_7_200_200) {
            toplist(hours: 168, sort: BUYS, params: {
              minProducts: 1
              maxProducts: 20
            }) {
              primary {
                name 
                productId
                imageUrl
                listPrice
                price
                url
                reviewCount
                ratingValue
                brand
                skus {
                  name
                  imageUrl
                }
                tags1
              }
            }
          }
        }
      }      
      `
    ;
    
    const response = await callNosto(query);
    const recoProd = response
      ? response.data.updateSession.recos.toplist.primary
      : [];
    return recoProd;
  }

  

export default { recommendedProduct, cartRelated, newSession, navRecommendedProduct }