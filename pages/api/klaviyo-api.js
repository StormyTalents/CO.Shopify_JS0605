import { signUp, sendBackInStock } from '@/lib/klaviyo'

export default async function klavioHandler(req, res) {

  let data

  if(req.body.type == "signup") {
    data = await signUp(req.body.email)
  } else {
    data = await sendBackInStock(req.body.email, req.body.varId)
  }

  res.status(200).json({ status: data })
}
