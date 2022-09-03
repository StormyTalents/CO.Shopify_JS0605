import { multipassEncode } from '@/lib/shopify'

export default async function createCheckoutHandler(req, res) {

  const url = await multipassEncode(req.body.email,req.body.host)

  res.status(200).json({ url: url })
}