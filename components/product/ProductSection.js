import ProductDetails from '@/components/product/ProductDetails'
import RelatedPost from '@/components/product/RelatedPost'
import Review from '@/components/product/Review'
import { useState, useEffect  } from 'react'
import RelatedProduct from '@/components/product/RelatedProduct'
import RichText from '@/components/richtext'

function ProductSection({ productData, metafields, richTextBasicData, blogPost, productQuantityData, reviews, reviewsPhoto, questions, relatedProd, chainProduct, sizeChartContent, productsCollection }) {

  const[mobile, setMobile] = useState(false) 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const w = window.innerWidth;
      if(w <= 768) {
        setMobile(true)
      }
    }
  },[]);

  return (
    <div className="single--product--page">
      <div className="container">
        <ProductDetails 
          productData={productData} 
          productQuantityData={productQuantityData} 
          reviews={reviews} 
          chainProduct={chainProduct} 
          metafields={metafields} 
          slider={mobile} 
          relatedProduct={relatedProd} 
          richTextBasicData={richTextBasicData} 
          sizeChartContent={sizeChartContent}
        />
      </div>
      {richTextBasicData.richText?
      <div className="rich--text mb-100">
        {richTextBasicData.richText.fields.content?
          <RichText 
            content={richTextBasicData.richText.fields.content.content} 
            products={richTextBasicData.products} 
            basicProdData={richTextBasicData.basicProdData} 
            richTextData={richTextBasicData.richTextData} 
            reviews={richTextBasicData.reviewNeeded}
            productsCollection={productsCollection}
          />
        :""}
        </div>
      :""}
      <div className="container review--section--anchor">
        <Review reviews={reviews} reviewsPhoto={reviewsPhoto} questions={questions} product={productData} chainProduct={chainProduct}/>
        <RelatedPost blogPost={blogPost} />
        {relatedProd && 
        <RelatedProduct 
          product={relatedProd? relatedProd[0].primary : ""} 
          star 
          title="You May Also Like" 
          slider={mobile} sliderSet={2} 
          gridSet={4} 
          vColor={richTextBasicData.basicProdData.vColor}
          badge={richTextBasicData.basicProdData.badge}
        /> 
        }
      </div>
    </div>
  )
}

export default ProductSection
