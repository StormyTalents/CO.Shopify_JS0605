import { useState, useEffect } from 'react'
import cookieCutter from 'cookie-cutter'
import Link from 'next/link'
import { useUpdateVipDiscountCodes } from '@/context/Store'

function sideBar() {
    
  const updateVipDiscount = useUpdateVipDiscountCodes()
      
  async function logout() {
    await cookieCutter.set('_cdnc', null,{ expires: new Date(0), path:"/" })
    await cookieCutter.set('_cds', null,{ expires: new Date(0), path:"/" })
    await cookieCutter.set('_cdt', null,{ expires: new Date(0), path:"/" })
    updateVipDiscount("")
    const host = window.location.host;
    window.location.replace(`https://shop.aftco.com/pages/nextlogout?backto=${host}`)
  }

    const [customer, setCustomer] = useState(null)

    useEffect(() => {
      if(customer == null) {
        const token = cookieCutter.get('_cds')
        if(token == undefined){
          setCustomer(true)
        }
        else {
          setCustomer(false)
        }
      }
    },[]);

    return (
        <div className="customer__sidebar customer__sidebar--left">
            {customer?
            <>
                <p><Link href="/account/login"><a>Login</a></Link></p>
                <p><Link href="/account/login"><a>Search Another Order</a></Link></p>
            </>
            :
            <>
            
                <h3>Welcome Back!</h3>
                <p><Link href="/account"><a>Account Details</a></Link></p>
                <p><Link href="/account/addresses"><a>Saved Addresses</a></Link></p>
                <p><Link href="/account/order-history"><a>Order History</a></Link></p>
                <p><a href="#" onClick={e => logout(e)}>Log Out</a></p>
            </>
            }
        </div>
    )
}

export default sideBar