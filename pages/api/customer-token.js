import { getCusomerToken, createCustomer, getCusomerData, recoverCustomer, activeCustomer, resetCustomer } from '@/lib/shopify'

export default async function createCheckoutHandler(req, res) {

  let data
  let status
  let message

  if(req.body.type == "token"){
    data = await getCusomerToken(req.body.detail.email, req.body.detail.password)
  }

  if(req.body.type == "create"){
   const create = await createCustomer(req.body.detail.email, req.body.detail.password, req.body.detail.firstname, req.body.detail.lastname)
    if(create.customerCreate.customer) {
      status = "success"
      const token = await getCusomerToken(req.body.detail.email, req.body.detail.password)
      data={"customer":create.customerCreate.customer,"token":token}
    }
    else {
      status = "error"
      message = create.customerCreate.customerUserErrors[0].message
    }
  }

  if(req.body.type == "csdata"){
    data = await getCusomerData(req.body.token)
  }

  if(req.body.type == "recover"){
    data = await recoverCustomer(req.body.email)
  }

  if(req.body.type == "activeC"){
    const activate = await activeCustomer(req.body.acu, req.body.pass)
    if(activate.customerActivateByUrl.customer) {
      status = "success"
      data={"customer":activate.customerActivateByUrl.customer,"token":activate.customerActivateByUrl.customerAccessToken}
    }
    else {
      status = "error"
      message = activate.customerActivateByUrl.customerUserErrors[0].message
    }
  }

  if(req.body.type == "reset"){
    const activate = await resetCustomer(req.body.resp, req.body.pass)
    if(activate.customerResetByUrl.customer) {
      status = "success"
      data={"customer":activate.customerResetByUrl.customer,"token":activate.customerResetByUrl.customerAccessToken}
    }
    else {
      status = "error"
      message = activate.customerResetByUrl.customerUserErrors[0].message
    }
  }


  res.status(200).json({ data: data, status:status, message:message })

}