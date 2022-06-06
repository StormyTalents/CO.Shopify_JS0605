import Link from 'next/link'
import RichText from '@/components/richtext'
import { useState, useEffect } from 'react'
import cookieCutter from 'cookie-cutter'
import { useRouter } from 'next/router'
import { useUpdateVipDiscountCodes } from '@/context/Store'

function TopBanner({topBar}) {
  const [customer, setCustomer] = useState(null)
  const [subAccount, setSubAccount] = useState(false)
  const router = useRouter() 
  const updateVipDiscount = useUpdateVipDiscountCodes()

  useEffect(() => {
      const token = cookieCutter.get('_cds')
      if(token == undefined || token == "null"){
        setCustomer(null)
      }
      else {
        const getName = cookieCutter.get('_cdnc')

          const firstName = getName && getName != "null" ? JSON.parse(getName).firstName : "Customer"
          setCustomer(firstName)
      }
  },[router.asPath]);

  async function logout() {
    await cookieCutter.set('_cdnc', null,{ expires: new Date(0), path:"/" })
    await cookieCutter.set('_cds', null,{ expires: new Date(0), path:"/" })
    await cookieCutter.set('_cdt', null,{ expires: new Date(0), path:"/" })
    updateVipDiscount("")
    const host = window.location.host;
    window.location.replace(`https://shop.aftco.com/pages/nextlogout?backto=${host}`)
  }

  function updateNavIn() {
    setSubAccount(true) 
  }

  function updateNavOut() {
    setSubAccount(false) 
  }

  return (
      <div className="top--banner bg--blue">
        <div className={`hover--wrap ${subAccount?"active":"not--active"}`}></div>
        <div className="container">
          { topBar && <RichText content={topBar}/> }
          <div className='left--top--nav'>
            <Link href="/pages/store-locator"><a className='h6'>Find My Store</a></Link>
            {customer?
              <div className={`sub--account--wrap ${subAccount?"active":"not--active"}`} onMouseOver={updateNavIn} onMouseLeave={updateNavOut}>
                <a className='h6'>Hi, {customer && customer != "null"?customer:""}</a>
                <div className='account--sub'>
                  <div className={`account--sub--wraper`} >
                    <p><Link href="/account" prefetch={false}><a>Account Details</a></Link></p>
                    <p><Link href="/account/addresses" prefetch={false}><a>Saved Addresses</a></Link></p>
                    <p><Link href="/account/order-history" prefetch={false}><a>Order History</a></Link></p>
                    <p><a href="#" onClick={logout}>Log Out</a></p>
                  </div>
                </div>
              </div>
            :
              <Link href="/account" prefetch={false}><a className='h6'>My Account</a></Link>
            }
            
          </div>
        </div>
      </div>
  )
}

export default TopBanner
