import Head from 'next/head'
import { getAllBlogPost, getSingleBlogPost, getNavDataNeeded, getRichTextDataNeeded } from '@/lib/contentful'
import { getAllProducts, getContenfulData, getSumaryReview } from '@/lib/cache'
import { getProdNeeded, getCollectionDetailRichText } from '@/lib/shopify'
import { getReviewNeeded } from '@/lib/review'
import SEO from '@/components/SEO'
import UnderHeroTitle from '@/components/header/UnderHeroTitle'
import OverlayTitle from '@/components/header/OverlayTitle'
import Image from 'next/image'
import { blurlogo } from '@/components/icons'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import RichText from '@/components/richtext' 


function PostPage({content, products, reviewNeeded, relatedPost, basicProdData, richTextData, productsCollection}) { 

  function date(date) {
    const d = new Date(date);
    var options = { year: 'numeric', month: 'long', day: 'numeric' };

    return(d.toLocaleDateString("en-US", options))
  }

  function bodyext(body) {
    const shortDescription = body.replace(/(<([^>]+)>)/gi, "").substring(0,200);
    return(shortDescription)
  }

  return (
      <div className="full post--page">
        <SEO 
          title={content[0].fields.metaTitleTag?content[0].fields.metaTitleTag:`${content[0].fields.title} - AFTCO`} 
          description={content[0].fields.metaDescription?content[0].fields.metaDescription:null}
        /> 
        <Head>
          <link rel="stylesheet" href="/font-awesome/css/font-awesome.min.css" />
        </Head>
        {content[0].fields.titleStyle != "Overlay"?
          <UnderHeroTitle content={content[0]} products={products} reviewNeeded={reviewNeeded} basicProdData={basicProdData} richTextData={richTextData} />
        :
          <OverlayTitle content={content[0]} products={products} reviewNeeded={reviewNeeded} basicProdData={basicProdData} richTextData={richTextData} />
        }
        <div className="post-container">
            {content[0].fields.contentPageBuilder && content[0].fields.contentHtmlPosition == "Top"?
                <RichText 
                  content={content[0].fields.contentPageBuilder.content} 
                  products={products} 
                  basicProdData={basicProdData} 
                  richTextData={richTextData} 
                  reviews={reviewNeeded}
                  productsCollection={productsCollection}
                />
            :""}
            <div className='container'>
              {content[0].fields.body?
              <div dangerouslySetInnerHTML={ { __html:content[0].fields.body }}></div>
              :""}
            </div>
            {content[0].fields.contentPageBuilder && content[0].fields.contentHtmlPosition != "Top"?
                <RichText 
                  content={content[0].fields.contentPageBuilder.content} 
                  products={products} 
                  basicProdData={basicProdData} 
                  richTextData={richTextData} 
                  reviews={reviewNeeded}
                  productsCollection={productsCollection}
                />
            :""}
        </div>
        <div className="related--blog reco--section">
          <h3>Related Posts</h3>
          <div className="post--list grid ls container">

              {relatedPost.map((post) => {
              return (
                  <div className="reco--item full grid--child mb-50">
                  <div className="post--img--wrap"> 
                      {post.fields.contentFromShogun?
                        <a href={`/blogs/${content[0].fields.blogCategory.fields.slug}/${post.fields.slug}`} className="shogun">
                          {post.fields.thumbnail?
                            <Image
                              src={post.fields.thumbnail && post.fields.thumbnail.fields?'https:'+post.fields.thumbnail.fields.file.url:"/icons/logo.png"}
                              alt={post.fields.thumbnail && post.fields.thumbnail.fields?post.fields.thumbnail.fields.file.fileName:"aftco"}
                              width={post.fields.thumbnail && post.fields.thumbnail.fields?post.fields.thumbnail.fields.file.details.image.width:500}
                              height={post.fields.thumbnail && post.fields.thumbnail.fields?post.fields.thumbnail.fields.file.details.image.height:280}
                              layout="responsive"
                              placeholder="blur"
                              blurDataURL={blurlogo}
                              className={`home--banner--img`}
                            />
                          :
                            <Image
                              src={post.fields.heroImage && post.fields.heroImage.fields?'https:'+post.fields.heroImage.fields.file.url:"/icons/logo.png"}
                              alt={post.fields.heroImage && post.fields.heroImage.fields?post.fields.heroImage.fields.file.fileName:"aftco"}
                              width={post.fields.heroImage && post.fields.heroImage.fields?post.fields.heroImage.fields.file.details.image.width:500}
                              height={post.fields.heroImage && post.fields.heroImage.fields?post.fields.heroImage.fields.file.details.image.height:280}
                              layout="responsive"
                              placeholder="blur"
                              blurDataURL={blurlogo}
                              className={`home--banner--img`}
                            />
                          }
                        </a>
                      :
                      <Link href={`/blogs/${content[0].fields.blogCategory.fields.slug}/${post.fields.slug}`}><a>
                          {post.fields.thumbnail?
                            <Image
                              src={post.fields.thumbnail && post.fields.thumbnail.fields?'https:'+post.fields.thumbnail.fields.file.url:"/icons/logo.png"}
                              alt={post.fields.thumbnail && post.fields.thumbnail.fields?post.fields.thumbnail.fields.file.fileName:"aftco"}
                              width={post.fields.thumbnail && post.fields.thumbnail.fields?post.fields.thumbnail.fields.file.details.image.width:500}
                              height={post.fields.thumbnail && post.fields.thumbnail.fields?post.fields.thumbnail.fields.file.details.image.height:280}
                              layout="responsive"
                              placeholder="blur"
                              blurDataURL={blurlogo}
                              className={`home--banner--img`}
                            />
                          :
                            <Image
                              src={post.fields.heroImage && post.fields.heroImage.fields?'https:'+post.fields.heroImage.fields.file.url:"/icons/logo.png"}
                              alt={post.fields.heroImage && post.fields.heroImage.fields?post.fields.heroImage.fields.file.fileName:"aftco"}
                              width={post.fields.heroImage && post.fields.heroImage.fields?post.fields.heroImage.fields.file.details.image.width:500}
                              height={post.fields.heroImage && post.fields.heroImage.fields?post.fields.heroImage.fields.file.details.image.height:280}
                              layout="responsive"
                              placeholder="blur"
                              blurDataURL={blurlogo}
                              className={`home--banner--img`}
                            />
                          }
                        </a></Link>
                      }
                      <div className="post--caption">
                        <div className="meta--data">
                          <p className="date">{date(post.fields.publishDate)}</p>
                          <span><FontAwesomeIcon icon={faCircle} /></span>
                          <p className="category">{post.fields.author.fields.name}</p>
                        </div>
                        <Link href={`/blogs/${content[0].fields.blogCategory.fields.slug}/${post.fields.slug}`}><a><h4 className="cl-b">{post.fields.title}</h4></a></Link>
                        {post.fields.shortDescription ?
                          <div className="short--desc"  dangerouslySetInnerHTML={ { __html:post.fields.shortDescription }} />
                        :
                          post.fields.body &&
                            <div className="short--desc"><p>{bodyext(post.fields.body)}...</p></div>
                        }
                        <Link href={`/blogs/${content[0].fields.blogCategory.fields.slug}/${post.fields.slug}`}><a className="button small mt-20">Read More</a></Link>
                      </div>
                  </div>
                  </div>
              )
              })}
          </div>
        </div>
      </div>
  )
}

export async function getStaticPaths() {
  const postSlug = await getAllBlogPost()
  
  const paths = postSlug.map((slug) => {    
    const post = String(slug.fields.slug)
    const cat = String(slug.fields.blogCategory.fields.slug)
    
    return {
      params: {cat,post}
    }
  })
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {

  const content = await getSingleBlogPost(params.post)
  const contenfulData = await getContenfulData()
  const searchPopular = contenfulData.searchPopular
  const allProducts = await getAllProducts()
  const prodIds = allProducts.map((prodId) => {    
    const prodIdsUrl = Buffer.from(prodId.node.id, 'base64').toString('binary')
    const realProdId = prodIdsUrl.replace("gid://shopify/Product/", "")
    return {
      productId: realProdId
    }
  })

  const reviews = await getSumaryReview(prodIds)

  let products = null
  let reviewNeeded = null
  let richTextData = null
  let productsCollection = null
  if(content[0].fields.contentPageBuilder){
    products = await getProdNeeded(content[0].fields.contentPageBuilder.content, allProducts, contenfulData.bannerList)
    reviewNeeded = await getReviewNeeded(products, reviews)
    richTextData = await getRichTextDataNeeded(content[0].fields.contentPageBuilder.content, contenfulData)
    if(richTextData.ColforPage.length != 0 ) {
      productsCollection = await getCollectionDetailRichText(richTextData.ColforPage)
    }
  }

  const catPost = contenfulData.post.filter((secopt) => {
    const cat = secopt.fields.blogCategory.fields.slug
    return cat === content[0].fields.blogCategory.fields.slug
  })
  const noCurrent = catPost.filter(function(value){ 
    return value.fields.slug != content[0].fields.slug;
  });
  const relatedPost = noCurrent.slice(0, 3)

  const navs = contenfulData.naventries
  const navsData = await getNavDataNeeded(navs, contenfulData)
  const topBar = contenfulData.topBar[0].fields.contents.content
  const basicProdData = {
    "vColor":contenfulData.vColor, 
    "filter":contenfulData.filter, 
    "chainList":contenfulData.chainList, 
    "badge":contenfulData.badge, 
    "discount":contenfulData.discount,
    "gwp":contenfulData.gwp
  }

  return {
    props: {
      content,
      products,
      reviewNeeded,
      relatedPost,
      basicProdData,
      richTextData,
      navs,
      navsData,
      topBar,
      searchPopular,
      productsCollection
    },
  }
}

export default PostPage