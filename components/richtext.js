import Image from 'next/image'
import HeroBanner from '@/components/ContentBuilder/heroBanner'
import ProductsBanner from '@/components/ContentBuilder/productsBanner'
import ProductsList from '@/components/ContentBuilder/productsList'
import FeaturedCategories from '@/components/ContentBuilder/featuredCategories'
import FeaturedPost from '@/components/ContentBuilder/featuredPost'
import HeroBox from '@/components/ContentBuilder/heroBox'
import HeroAccordion from '@/components/ContentBuilder/heroAccordion'
import VideoSection from '@/components/ContentBuilder/videoSection'
import Wsyig from '@/components/ContentBuilder/wsyig'

function RichText({content, products, headerTitle, basicProdData, richTextData, reviews, nostoProd, productsCollection}) {

  return (
    <div className="rich--text">
    {content.map((data, i) => 
        <div className="section--wrap" key={i}>
            {data.nodeType == "paragraph" || data.nodeType == "heading-1" || data.nodeType == "heading-2" || data.nodeType == "heading-3" || data.nodeType == "heading-4" || data.nodeType == "heading-5" || data.nodeType == "heading-6" || data.nodeType == "unordered-list" ? 
                <Wsyig data={data} />
            :""}
            {data.nodeType == "embedded-entry-block" ? 
                <div className="entry--block">
                    {data.data.target.sys.contentType.sys.id == "heroBanner" ? 
                        <HeroBanner hero={data.data.target.fields} headerTitle={headerTitle} i={i}/>
                    :"" }
                    {data.data.target.sys.contentType.sys.id == "productsBanner" ? 
                        <ProductsBanner allProducts={products} banner={data.data.target.fields} listDetail={richTextData.bannerList} blogCat={richTextData.blogCat} i={i}/>
                    :""}
                    {data.data.target.sys.contentType.sys.id == "productsList" ? 
                        <ProductsList data={data.data.target.fields} products={products} basicProdData={basicProdData} reviews={reviews} nostoProd={nostoProd} productsCollection={productsCollection}/>
                    :""}
                    {data.data.target.sys.contentType.sys.id == "videoSection" ? 
                        <VideoSection data={data.data.target.fields } i={i}/>
                    :""}
                    {data.data.target.sys.contentType.sys.id == "featuredCateggories" ? 
                        <FeaturedCategories collections={richTextData.blogCat} data={data.data.target.fields} i={i}/>
                    :""}
                    {data.data.target.sys.contentType.sys.id == "featuredPost" ?
                        <FeaturedPost data={data.data.target.fields} post={richTextData.post} collections={richTextData.blogCat} latestPost={richTextData.latestPost} i={i}/>
                    :""}
                    {data.data.target.sys.contentType.sys.id == "heroBox" ?
                        <HeroBox data={data.data.target.fields} i={i}/>
                    :""}
                    {data.data.target.sys.contentType.sys.id == "heroAccordion" ?
                        <HeroAccordion data={data.data.target.fields} i={i}/>
                    :""}
                </div>
            :""}
            {data.nodeType == "embedded-asset-block" ? 
                <div className="container">
                    <div className="default--img" style={{ width: data.data.target.fields.file.details.image.width }}>
                        <Image
                            src={`https:${data.data.target.fields.file.url}`}
                            alt={data.data.target.fields.file.fileName}
                            width={data.data.target.fields.file.details.image.width}
                            height={data.data.target.fields.file.details.image.height}
                            layout="responsive"
                            className={`list--img`}
                        />
                    </div>
                </div>
            :""}
        </div>
    )}
  </div>
  )
}

export default RichText