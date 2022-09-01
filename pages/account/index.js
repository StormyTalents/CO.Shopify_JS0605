import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import SEO from '@/components/SEO'
import Image from 'next/image'
import cookieCutter from 'cookie-cutter'
import { getContenfulData } from '@/lib/cache'
import { getNavDataNeeded } from '@/lib/contentful'
import { getCustomerData } from '@/utils/helpers'
import Link from 'next/link'
import { ArrowDownTwo } from '@/components/icons' 
import SideBar from '@/components/myaccount/sidebar' 
import Address from '@/components/myaccount/address' 


function indexAccount() {

  const [customer, setCustomer] = useState(null)
  const [customerOrder, setCustomerOrder] = useState(null)
  const [onload, setOnLoad] = useState(true)
  const router = useRouter()

   useEffect(() => {
    if(customer == null) {
      const token = cookieCutter.get('_cds')
      if(token && token != "null"){
        getCustomer(token)
      }
      else {
        cookieCutter.set('_cdnc', null)
        router.push("/account/login")
      }
    }
  },[router.asPath]);

  async function getCustomer(token) {
    const customerInfo = await getCustomerData(token)
    const order = customerInfo.data.data.customer.orders.edges
    order.reverse()
    setCustomer(customerInfo.data.data.customer)
    setCustomerOrder(order)
    setOnLoad(false)
  }
  
  function extract(data) {
    const gid = Buffer.from(data, 'base64').toString('binary').replace('gid://shopify/Order/','')
    return gid
  }

  function formatedDate(date) {
    const dt = new Date(date).toLocaleString('en-US', { timeZone: 'America/los_angeles', dateStyle:"medium" })
    return dt
  }

  return (
    
    <div className="customer account container">
      <SEO title="Account Page" description="Account Page of Aftco"/> 
      <div className="customer__grid">
        <SideBar />
        {customer?
          <div className="customer__main">
            <h3>Account details</h3>
            <div className="customer__details">
              <p>
              <span>First Name</span><br />
              {customer?customer.firstName:""}
              </p>
              <p>
              <span>Last Name</span><br />
              {customer?customer.lastName:""}
              </p>
              <p>
              <span>Email</span><br />
              {customer?customer.email:""}
              </p>
            </div>
            <h3 className="customer__title customer__title--with-link">Saved Addresses <Link href="/account/addresses"><a className="button--text">Edit</a></Link></h3>
            {customer.defaultAddress?
            <div className="customer__addresses">
              <Address address={customer.defaultAddress}/>
              <Link href="/account/addresses"><a className="button light">Add a new address</a></Link>
            </div>
            :
              <div className="customer__addresses">
                <Link href="/account/addresses"><a className="button light">Add a new address</a></Link>
              </div>
            }
            <h3 className="customer__title customer__title--with-link">Order history <a href="#">View</a></h3>
            {!customerOrder ? <p>You haven't placed any orders yet.</p>:""}
            <table role="table" className="order-history">
              <tbody role="rowgroup">
                {customerOrder?customerOrder.map(order =>
                  <tr role="row" key={order.node.name}>
                    <td headers="ColumnOrder" role="cell">
                    <p>
                        <span>{order.node.name}</span>
                        {formatedDate(order.node.processedAt)}
                    </p>
                    </td>
                    <td headers="RowOrder ColumnProduct" role="cell">
                    {order.node.lineItems.edges.map(item =>
                        <p key={item.node.title}><strong>{item.node.title}</strong></p>
                    )}
                    </td>
                    <td headers="RowOrder ColumnViewDetails" role="cell">
                    <Link href={`/account/order/${extract(order.node.id)}`}>
                      <a className="view-link--icon" aria-label={`/account/order/${extract(order.node.id)}`}>
                        <div className="arrow"><ArrowDownTwo/></div>
                      </a>
                    </Link>
                    </td>
                  </tr>           
                ):""}
              </tbody>
            </table>
          </div>
        :
          onload?
          <div className="customer__main">
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
          </div>
          :""
        }
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
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
  
  return {
    props: {
      navs,
      navsData,
      topBar,
      basicProdData,
      searchPopular
    },
  }
}

export default indexAccount
