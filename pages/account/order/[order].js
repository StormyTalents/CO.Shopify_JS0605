import Link from 'next/link'
import { getContenfulData } from '@/lib/cache'
import { getNavDataNeeded } from '@/lib/contentful'
import { getOrderData } from '@/lib/shopify'
import Image from 'next/image'
import SideBar from '@/components/myaccount/sidebar'

const Post = ({order,orderData}) => {

const orderD = orderData.data.order

function formatedDate(date) {
  const dt = new Date(date).toLocaleString('en-US', { timeZone: 'America/los_angeles', dateStyle:"long", timeStyle:"short" })
  return dt
}

function paymentStatus(string) {
  const low = string.toLowerCase()
  return low.charAt(0).toUpperCase() + low.slice(1);
}

function subTotal(total, discount) {
  const sub = Number(total) + Number(discount)
  return sub
}

return (
<div className="customer order container">
  <div className="customer__grid">
    <SideBar/>
    <div className="customer__main">
      <div className="order__title">
        <h3>Placed on {formatedDate(orderD.createdAt)}</h3>
          {orderD.cancelledAt?
            <p>Order Cancelled on {formatedDate(orderD.cancelledAt)}<br />
              Reason: {orderD.cancelReason}</p>
          :""}
        <strong className="order__title__name">{orderD.name}</strong>
      </div>

      <table role="table" className="order-details">
        <tbody role="rowgroup">
          {orderD.lineItems.edges.map(order =>
            <tr role="row">
            <td
              id="Row"
              headers="ColumnProduct"
              role="rowheader"
              scope="row"
              data-label="customer.order.product"
            >
              <Image
                  src={order.node.image.smallImage}
                  alt={order.node.image.altText?order.node.image.altText:"aftco"}
                  width={150}
                  height={150}
                  layout="responsive"
              />
            </td>
            <td
              id="Rowline_item.key"
              headers="ColumnProduct"
              role="rowheader"
              scope="row"
              data-label="customer.order.product"
            >
              <div className="order-detail">
                <strong>{order.node.title}</strong>
                <strong>$ {order.node.originalTotalSet.shopMoney.amount}</strong>
              </div> 
              <div className="properties">
                  <span>{order.node.variantTitle}</span>
              </div>
            </td>
            <td headers="Rowline_item.key ColumnTotal" role="cell">
              <Link href={`/products/${order.node.product.handle}`}><a className="button light">View Details</a></Link>
            </td>
          </tr>
          )}
            
        </tbody>
      </table>
    </div>

    <div className="customer__sidebar customer__sidebar--right">
      <div className="order-information">
        <div className="order-information__block">
          <p><strong>Billing Address</strong></p>
          <div className="customer__addresses">
            <p>
              {orderD?orderD.billingAddress.firstName:""} {orderD?orderD.billingAddress.lastName:""} <br/>
              {orderD?orderD.billingAddress.address1:""} <br/>
              {orderD?orderD.billingAddress.city:""} {orderD?orderD.billingAddress.city:""} {orderD?orderD.billingAddress.zip:""} <br/>
              {orderD?orderD.billingAddress.country:""}
            </p>
          </div>
        </div>
        <div className="order-information__block">
          <p>
            <strong>Payment Status:</strong>
            {paymentStatus(orderD.displayFinancialStatus)}
          </p>
        </div>
        <div className="order-information__block">
          <p><strong>Shipping Address</strong></p>
          <div className="customer__addresses">
            <p>
              {orderD?orderD.shippingAddress.firstName:""} {orderD?orderD.shippingAddress.lastName:""} <br/>
              {orderD?orderD.shippingAddress.address1:""} <br/>
              {orderD?orderD.shippingAddress.city:""} {orderD?orderD.shippingAddress.city:""} {orderD?orderD.shippingAddress.zip:""} <br/>
              {orderD?orderD.shippingAddress.country:""}
            </p>
          </div>
        </div>
        <div className="order-information__block">
          <p>
            <strong>Fulfillment Status:</strong>
            { orderD.displayFulfillmentStatus? orderD.displayFulfillmentStatus : "Unfulfilled" }
          </p>
          <p>
            {orderD.fulfillments.length != 0 ?
              <>
              <strong>Shipment Status:</strong>
              {orderD.fulfillments.map(ship =>
                <>
                  <span>{ship.displayStatus}</span><br/>
                  <strong className='mt-10'>Tracking Number:</strong>
                  {ship.trackingInfo.map(track => 
                    <span>FEDEX <a href={track.url}>#{track.number}</a></span>
                    )}
                </>
                )}
              </>
              : ""
            }
          </p>
        </div>

        <table  role="table" className="order-information__summary">
          <thead>
            <tr>
              <th colspan="2">Summary</th>
            </tr>
          </thead>
          <tfoot role="rowgroup">
            <tr role="row">
              <td id="RowSubtotal" role="rowheader" scope="row">Subtotal</td>
              <td headers="RowSubtotal" role="cell" data-label="customer.order.subtotal">$ {subTotal(orderD.subtotalPrice,orderD.totalDiscounts )}</td>
            </tr>
            {orderD.totalDiscounts != "0.00"?
              <tr role="row">
                <td id="RowSubtotal" role="rowheader" scope="row">Discount</td>
                <td headers="RowSubtotal" role="cell" data-label="customer.order.subtotal">-$ {orderD.totalDiscounts}</td>
              </tr>
            :""}
            {orderD.shippingLine ?
              <tr role="row">
                <td id="RowSubtotal" role="rowheader" scope="row">Shipping({orderD.shippingLine.title})</td>
                <td headers="RowSubtotal" role="cell" data-label="customer.order.subtotal">$ {orderD.totalShippingPrice}</td>
              </tr>
            :""}
            {orderD.taxLines?
            orderD.taxLines.map( tax =>
              <tr role="row">
                <td id="RowSubtotal" role="rowheader" scope="row">Tax({tax.title} {tax.ratePercentage}%)</td>
                <td headers="RowSubtotal" role="cell" data-label="customer.order.subtotal">$ {tax.priceSet.shopMoney.amount}</td>
              </tr>
            )
            :""}
            <tr role="row">
              <td id="RowTotal" role="rowheader" scope="row">Total</td>
              <td headers="RowTotal" role="cell" data-label="customer.order.total">$ {orderD.totalPrice}</td>
            </tr>
          </tfoot>
        </table>

        <p className="order-information__helper">
          <a href="https://aftco.vercel.app/pages/contact">Contact Us</a><br />
          <a href="https://aftco.vercel.app/pages/refund-policy">Returns & Exchanges</a>
        </p>
      </div>
    </div>
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
    const { order } = context.params;
    const orderData = await (getOrderData(order))
    return {
      props: {
        navs,
        navsData,
        topBar,
        basicProdData,
        order,
        orderData,
        searchPopular
      },
    }
  }

export default Post