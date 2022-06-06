import Price from '@/components/product/Price'
import ReviewStar from '@/components/product/ReviewStar'

function ProductInfo({ sku, title, price, compareAtPrice, vip, reviewRate, reviewUser, layout }) {

  const style = sku ? sku.split("-") : "aftco"

  function slideTo() {
    if (typeof window !== 'undefined') {
      var element = document.querySelector(".review--section--anchor");
      window.scrollTo({
        top: element.offsetTop - 50,
        behavior: 'smooth'
      });
    }
  }
  
  return (
    layout != "mobile"?
    <div className="font-primary">
      <div className="header--info">
        <div className="review-summary" data-rate={reviewUser} onClick={(e) => slideTo()}>
          {reviewUser >= 1 ? <><ReviewStar star={reviewRate}/> {reviewUser} reviews </> :"0 reviews"}
        </div>
        <span className="sku">Style #{style[0]}</span>
      </div>
      <h1 className="leading-relaxed font-extrabold text-3xl text-palette-primary py-2 sm:py-4 h3">
        {title}
      </h1>
      <div className="text-xl text-palette-primary font-medium py-4 px-1">
      {vip?
        <Price 
          currency="$" 
          num={price} 
          compareAtPrice={compareAtPrice} 
          vip={vip}
        />
        :
        <Price 
          currency="$" 
          num={price} 
          compareAtPrice={compareAtPrice}
        />
      }
      </div>
    </div>
    :
    <div className="font-primary mb-30">
      <div className="flex">
        <h3 className="leading-relaxed font-extrabold text-3xl text-palette-primary py-2 sm:py-4">
          {title}
        </h3>
        <div className="text-xl text-palette-primary font-medium py-4 px-1">
          <Price
            currency="$"
            num={price}
            compareAtPrice={compareAtPrice}
          />
        </div>
      </div>
      <div className="header--info">
        <div className="review-summary" data-rate={reviewUser}  onClick={(e) => slideTo()}>
          {reviewUser >= 1 ? <><ReviewStar star={reviewRate}/> {reviewUser} reviews </> :""}
        </div>
        <span className="sku">Style #{style[0]}</span>
      </div>
    </div>
  )
}

export default ProductInfo
