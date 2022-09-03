import { createCheckout } from '@/lib/shopify'

export default async function createCheckoutHandler(req, res) {

  const checkout = await createCheckout(req.body.lineItems, req.body.userEmail, req.body.utm)

  res.status(200).json({ checkout: checkout })
}
 