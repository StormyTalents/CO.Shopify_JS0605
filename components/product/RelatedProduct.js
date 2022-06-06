import ProductCardRelated from '@/components/product/ProductCardRelated'
import ProductCard from '@/components/product/ProductCard'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";


function RelatedProduct(node) {

  var settings = {
    dots: false,
    infinite: true,
    slidesToShow: node.sliderSet?node.sliderSet:3,
    slidesToScroll: 1, 
    swipeToSlide: true,
    cssEase: 'linear',
    speed: 250,
    useTransform: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: node.sliderSet
        }
      }
    ]
  };

  function getGridNumber(data) {
    if (data == 2 ) {
      return "half"
    }
    if (data == 3) {
      return "one-third" 
    }
    if (data == 4) {
      return "one-four"
    }
    if (data == 5) {
      return "one-five"
    }
  }

    return (
      <div className="related--product--wrap">
        { node.slider == "yes" ?
          <div className="related--product">
           {node.title? <h2 className='h3'>{node.title}</h2> : node.cart >= 1?<h3>You May Also Like</h3>:<h3>Trending Gear</h3>}
            <Slider {...settings}>
              { node.product.length >= 1 ?
                  node.product.map((product, index) => (
                    <div className="related--product--item" key={index}>
                      {!node.prodType || node.prodType == "Nosto" ?
                        <ProductCardRelated product={product} vColor={node.vColor} badge={node.badge} star={node.star}/>
                      :
                        <ProductCard key={index} allProd={node.product} contenfulData={node.contenfulData} product={product} vColor={node.vColor} reviews={node.reviews} />
                      }
                    </div>
                  )) : ""
                } 
            </Slider>
          </div>
        :
          <div className="related--product">
            {node.title ? 
              <h2 className='h3'>{node.title}</h2> 
            : 
              node.cart >= 1?<h3>You May Also Like</h3>:<h3>Trending Gear</h3>
            }
            <ul className="cart--related grid">
              { node.product.length >= 1 ?
                  node.product.map((product, index) => (
                    !node.prodType || node.prodType == "Nosto" ?
                      <ProductCardRelated product={product} vColor={node.vColor} badge={node.badge} star={node.star} grid={getGridNumber(node.gridSet)} keyIdx={index}/>
                    :
                      <ProductCard key={index} allProd={node.product} contenfulData={node.contenfulData} product={product} vColor={node.vColor} reviews={node.reviews} />
                  )) : "" 
              }
            </ul>
          </div>
      }
      </div> 
    )
}
export default RelatedProduct