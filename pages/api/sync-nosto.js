import { homeRelated, productRelated, collectionRelated, newSession } from '@/lib/nosto'

export default async function getNosto(req, res) {

    let data

    if(req.body.type == "front") {
        data = await homeRelated(req.body.sessionId)
    }

    if(req.body.type == "pdp") {
        data = await productRelated(req.body.prodId, req.body.sessionId)
    } 

    if(req.body.type == "cat") {
        data = await collectionRelated(req.body.prodId, req.body.sessionId, req.body.slug)
    } 

    if(req.body.type == "session") {
        data = await newSession(req.body.prodId)
    }

  res.status(200).json({ product: data })
}