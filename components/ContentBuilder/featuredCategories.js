import Image from 'next/image'
import Slider from "react-slick";
import Link from 'next/link'
import "slick-carousel/slick/slick.css";

function categories(node) {
    function featuredCategories(cats) {
        const featuredCat = []
        cats.map((cat) =>
            featuredCat.push(node.collections.find((idxs) => {
                    return idxs.sys.id === cat.sys.id;
                })
        ))
        return (featuredCat)
      }

    var settings = {
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        draggable: true,
        swipeToSlide: true,
        cssEase: 'linear',
        speed: 250,
        responsive: [
            {
              breakpoint: 680,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                infinite: true,
                dots: false
              }
            },
        ]
      };

      function getURL(type, handle) { 
          
        let mainHandle
        switch(type) {
          case "blogCategories":
            mainHandle = `/blogs/`;
          break;
          case "collections":
            mainHandle = "/collections/";
          break;
          default:
            mainHandle = "/";
        }
    
        return(mainHandle+""+handle)
      }

    return (
        <div className={`container ${node.data.displayAtMobile?"":"desktop"}`} key={node.i}>
            <div className="categories--list--section mt-75">
            {node.data.showTitle?<h2 className="heading tf-cp h3" >{node.data.title}</h2>:""}
                <Slider {...settings}>  
                    {featuredCategories(node.data.categoriesList).map((categori, idx) =>
                    categori?
                    <div className="categorie--item" key={idx}>
                        <Link href={getURL(categori.sys.contentType.sys.id, categori.fields.slug)}><a>
                        {categori.fields.navImage?
                        <Image
                          src={`https:${categori.fields.navImage.fields.file.url}`}
                          alt={categori.fields.navImage.fields.file.fileName}
                          width={categori.fields.navImage.fields.file.details.image.width}
                          height={categori.fields.navImage.fields.file.details.image.height}
                          layout="responsive"
                          className={`list--img`}
                        />
                        :""}
                        <h4 className="mt-20 full">{categori.fields.title}</h4>
                        </a></Link>
                    </div>
                    :""
                    )}
                </Slider>
            </div>
        </div>
    )
}

export default categories