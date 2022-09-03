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
    url: `https://aftco-test.myshopify.com/admin/api/2022-01/products.json?ids=${id}`, 
    method: 'GET',
    headers: shopifyConfig
  })

  let inventory = []
  shopifyProduct.data.products.map(data => {
    const variants = data.variants
    const product = {
      inStock: variants.some(
        (v) => v.inventory_quantity > 0 || v.inventory_policy === 'continue'
      ),
      useStock:variants[0].inventory_management != null?"useStock":"notUseStock",
      lowStock:
        variants.reduce((a, b) => a + (b.inventory_quantity || 0), 0) <= 10,
      variants: variants.map((variant) => ({
        id: variant.id,
        inStock:
          variant.inventory_quantity > 0 ||
          variant.inventory_policy === 'continue',
        lowStock: variant.inventory_quantity <= 5,
        quantity: variant.inventory_quantity,
      })),
    }
    inventory.push(product)
  })
  res.statusCode = 200
  res.json(inventory)
}
