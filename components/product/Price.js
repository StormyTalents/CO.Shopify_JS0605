function Price({currency, num, compareAtPrice, discountPrice, id, vip, sale }) {
    
  function VipCal(prc) {
    return prc-(prc*(vip / 100))
  }
const price = parseFloat(num).toFixed(2)
const dscPrice = parseFloat(discountPrice).toFixed(2)
const oldPrice = parseFloat(compareAtPrice).toFixed(2)

  return (
    compareAtPrice?
      !vip ?
        <div className="product--price flex">
          <div className="compare--price">{currency}<span className="price">{oldPrice}</span></div>
          <div className="original--price">{currency}<span className="price">{price}</span></div>
        </div>
      :
        <div className="product--price flex">
          <div className="compare--price">{currency}<span className="price">{oldPrice}</span></div>
          <div className="original--price">{currency}<span className="price">{VipCal(price).toFixed(2)}</span></div>
        </div>
    :
    discountPrice?
      !vip ?
        <div className="product--price discount">
          <div className="compare--price">{currency}<span className="price">{price}</span></div>
          <div className="original--price">
            {discountPrice!= "Free"?currency:""}
            <span className="price">{discountPrice!= "Free"?dscPrice:"Free"}</span>
          </div>
        </div>
        :
        <div className="product--price discount">
          <div className="compare--price">{currency}<span className="price">{price}</span></div>
          <div className="original--price">
            {discountPrice!= "Free"?currency:""}
            <span className="price">{discountPrice!= "Free"?VipCal(dscPrice.toFixed(2)):"Free"}</span>
          </div>
        </div>
    :
      !vip ?
        sale ?
          <div className="product--price discount">
            <div className="original--price">{currency}<span className="price" id={id}>{price}</span></div>
          </div>
        :
        sale ?
          <div className="product--price discount">
            <div className="original--price">{currency}<span className="price" id={id}>{price}</span></div>
          </div>
        :
        <div className="product--price">{price > 0  &&  currency}<span className="price" id={id}>{price > 0 ? price : "Free Gift"}</span></div>
      :
        <div className="product--price flex">
          <div className="compare--price">{currency}<span className="price">{price}</span></div>
          <div className="original--price">{currency}<span className="price">{VipCal(price).toFixed(2)}</span></div>
        </div>
  )
}

export default Price
