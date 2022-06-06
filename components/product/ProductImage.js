import { SideBySideMagnifier } from "react-image-magnifiers"
import Slider from "react-slick";
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'


function ProductImage({ gallery, mainImg, title }) {

  const [img , setImg] = useState(mainImg)
  const [onload , setOnload] = useState(true)  
  const [galOnload , setGalOnload] = useState(0)  
  const [zoom , setZoom] = useState(true)  
  const sliderMob = useRef();
  const router = useRouter()

  useEffect(() => {
      setOnload(false)
      setImg(mainImg)
      setGalOnload(0)
      sliderMob.current.slickGoTo(0)
  },[mainImg]);
  
  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      setZoom(true)
    }

    const handleImgSize = (url, { shallow }) => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth 
        if(width <= 769) {
            const wraper = document.getElementsByClassName("product--gallery")
            if(wraper.length != 0) {
              const He = wraper[0].offsetHeight
              for(var i = 0; i < wraper.length; i++){
                wraper[i].style.height = He+"px"
                }
            }
        }
      }
    }

    router.events.on('routeChangeStart', handleRouteChange)
    router.events.on('routeChangeComplete', handleImgSize)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
      router.events.off('routeChangeComplete', handleImgSize)
    }
  },[]);

    /* SLIDER */
  var settings = {
    dots: true,
    infinite: true,
    swipeToSlide: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: 'linear',
    speed: 250,
    accessibility:zoom,
    draggable:zoom,
    swipe:zoom,
    touchMove:zoom
  };

  var gallerySlide = {
    dots: false,
    infinite: false,
    swipeToSlide: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    cssEase: 'linear',
    speed: 250,
    vertical:true,
    verticalSwiping:true
  };

  function changeImg(imgItem) {
    if (img != imgItem) {
      setOnload(false)
      setImg(imgItem)
    }
  }

  function changeGalImg() {
    const current = galOnload + 1
    setGalOnload(current)
  }

  function zoomImg() {
    setZoom(!zoom)
  }

    return(
        <div className="image--section three-five flex full--mobile full--tablet">
        <section className="desktop image--gallery one-six" aria-label="carousel">
          {gallery.length > 5 ?
          <Slider {...gallerySlide}>
            {gallery.map((imgItem, index) => (
              <button
                key={"gallery"+index}
                aria-label={`image ${index + 1} of ${gallery.length}`}
                className="full gallery--item prod--img"
                onClick={() => changeImg(imgItem)}
              >
                <Image
                  src={imgItem?imgItem.node.originalSrc:"/icons/logo.png"}
                  alt={imgItem? title + ` ${imgItem.node.altText?imgItem.node.altText:""} - View ${index + 2}` :"aftco"}
                  width={650}
                  height={650}
                  layout="responsive"
                  onLoad={() => changeGalImg()}
                />
              </button>
            ))}
            </Slider>
            :
            gallery.map((imgItem, index) => (
              <button
                key={"gallery"+index}
                className="full gallery--item prod--img"
                onClick={() => changeImg(imgItem)}
              >
                <Image
                  src={imgItem?imgItem.node.originalSrc:"/icons/logo.png"}
                  alt={imgItem? title + ` ${imgItem.node.altText?imgItem.node.altText:""} - View ${index + 2}` :"aftco"}
                  width={650}
                  height={650}
                  layout="responsive"
                />
              </button>
            ))
          }
        </section>
        <div className="desktop image--main five-sixth">
          <div className="zoom-container prod--img">
            <a href={img?img.node.originalSrc:"/icons/logo.png"}>
              <div className={onload && "hide"}>
                <Image
                  src={img?img.node.originalSrc:"/icons/logo.png"}
                  alt={img?title+' - Color '+img.node.altText+' - View 1':title}
                  width={650}
                  height={650}
                  layout="responsive"
                />
              </div>
              <div className={!onload && "hide"}>
                <SideBySideMagnifier
                  imageSrc={img?img.node.originalSrc:"/icons/logo.png"}
                  largeImageSrc={img?img.node.originalSrc:"/icons/logo.png"}
                  imageAlt={img?title+' - Color '+img.node.altText+' - View 1':title}
                  onImageLoad={() => setOnload(true)}
                  alwaysInPlace
                />
              </div>
            </a>
          </div>
        </div>
        <div className="mobile slider--gallery full">
          <Slider {...settings} ref={sliderMob}>
            {gallery?
              gallery.map((imgItem, index) => (
                <div className={`product--gallery ${!zoom && "onZoom"}`} key={index}>
                  <div className="mbl--img">
                    <Image
                      src={imgItem?imgItem.node.originalSrc:"/icons/logo.png"}
                      alt={imgItem?imgItem.node.altText:"aftco"}
                      width={650}
                      height={650}
                      layout="responsive"
                      onClick={zoomImg}
                    />
                  </div>
                </div>
              )):""
            }
          </Slider>
        </div>
      </div>
    )
}
export default ProductImage