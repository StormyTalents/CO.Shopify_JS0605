import { useState, useEffect } from 'react'
import { getblogCategoriesSlugs, getSingleblogCategories, getNavDataNeeded, getGroupOfBlogCat } from '@/lib/contentful'
import { getContenfulData } from '@/lib/cache'
import Image from 'next/image'
import { blurlogo } from '@/components/icons'
import Link from 'next/link'
import SEO from '@/components/SEO'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import VisibilitySensor from 'react-visibility-sensor'
import { useRouter } from 'next/router'
import HeroBanner from '@/components/ContentBuilder/heroBanner'

function PostPage({catPost, currentCat}) {

  const router = useRouter()
  const postToShow = catPost.sort((a, b) => (a.fields.publishDate < b.fields.publishDate) ? 1 : -1).slice(0, 6)
  
  useEffect(() => {
      setProdToShow(postToShow)
      setPage(router.asPath)
  },[router.asPath]);

  const postsPerPage = 6;
  const [prodToShow, setProdToShow] = useState(postToShow);
  const [nextReview, setNextReview] = useState(20);
  const [page, setPage] = useState(router.asPath);
  const [loadMore, setLoadMore] = useState(true);
  const loopWithSlice = (start, end, data) => {
    const slicedReview = data.slice(0, end);
    setProdToShow([...slicedReview]);
  };

  function handleShowMorePosts(isVisible){
    if ( isVisible && prodToShow < catPost) {
      loopWithSlice(nextReview, nextReview + postsPerPage, catPost);
      setNextReview(nextReview + postsPerPage);
    }
    if(prodToShow >= catPost) {
      setLoadMore(false)
    }
    else {
      setLoadMore(true)
    }
  };

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
    <div className="post--cat--page reco--section">
      <SEO 
        title={currentCat.fields.metaTitleTag?currentCat.fields.metaTitleTag:`${currentCat.fields.title} - AFTCO`} 
        description={currentCat.fields.metaDescription?currentCat.fields.metaDescription:null}
      />

      {currentCat.fields.heroBanner && <HeroBanner hero={currentCat.fields.heroBanner.fields} />}

      <div className="container post--list grid ls">
        {prodToShow.map((post) => {
          const postPage = `/blogs/${post.fields.blogCategory.fields.slug}/${post.fields.slug}`;

          return (
            <div className="reco--item full grid--child mb-50">
              <div className="post--img--wrap">
                {post.fields.contentFromShogun?
                  <a href={postPage} className="shogun">
                    {post.fields.thumbnail?
                      <Image
                        src={post.fields.thumbnail && post.fields.thumbnail.fields?'https:'+post.fields.thumbnail.fields.file.url:"/icons/logo.png"}
                        width={post.fields.thumbnail && post.fields.thumbnail.fields?post.fields.thumbnail.fields.file.details.image.width:500}
                        height={post.fields.thumbnail && post.fields.thumbnail.fields?post.fields.thumbnail.fields.file.details.image.height:280}
                        layout="responsive"
                        placeholder="blur"
                        alt={`Go go to ${post.fields.title}`}
                        blurDataURL={blurlogo}
                        className={`home--banner--img`}
                      />
                    :
                      <Image
                        src={post.fields.heroImage && post.fields.heroImage.fields?'https:'+post.fields.heroImage.fields.file.url:"/icons/logo.png"}
                        width={post.fields.heroImage && post.fields.heroImage.fields?post.fields.heroImage.fields.file.details.image.width:500}
                        height={post.fields.heroImage && post.fields.heroImage.fields?post.fields.heroImage.fields.file.details.image.height:280}
                        alt={`Go to ${post.fields.title}`}
                        layout="responsive"
                        placeholder="blur"
                        blurDataURL={blurlogo}
                        className={`home--banner--img`}
                      />
                    }
                  </a>
                :
                <Link href={postPage}><a>
                    {post.fields.thumbnail?
                      <Image
                        src={post.fields.thumbnail && post.fields.thumbnail.fields?'https:'+post.fields.thumbnail.fields.file.url:"/icons/logo.png"}
                        width={post.fields.thumbnail && post.fields.thumbnail.fields?post.fields.thumbnail.fields.file.details.image.width:500}
                        height={post.fields.thumbnail && post.fields.thumbnail.fields?post.fields.thumbnail.fields.file.details.image.height:280}
                        alt={`Go to ${post.fields.title}`}
                        layout="responsive"
                        placeholder="blur"
                        blurDataURL={blurlogo}
                        className={`home--banner--img`}
                      />
                    :
                      <Image
                        src={post.fields.heroImage && post.fields.heroImage.fields?'https:'+post.fields.heroImage.fields.file.url:"/icons/logo.png"}
                        width={post.fields.heroImage && post.fields.heroImage.fields?post.fields.heroImage.fields.file.details.image.width:500}
                        height={post.fields.heroImage && post.fields.heroImage.fields?post.fields.heroImage.fields.file.details.image.height:280}
                        alt={`Go to ${post.fields.title}`}
                        layout="responsive"
                        placeholder="blur"
                        blurDataURL={blurlogo}
                        className={`home--banner--img`}
                      />
                    }
                  </a></Link>
                }
                <div className="post--caption">
                  <div className="meta--data flex">
                    <p className="date">{date(post.fields.publishDate)}</p>
                    <span><FontAwesomeIcon icon={faCircle} /></span>
                    <p className="category">{post.fields.author.fields.name}</p>
                  </div>
                  {post.fields.contentFromShogun?
                    <a href={postPage} className="shogun"><h2 className="cl-b h4">{post.fields.title}</h2></a>
                  :
                    <Link href={postPage}><a><h2 className="cl-b h4">{post.fields.title}</h2></a></Link>
                  }
                  {post.fields.shortDescription ?
                    <div className="short--desc"  dangerouslySetInnerHTML={ { __html:post.fields.shortDescription }} />
                  :
                    post.fields.body &&
                      <div className="short--desc"><p>{bodyext(post.fields.body)}...</p></div>
                  }
                  {post.fields.contentFromShogun?
                    <a href={postPage} className="button small mt-20 shogun">Read More</a>
                  :
                    <Link href={postPage}><a className="button small mt-20">Read More</a></Link>
                  }
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <VisibilitySensor onChange={handleShowMorePosts} offset={{top:100}}>
      <div id="loadmore">
        {loadMore?
            <Image
                src={"/icons/loading.gif"}
                alt={"aftco"}
                width={64}
                height={64}
                layout="responsive"
            />
        :""}
      </div>
      </VisibilitySensor>
    </div>
  )
}

export async function getStaticPaths() {
  const catSlugs = await getblogCategoriesSlugs()
  const catGroupSlugs = await getGroupOfBlogCat()
  const allSlug = catGroupSlugs ? catSlugs.concat(catGroupSlugs) : catSlugs
  
  const paths = allSlug.map((catSlug) => {    
    const cat = String(catSlug.fields.slug).replace(/\s+/g, '-').toLowerCase()
    
    return {
      params: {cat}
    }
  })
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  
  const contenfulData = await getContenfulData()
  const searchPopular = contenfulData.searchPopular
  const catGroup = await getGroupOfBlogCat()
  const navs = contenfulData.naventries
  const navsData = await getNavDataNeeded(navs, contenfulData)

  const group = catGroup.find(grp => grp.fields.slug == params.cat)
  let currentCat
  let catPost
  if(group) {
    currentCat = group
    catPost = contenfulData.post.filter((secopt) => 
      group.fields.blogCategories.some(catGroup => {
        const cat = secopt.fields.blogCategory.fields.slug
        return cat === catGroup.fields.slug
      })
    )
  }
  else {
    const getCurrentCat  = await getSingleblogCategories(params.cat)
    currentCat = getCurrentCat[0]
    catPost = contenfulData.post.filter((secopt) => {
      const cat = secopt.fields.blogCategory.fields.slug
      return cat === params.cat
    })
  }

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
      currentCat,
      catPost,
      basicProdData,
      searchPopular
    },
  }
}

export default PostPage