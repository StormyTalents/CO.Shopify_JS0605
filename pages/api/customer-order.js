import { searchOrder } from '@/lib/shopify'

export default async function customerAddress(req, res) {
      const result = await searchOrder(req.body.orderNumber)
      res.status(200).json({ result })
    }