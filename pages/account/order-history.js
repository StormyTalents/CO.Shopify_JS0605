import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import SEO from '@/components/SEO'
import Image from 'next/image'
import cookieCutter from 'cookie-cutter'
import { getContenfulData } from '@/lib/cache'
import { getNavDataNeeded } from '@/lib/contentful'
import { getCustomerData } from '@/utils/helpers'
import Link from 'next/link'
import SideBar from '@/components/myaccount/sidebar' 


function orderHistory() {

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
  
  return (
    
    <div className="customer account container">
      <SEO title="Account Order History List Page" description="Account Order History List Page of Aftco"/> 
      <div className="customer__grid">
        <SideBar />
        {customer?
          <div className="customer__main">
            <h3 className="customer__title customer__title--with-link">Order history</h3>
            {!customerOrder ? <p>You haven't placed any orders yet.</p>:""}
            <table role="table" className="order-history">
              <tbody role="rowgroup">
                {customerOrder?customerOrder.map(order =>
                    order.node.lineItems.edges.map(item =>
                        <tr role="row" key={order.node.name}>
                            <td headers="ColumnOrder" role="cell">
                                <Image
                                    src={item.node.variant?item.node.variant.image.smallImage:"/icons/logo.png"}
                                    alt={item.node.variant?item.node.variant.image.altText:"aftco"}
                                    width={item.node.variant?150:100}
                                    height={item.node.variant?150:38}
                                    layout="responsive"
                                />
                            </td>
                            <td headers="RowOrder ColumnProduct" role="cell">
                                <p key={item.node.title}>
                                    <span>{order.node.name}</span>
                                    <strong>{item.node.title}</strong>
                                    <span>{item.node.variant?item.node.variant.title:""}</span>
                                </p>
                            </td>
                            <td headers="RowOrder ColumnViewDetails" role="cell">
                              {item.node.variant?
                                <Link href={`/products/${item.node.variant.product.handle}#reviewSection`}>
                                  <a className="button light" aria-label={`/products/${item.node.variant.product.handle}`}>Write Review</a>
                                </Link>
                              :""}
                            </td>
                        </tr> 
                    )   
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

export default orderHistory
