var axios = require('axios');
var FormData = require('form-data');

const username = process.env.REVIEW_USERNAME
const password = process.env.REVIEW_PASSWORD
const domain = process.env.REVIEW_DOMAIN
const hash = process.env.REVIEW_HASH

const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')

async function callReview(prodIds) {
 
  var data = JSON.stringify({
    "productIds": prodIds,
    "apiKey": "pubkey-6elpP057e25iHC7j282W6f814w2x23",
    "storeUrl": domain
  });
  var config = {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Basic ${token}`
    },
    body : data
  };
  
  try {
    const data = await fetch('https://stamped.io/api/widget/badges?isIncludeBreakdown=false&isincludehtml=false', config).then((response) =>
      response.json(),
    );
    return data?data:"Empty Review";
  } catch (error) {
    return "Empty Collections Review";
  }
}

export async function getAllReview(prodIds) {
  let a = prodIds, chunk
  const prodArray = []
  while (a.length > 0) {
    chunk = a.splice(0,100)
    prodArray.push(chunk)
  }

  const promises = [];
  for (let i = 0; i < prodArray.length; i++) {
    promises.push( await callReview(prodArray[i]) )
  }
  const data = await Promise.all(promises)
  const review = {"allReview": data}
  let allReview = []
  for (let i = 0; i < review.allReview.length; i++) {
    allReview = allReview.concat(review.allReview[i])
  }
  return (allReview)
}

export async function getReviewNeeded(prods, reviews) {
  let reviewsNeeded = []

  if(prods) {
    const prodIds = prods.map((prodId) => {    
      const prodIdsUrl = Buffer.from(prodId.node.id, 'base64').toString('binary')
      const realProdId = prodIdsUrl.replace("gid://shopify/Product/", "")
      return {
        productId: realProdId
      }
    })
    prodIds.map(data => {
      const findReview = reviews.find((idxs) => {
          return idxs.productId === data.productId; 
        })
        if ( findReview != undefined ) {
          reviewsNeeded.push(findReview)
        }
    })
  }
  else {
    reviewsNeeded = null
  }

  return reviewsNeeded
}

export async function singleReview(realProdId) {
  
  var url = `http://stamped.io/api/widget/reviews?productId=${realProdId}&productType&email&isWithPhotos&minRating&take&dateFrom&dateTo&storeUrl=${domain}&apiKey=${username}&type`
  var config = {
    method: 'GET',
    redirect: 'follow'
  };
  
  try {
    const data = await fetch(url, config).then((response) =>
      response.json(),
    );
    return data?data:"Empty Review";
  } catch (error) {
    return "Empty Single Review";
  }
}

export async function singleReviewPhoto(realProdId) {
  
  var url = `http://stamped.io/api/widget/reviews?productId=${realProdId}&productType&email&isWithPhotos=true&minRating&take&dateFrom&dateTo&storeUrl=${domain}&apiKey=${username}&type`
  var config = {
    method: 'GET',
    redirect: 'follow'
  };
  
  try {
    const data = await fetch(url, config).then((response) =>
      response.json(),
    );
    return data?data:"Empty Review";
  } catch (error) {
    return "Empty Single Review";
  }
}

export async function singleQuestions(prodName) {

  var config = {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${token}`
    },
    redirect: 'follow'
  };
  
  try {
    const data = await fetch(`https://stamped.io/api/v2/${hash}/dashboard/questions/?search=${prodName}&state=&dateTo&dateFrom`, config).then((response) =>
      response.json(),
    );
    return data?data:"Empty Questions";
  } catch (error) {
    return "Empty Single Questions";
  }
}

export async function createReview(event) {
  event.preventDefault()
  var data = new FormData();
data.append('productId', event.target.productId.value);
data.append('author', event.target.username.value);
data.append('email', event.target.email.value);
data.append('location', 'United States');
data.append('reviewRating', event.target.rating.value);
data.append('reviewTitle', event.target.title.value);
data.append('reviewMessage', event.target.comment.value);
data.append('reviewRecommendProduct', 'true');
data.append('productName', event.target.productName.value);
data.append('productSKU', event.target.productSKU.value);
data.append('productImageUrl', event.target.productImageUrl.value);
data.append('productUrl', event.target.productUrl.value);
data.append('reviewSource', 'api');
data.append('photo0', event.target.myfile.files[0], "file.jpg");

var config = {
  method: 'post',
  url: `https://stamped.io/api/reviews3?apiKey=pubkey-6elpP057e25iHC7j282W6f814w2x23&sId=14243`,
  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response));
})
.catch(function (error) {
  console.log(error);
});
}

export async function createQuestion(event) {
  event.preventDefault()
  var data = JSON.stringify({
    "apiKey": "pubkey-6elpP057e25iHC7j282W6f814w2x23",
    "sId": "14243",
    "productId": event.target.productId.value,
    "name": event.target.username.value,
    "email": event.target.email.value,
    "questionBody": event.target.comment.value,
    "productName": event.target.productName.value,
    "productSKU": event.target.productSKU.value,
    "productUrl": event.target.productImageUrl.value,
    "productImageUrl": event.target.productUrl.value
  });
  
  var config = {
    method: 'post',
    url: 'https://stamped.io/api/questions?debug=1',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
}

export default { getAllReview, singleReview, singleQuestions, createReview }