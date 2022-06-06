async function callKlevu(query, fetchUrl) {
    
    const fetchOptions = {
      endpoint: fetchUrl,
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: query,
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

  export async function searchPrediction(searchText) {
    const query =
    JSON.stringify({
            "context": {
                "apiKeys": [
                "klevu-162747995647913985"
                ]
            },
            "suggestions": [
            {
                "id": "mySuggestionsQuery1",
                "typeOfQuery": "AUTO_SUGGESTIONS",
                "query": searchText,
                "limit": 5
            }
            ],
            "recordQueries": [
                {
                  "id": "strict",
                  "typeOfRequest": "SEARCH",
                  "settings": {
                    "query": {
                      "term": searchText
                    },
                    "limit": 1000,
                    "typeOfSearch": "OR",
                    "typeOfRecords": [
                      "KLEVU_PRODUCT"
                    ]
                  }
                },
                {
                  "id": "wildcard",
                  "typeOfRequest": "SEARCH",
                  "settings": {
                    "query": {
                      "term": searchText
                    },
                    "limit": 1000,
                    "typeOfRecords": [
                      "KLEVU_PRODUCT"
                    ]
                  }
                }
              ],
      } )
    ;
    const fetchUrl = "https://eucs27v2.ksearchnet.com/cs/v2/search"
    const response = await callKlevu(query, fetchUrl);
    const recoProd = response
      ? response
      : [];
    return recoProd;
  } 

  export async function searchPopularProd() {
    const query =
    JSON.stringify({
      "context": {
          "apiKeys": [
          "klevu-162747995647913985"
          ]
      },
      "recordQueries": [
          {
            "id": "headersearch",
            "typeOfRequest": "SEARCH",
            "settings": {
              "query": {
                "term": "samurai"
              },
              "limit": 4,
              "typeOfRecords": [
                "KLEVU_PRODUCT"
              ]
            }
          }
        ],
} )
    ;
    const fetchUrl = "https://eucs27v2.ksearchnet.com/cs/v2/search"
    const response = await callKlevu(query, fetchUrl);
    const recoProd = response
      ? response
      : [];
    return recoProd;
  }

  export async function searchPopularSugges() {
    const query =
    JSON.stringify({
      "context": {
          "apiKeys": [
          "klevu-162747995647913985"
          ]
      },
      "suggestions": [
      {
          "id": "mySuggestionsQuery1",
          "typeOfQuery": "AUTO_SUGGESTIONS",
          "query": "samurai",
          "limit": 5
      }
      ]
} )
    ;
    const fetchUrl = "https://eucs27v2.ksearchnet.com/cs/v2/search"
    const response = await callKlevu(query, fetchUrl);
    const recoProd = response
      ? response
      : [];
    return recoProd;
  }

  export default { searchPrediction, searchPopularProd, searchPopularSugges }