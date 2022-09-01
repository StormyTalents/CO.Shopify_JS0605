import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import SEO from '@/components/SEO'
import Image from 'next/image'
import cookieCutter from 'cookie-cutter'
import { getContenfulData } from '@/lib/cache'
import { getNavDataNeeded, getVipdiscountList } from '@/lib/contentful'
import { setResetCustomer } from '@/utils/helpers'
import { useUpdateVipDiscountCodes } from '@/context/Store'

function Page({vipDiscount}) {

  const router = useRouter()
  const updateVipDiscount = useUpdateVipDiscountCodes()

  const [setResp, setRetResp] = useState(null)
  const [error, setError] = useState(null)
  const [onload, setOnLoad] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  async function setVipDiscount(vipdisc,expire) {
    const discAmount = vipDiscount.find(disc => vipdisc.some( vip => disc.fields.tag == vip))
    if(discAmount) {
      cookieCutter.set('_cdt', JSON.stringify(discAmount.fields), { expires: new Date(expire), path:"/" })
      updateVipDiscount(discAmount.fields)
    }  
  }

  async function signUpCustomer(e) {

    setOnLoad(true)
    e.preventDefault()

    const pass = document.getElementById("CustomerPassword").value
    const activate = await setResetCustomer(setResp,pass)

    if(activate.status == "error") {
      setError(true)
      setErrorMessage(activate.message)
    }
    else {
      const cusomerData = JSON.stringify({
        "firstName":activate.data.customer.firstName,
        "email":activate.data.customer.email,
        "id":activate.data.customer.id,
        "orderCount":0,
        "orderSpend":0, 
        "tag":activate.data.customer.tags[0]
      })
      
      setVipDiscount(activate.data.customer.tags,activate.data.token.expiresAt)
      cookieCutter.set('_cds', activate.data.token.accessToken, { expires: new Date(activate.data.token.expiresAt), path:"/" })
      cookieCutter.set('_cdnc', cusomerData, { expires: new Date(activate.data.token.expiresAt), path:"/" })
      setTimeout(function() {router.push("/account",{ shallow: false })}, 500)
    }
  }

    useEffect(() => {
      const { resp } = router.query
      if(router.isReady) {
        if(resp){
            setRetResp(resp)
        }
        else {
          router.push("/account/login")
        }
      }
    },[router.isReady]);
    
    return (
        <div className="page page-width activate--page">
          <SEO title="Account Reset Password Page" description="Account Reset Password Page of Aftco"/> 
        <div className="customer-form-gird container">
          <div className="customer activate">
            <div className={`login`}>
            <h3 id="login" tabIndex="-1">Reset Your Password</h3>
            {error?
              <div className='error-message'>
                <h4>Please adjust the following:</h4>
                <p>{errorMessage}</p>
                </div>
            :""}
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
                  <button className='button' onClick={e => signUpCustomer(e)}>Reset</button>
                </div>
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

export default Page