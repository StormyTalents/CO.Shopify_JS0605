import { getVariantProduct } from '@/lib/shopify'

export default async function getDiscountProd(req, res) {

  const prod = await getVariantProduct(req.body.id)

  res.status(200).json({ product: prod })
}