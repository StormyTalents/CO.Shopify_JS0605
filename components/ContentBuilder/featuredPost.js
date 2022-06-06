import Image from 'next/image'
import Link from 'next/link'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";

function categories(node) {

    function featuredPost(posts) {
        if(node.data.type == "Based on post entries") {
            const featuredPost = node.post.filter(idxs => posts.some(post => idxs.sys.id === post.sys.id))
            return (featuredPost)
        } else {
            return (node.latestPost)
        }
      }

    var settings = {
        dots: false,
        infinite: true,
        swipeToSlide: true,
        slidesToShow: node.data.numberColumn,
        slidesToScroll: 1,
        cssEase: 'linear',
        speed: 250,
        responsive: [
            {
              breakpoint: 680,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: false
              }
            },
        ]
      };

    function getLayout(numLayout) {
        let grid 
        switch(numLayout) {
            case 1:
                grid = `full`;
            break;
            case 2:
                grid = "half";
            break;
            case 3:
                grid = "one-third";
            break;
            case 4:
                grid = "one-four";
            break;
            default:
                grid = "one-five";
          }

          return(grid)
    }
      
    function getCatDetail(cat) {
        const maxPost = node.data.maxPost
        const catDetail = node.collections.find((idxs) => {
                return idxs.sys.id === cat;
              })
        const showPost = node.post.filter((idxs) => {
            let id
            if (idxs.fields.blogCategory){
                id = idxs.fields.blogCategory.sys.id
            }
            else {
                id = null
            }
            return id === cat;
          })

        let post = showPost
        if(maxPost && maxPost < post.length) {
            post = post.slice(0,(post.length - maxPost) * -1)
        }

        return ({catDetail, post})
    }
    
    //function bodyext(body) {
    //    const shortDescription = body.replace(/(<([^>]+)>)/gi, "").substring(0,200);
    //    return(shortDescription)
    //  }

    return (
        <div className={`featured--post--section ${node.data.displayAtMobile?"":"desktop"}`} key={node.i}>
            {node.data.type == "Based on post entries" || node.data.type == "Latest Post" ?
            <div className={`post--list--section mt-75 ${node.data.style}`}>
                <div className="container">
                    {node.data.showTitle?<h2 className="heaing tf-cp h3" >{node.data.title}</h2>:""}
                    {node.data.layoutStyle == "Grid"?
                        <div className="grid wp">
                            {featuredPost(node.data.postList).map((categori, index) =>
                                <div className={`post--item grid--child ${getLayout(node.data.numberColumn)}`} data-index={index} key={index}>
                                    <Link href={`/blogs/${categori.fields.blogCategory.fields.slug}/${categori.fields.slug}`}><a>
                                        <div className="img--wrap">
                                        <Image
                                            src={`https:${categori.fields.heroImage.fields.file.url}`}
                                            alt={categori.fields.heroImage.fields.file.fileName}
                                            layout="fill"
                                            objectFit="cover"
                                            className={`list--img`}
                                        />
                                        </div>
                                        <p className="mt-10">{categori.fields.title}</p>
                                    </a></Link>
                                </div>
                            )}
                        </div>
                    :
                        <Slider {...settings}>
                            {featuredPost(node.data.postList).map((categori, index) =>
                            <div className="post--item" data-index={index} key={index}>
                                <Link href={`/blogs/${categori.fields.blogCategory.fields.slug}/${categori.fields.slug}`}><a>
                                    <div className="img--wrap">
                                    <Image
                                        src={`https:${categori.fields.heroImage.fields.file.url}`}
                                        alt={categori.fields.heroImage.fields.file.fileName}
                                        layout="fill"
                                        objectFit="cover"
                                        className={`list--img`}
                                    />
                                    </div>
                                    <p className="mt-10">{categori.fields.title}</p>
                                </a></Link>
                            </div>
                            )}
                        </Slider>
                    }
                </div>
            </div>
            :
            <div className={`cat--list mt-75 ${node.data.style}`}>
                <div className="container">
                    {node.data.categoriesList.map((cat,index) =>
                        <div className="post--list--section mb-50" key={index}> 
                            <h3 className="heaing tf-cp" >{getCatDetail(cat.sys.id).catDetail.fields.title}</h3>
                            {node.data.layoutStyle == "Grid"?
                                <div className="grid wp">
                                    {getCatDetail(cat.sys.id).post.map((categori, idx) =>
                                        <div className={`post--item grid--child mb-20 ${getLayout(node.data.numberColumn)}`} data-index={idx} key={idx}>
                                            <Link href={`/blogs/${categori.fields.blogCategory.fields.slug}/${categori.fields.slug}`}><a>
                                                <div className="img--wrap">
                                                <Image
                                                    src={`https:${categori.fields.heroImage.fields.file.url}`}
                                                    alt={categori.fields.heroImage.fields.file.fileName}
                                                    layout="fill"
                                                    objectFit="cover"
                                                    className={`list--img`}
                                                />
                                                </div>
                                                <p className="mt-10">{categori.fields.title}</p>
                                            </a></Link>
                                        </div>
                                    )}
                                </div>
                            :
                                <Slider {...settings}>
                                    {getCatDetail(cat.sys.id).post.map((categori, index) =>
                                        <div className="post--item" data-index={index} key={index}>
                                            <Link href={`/blogs/${categori.fields.blogCategory.fields.slug}/${categori.fields.slug}`}><a>
                                                <div className="img--wrap">
                                                <Image
                                                    src={`https:${categori.fields.heroImage.fields.file.url}`}
                                                    alt={categori.fields.heroImage.fields.file.fileName}
                                                    layout="fill"
                                                    objectFit="cover"
                                                    className={`list--img`}
                                                />
                                                </div>
                                                <p className="mt-10">{categori.fields.title}</p>
                                                {
                                                    //categori.fields.shortDescription?
                                                    //<div className="short--desc"  dangerouslySetInnerHTML={ { __html:categori.fields.shortDescription }} />
                                                    //:
                                                    //<div className="short--desc"><p>{bodyext(categori.fields.body)}...</p></div>
                                                }
                                            </a></Link>
                                        </div>
                                )}
                                </Slider>
                            }
                            
                        </div>
                    )}
                </div>
            </div>
            }
        </div>
    )
}

export default categories