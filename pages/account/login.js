import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import SEO from '@/components/SEO'
import Image from 'next/image'
import cookieCutter from 'cookie-cutter'
import { getContenfulData } from '@/lib/cache'
import { getNavDataNeeded, getVipdiscountList } from '@/lib/contentful'
import { getCustomerToken, getCustomerData, createNewCustomer, sendRecoverEmail, sendSearchOrder, multipassLogin } from '@/utils/helpers'
import { useUpdateVipDiscountCodes } from '@/context/Store'
import { dl_login, dl_sign_up } from '@/lib/dataLayer'

function login({vipDiscount, userIp }) {
  const [customer, setCustomer] = useState(null)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [success, setSuccess] = useState(null)
  const [form, setForm] = useState("login")
  const [onload, setOnLoad] = useState(false)
  const [searchOrder, setSearchOrder] = useState(false)
  const [orderResult, setOrderResult] = useState(false)
  const router = useRouter()
  const updateVipDiscount = useUpdateVipDiscountCodes()

  useEffect(() => {
    if(customer == null) {
      const token = cookieCutter.get('_cds')
      if(token && token != "null"){
        router.push("/account")
        setCustomer(true)
      }
    }
  },[router.asPath]);

  async function searchOrderCustomer() {
    const orderNumber = document.getElementById("orderSearch").value
    const customerInfo = await sendSearchOrder(orderNumber)
    if (customerInfo.result.data.orders.edges.length > 0 ) {
      const orderId = customerInfo.result.data.orders.edges[0].node.id.replace("gid://shopify/Order/","")
      router.push(`/account/order/${orderId}`)
    }
    else {
      setOrderResult(true)
    }
    
  }

  async function setVipDiscount(Vipdisc,expire) {
    const discAmount = vipDiscount.find(disc => Vipdisc.some( vip => disc.fields.tag == vip))
    if(discAmount) {
      cookieCutter.set('_cdt', JSON.stringify(discAmount.fields), { expires: new Date(expire), path:"/" })
      updateVipDiscount(discAmount.fields)
    }  
  }

  async function loginFlow(e) {
    setOnLoad(true)
    e.preventDefault()
    const email = document.getElementById("CustomerEmail").value
    const password = document.getElementById("CustomerPassword").value
    const customerData = {email:email,password:password}
    const customerInfoData = await getCustomerToken(customerData)
    const customerInfo = customerInfoData.data.customerAccessTokenCreate.customerAccessToken

    if (customerInfo != null) {
      const token = customerInfo.accessToken
      const expire = customerInfo.expiresAt
 
      const customerNameData = await getCustomerData(token)
      const customerName = customerNameData.data.data.customer
      const orderSpend = customerName.orders.edges.reduce((n, {node}) => n + parseFloat(node.totalPriceV2.amount), 0)
      const cusomerData = JSON.stringify({
        "firstName":customerName.firstName,
        "email":customerName.email,
        "id":customerName.id,
        "orderCount":customerName.orders.edges.length,
        "orderSpend":orderSpend.toFixed(2), 
        "tag":customerName.tags[0]
      })
      dl_login(cusomerData)
      setVipDiscount(customerName.tags,expire)
      cookieCutter.set('_cdnc', cusomerData, { expires: new Date(expire), path:"/" })
      cookieCutter.set('_cds', token, { expires: new Date(expire), path:"/" })

      const host = window.location.host;
      const multipassToken = await multipassLogin(customerName.email,`https://${host}`)   
      window.location.replace(`https://shop.aftco.com/account/login/multipass/${multipassToken.url}`)
    }

    else {
      setError(true)
      setErrorMessage(customerInfoData.data.customerAccessTokenCreate.customerUserErrors[0].message)
      setOnLoad(false)
    }
  } 

  async function createCustomer(e) {
    e.preventDefault()
    const email = document.getElementById("CreateEmail").value
    const password = document.getElementById("CreatePassword").value
    const firstName = document.getElementById("AddressFirstNameNew").value
    const lastName = document.getElementById("AddressLastNameNew").value
    const customerData = {email:email,password:password,firstname:firstName,lastname:lastName}
    const customerInfo = await createNewCustomer(customerData)
    if(customerInfo.status == "error") {
      setError(true)
      setErrorMessage(customerInfo.message)
    }
    else {
      dl_sign_up(customerInfo.data.customer.id, email)
      cookieCutter.set('_cds', customerInfo.data.token.customerAccessTokenCreate.customerAccessToken.accessToken, { expires: new Date(customerInfo.data.token.customerAccessTokenCreate.customerAccessToken.expiresAt), path:"/" })
      setTimeout(function() {router.push("/account",{ shallow: false })}, 500)
    }
  } 

  async function recoverCustmer(e) {
    e.preventDefault()
    const email = document.getElementById("RecoverEmail").value
    const customerInfo = await sendRecoverEmail(email)
    if(customerInfo.data.customerRecover){
      if(customerInfo.data.customerRecover.customerUserErrors.length > 0) {
        setError(true)
        setErrorMessage(customerInfo.data.customerRecover.customerUserErrors[0].message)
      }
      else {
        setSuccess(true)
      }
    }
    else {
      setError(true)
      setErrorMessage("Request failed, please try again")
    }
  }

  return (
    <div className="page page-width">
      <SEO title="Login Page" description="Login Page of Aftco"/> 
      <div className="customer-form-gird container">
        <div className="customer login">
          <div className={`recover ${form == "recover"?"show":"hide"}`}>
            <h3 tabIndex="-1">Reset your password</h3>
            {success?<p>We've sent you an email with a link to update your password.</p>:<p>We will send you an email to reset your password</p>}
            {error?
              <div className='error-message'>
                <h4>Please adjust the following:</h4>
                <p>{errorMessage}</p>
              </div>
            :""}
              <div className="field">
                <input type="email"
                  name="customer[email]"
                  id="RecoverEmail"
                  autoCorrect="off"
                  autoCapitalize="off"
                  autoComplete="email"
                  placeholder="Email"
                />
                <label htmlFor="RecoverEmail">
                  Email
                </label>
              </div>
              <div className='button--with--loading'>
                { onload && 
                    <div className="loading">
                      <div className="loading--ico">
                        <Image
                          src={"/icons/loading.gif"}
                          alt={"aftco"}
                          width={64}
                          height={64}
                          layout="responsive"
                        />
                      </div>
                    </div>
                }
                <button className='button' onClick={e => recoverCustmer(e)}>Submit</button>
              </div>
              <button className='button--text' onClick={e => setForm("login")}>Cancel</button>
          </div>
          <div className={`create ${form == "create"?"show":"hide"}`}>
            <h3 tabIndex="-1">Create account</h3>
            {error?
              <div className='error-message'>
                <h4>Please adjust the following:</h4>
                <p>{errorMessage}</p>
              </div>
            :""}
              <div className="field">
                <input 
                  type="text" 
                  id="AddressFirstNameNew" 
                  name="first_name"
                  autoComplete="given-name"
                  placeholder="First name" 
                />
                <label htmlFor="AddressFirstNameNew">First name</label>
              </div>
              <div className="field">
                <input 
                  type="text" 
                  id="AddressLastNameNew" 
                  name="last_name"
                  autoComplete="given-name"
                  placeholder="Last name" 
                />
                <label htmlFor="AddressLastNameNew">Last name</label>
              </div>
              <div className="field">
                <input type="email"
                  name="customer[email]"
                  id="CreateEmail"
                  autoCorrect="off"
                  autoCapitalize="off"
                  autoComplete="email"
                  placeholder="Email"
                />
                <label htmlFor="RecoverEmail">Email</label>
              </div>
              <div className="field">
                <input
                  type="password"
                  name="customer[password]"
                  id="CreatePassword"
                  autoComplete="current-password"
                  placeholder="password"
                />
                <label htmlFor="RecoverEmail">Password</label>
              </div>
              <div className='button--with--loading'>
                { onload?
                    <div className="loading">
                      <div className="loading--ico">
                        <Image
                          src={"/icons/loading.gif"}
                          alt={"aftco"}
                          width={64}
                          height={64}
                          layout="responsive"
                        />
                      </div>
                    </div>
                  :""
                }
                <button className='button' onClick={e => createCustomer(e)}>Create</button>
              </div>
              <button className='button--text' onClick={e => setForm("login")}>Cancel</button>
          </div>
          <div className={`login ${form == "login"?"show":"hide"}`}>
          <h3 id="login" tabIndex="-1">Sign In</h3>
          {error?
            <div className='error-message'>
              <h4>Please adjust the following:</h4>
              <p>{errorMessage == "Unidentified customer"? "You have entered an invalid username or password" : errorMessage}</p>
              </div>
          :""}
              <div className="field">
                <input
                  type="email"
                  name="customer[email]"
                  id="CustomerEmail"
                  autoComplete="email"
                  autoCorrect="off"
                  autoCapitalize="off"
                  placeholder="email"
                />
                <label htmlFor="CustomerEmail">Email</label>
              </div>
              <div className="field">
                <input
                  type="password"
                  name="customer[password]"
                  id="CustomerPassword"
                  autoComplete="current-password"
                  placeholder="password"
                />
                <label htmlFor="CustomerPassword">password</label>
              </div>
              <button className='button--text forgot' onClick={e => setForm("recover")}>Forgot your password?</button>
              <div className='button--with--loading'>
                { onload?
                    <div className="loading">
                      <div className="loading--ico">
                        <Image
                          src={"/icons/loading.gif"}
                          alt={"aftco"}
                          width={64}
                          height={64}
                          layout="responsive"
                        />
                      </div>
                    </div>
                  :""
                }
                <button className='button' onClick={e => loginFlow(e)}>Sign in</button>
              </div>
              <button className='button--text' onClick={e => setForm("create")}>Create account</button>
          </div>
        </div>
        <div className="find-your-order">
            <div className="find-your-order__inner">
                <h3>Your Order Status</h3>
                { searchOrder == false ?
                  <div className="search--order">
                    <p >See your order status even if you are not a registered user.</p>
                    <button href="#" onClick={e => setSearchOrder(true)} className="button light">Find Your Order</button>
                  </div>
                :
                  <div className='order--input'>
                    {orderResult?
                    <p>Order Not Found</p>
                    :
                    <p>Enter Your Order Number</p>
                    }
                    <div className='field mb-20'>
                      <input type="text" id="orderSearch" />
                    </div>
                    <button className='button' onClick={e => searchOrderCustomer()}>Search</button>
                  </div>
                }
            </div>
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const contenfulData = await getContenfulData()
  const searchPopular = contenfulData.searchPopular
  const navs = contenfulData.naventries
  const navsData = await getNavDataNeeded(navs, contenfulData)
  const topBar = contenfulData.topBar[0].fields.contents.content
  const basicProdData = {
    "vColor":contenfulData.vColor, 
    "badge":contenfulData.badge, 
    "discount":contenfulData.discount,
    "gwp":contenfulData.gwp
  }

  const vipDiscount = await getVipdiscountList()
  
  return {
    props: {
      navs,
      navsData,
      topBar,
      basicProdData,
      vipDiscount,
      searchPopular
    },
  }
}

export default login