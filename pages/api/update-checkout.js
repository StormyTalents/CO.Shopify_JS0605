import { updateCheckout, assignUserCheckout, applyDiscountCheckout, removeDiscountCheckout } from '@/lib/shopify'

export default async function updateCheckoutHandler(req, res) { 

  let checkout

  if(req.body.type == "updateLine") {
    checkout = await updateCheckout(req.body.checkoutId, req.body.lineItems)
  }
  else if(req.body.type == "updateUser") {
    checkout = await assignUserCheckout(req.body.token, req.body.checkoutId)
  } 
  else if(req.body.type == "applyDiscount") {
    checkout = await applyDiscountCheckout(req.body.discount, req.body.checkoutId)
  }
  else if(req.body.type == "removeDiscount") {
    checkout = await removeDiscountCheckout(req.body.checkoutId)
  }

  res.status(200).json({ checkout: checkout })
}
 