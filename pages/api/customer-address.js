import { getCusomerAddress , updateAddress, addNewAddress, deleteAddress, setDefaultAddress } from '@/lib/shopify'

export default async function customerAddress(req, res) {

      let data

      if(req.body.type == "update") {
        data = await updateAddress(req.body.data)
      }

      if(req.body.type == "add") {
        data = await addNewAddress(req.body.data)
      }

      if(req.body.type == "delete") {
        data = await deleteAddress(req.body.data)
      }

      if(req.body.type == "set") {
        data = await setDefaultAddress(req.body.data)
      }

      if(req.body.type == "request") {
        data = await getCusomerAddress(req.body.data)
      }

      res.status(200).json({ data: data })

    }