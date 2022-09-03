import axios from 'axios'
const domain = process.env.SHOPIFY_STORE_DOMAIN
const storefrontAccessToken = process.env.SHOPIFY_STORE_FRONT_ACCESS_TOKEN

export default async function send(req, res) {
  const {
    query: { id },
  } = req

  if (!id) {
    return res.status(401).json({ error: 'Product ID required' })
  }

  // Setup our Shopify connection
  const shopifyConfig = {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': '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',
  }

  // Fetch the metafields for this product
  const shopifyProduct = await axios({
    url: `https://${domain}/admin/api/2021-04/products/${id}.json`,
    method: 'GET',
    headers: shopifyConfig,
  })

  res.statusCode = 200
  res.json(shopifyProduct.data.product)
}
