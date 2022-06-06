import ProductLoadMore from '@/components/product/ProductLoadMore'
import ProductPagination from '@/components/product/ProductPagination'


function ProductListings({ type, products, productsBestSeller, contenfulData, reviews, searchProduct, title, style, slider, sliderSet, ads, bestSeller }) {

  return (
    <div className="product--listing">
      {type == "load" ?
        <ProductLoadMore 
          products={products} 
          productsBestSeller={productsBestSeller}
          style={style}
          contenfulData={contenfulData}
          reviews={reviews} 
          searchProduct={searchProduct}
          title={title}
          ads={ads}
          bestSeller={bestSeller}
        />
      :
        <ProductPagination 
          products={products} 
          productsBestSeller={productsBestSeller}
          style={style}
          slider={slider}
          sliderSet={sliderSet}  
          contenfulData={contenfulData} 
          reviews={reviews} 
          searchProduct={searchProduct}
          title={title}
        />
      }
    </div>
  )
}

export default ProductListings
