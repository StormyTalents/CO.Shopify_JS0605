import Image from 'next/image'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import Link from 'next/link'

function RelatedPost({ blogPost }) {

  var settings = {
    dots: true,
    infinite: true,
    swipeToSlide: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: 'linear',
    speed: 250,
  };

  function compare( a, b ) {

    const first = a.stickyOrder ? a.stickyOrder : 10000
    const second = b.stickyOrder ? b.stickyOrder : 10000

    if ( first > second ){
      return 1;
    }
    if ( first < second){
      return -1;
    }
    return 0
  }
  
    return (
      <div className="related--post">
          <h2 className='h3'>Related Content</h2>
          {
            blogPost?
            <Slider {...settings} >
            {blogPost.sort(compare).map((post, index) => (
              index <= 9 ?
                <div className="post--item" key={index}>
                  <div className="img--wrap three-five full--mobile">
                    <div className="item--img">
                      <Image 
                        alt={post.heroImage?post.heroImage.fields.title:"aftco"} 
                        src={`https:${post.heroImage?post.heroImage.fields.file.url:"/icons/logo.png"}`}
                        layout="fill"
                      />
                    </div>
                  </div>
                  <div className="relatedpost--content two-five full--mobile">
                    <div className="title"><h4>{post.title}</h4></div>
                    <div className="descriptions desktop">{post.description}</div>
                    <Link href={`/blogs/${post.blogCategory.fields.slug}/${post.slug}`}><a><button className="button light">Read Blog</button></a></Link>
                  </div>
                </div>
              :""
            ))}
            </Slider> :""
          }
      </div>
    )
  }
  
  export default RelatedPost