import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowDownTwo } from '@/components/icons' 
import ProductCardRelated from '@/components/product/ProductCardRelated'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { useRouter } from 'next/router'
import { getURL } from '@/lib/headerFunction'

function subNav({ type, featured, menuSlug, subMenu, mustHave, vColor, badge, classs, megaMenu }) {

    const musthaveNav = mustHave.slice(0, 3)
    const router = useRouter()

    const [url, setUrl] = useState(router.asPath)
    const [thirdLevel, setThirdLevel] = useState(9999)

    useEffect(() => {
        setUrl(router.asPath)
    },[router.asPath])

    function thirdMenu(subindex) {
        const current = thirdLevel
        if (current == subindex) {
            setThirdLevel(99999)
        }
        else {
            setThirdLevel(subindex) 
        }
    }

    function activeUrl(slug, customUrl) {
        let current = ""
        if(url.includes(slug)) {
        current =  "active"
        }
        if(url.includes(customUrl)) {
        current = "active"
        }
        return(current)
    }

    var settings = {
    dots: false,
    infinite: true,
    swipeToSlide: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    cssEase: 'linear',
    speed: 250,
    };

    return (
    <div className="subMenu" id={megaMenu ? "subMenuId" : ""}>
        {featured?
            <li className='featured--menu sub--item third--level second--sub one-five' onClick={(e) => thirdMenu("featured")}>
                <div className={`featured--title flex ${thirdLevel == "featured"?"opened":"closed"}`}>
                    <h2 className="tf-cp mobile h5">Featured</h2> 
                    <div className="add--less mobile">
                        <div className="arrow"><ArrowDownTwo/></div>
                    </div>
                </div>
                <div className={`fetured--wrap ${thirdLevel == "featured"?"opened":"closed"}`}>
                    {featured.map((featured, subindex) => {
                    const featureds = menuSlug.find(col => col.sys.id == featured.sys.id);
                    const blogCat = featureds.fields.blogCategory ? featureds.fields.blogCategory.fields.slug : null
                    return (
                        <div className="sub--item" key={subindex}>
                            <div className={`sub--item--title ${activeUrl(featureds.fields.slug,featureds.fields.customUrl)}`}>
                                {featureds?
                                    <Link href={getURL(featureds.sys.contentType.sys.id, featureds.fields.slug, blogCat, featureds.fields.customUrl)}>
                                        <a className="tf-cp h5">
                                            {featureds.fields.title}
                                        </a>
                                    </Link>:""}
                            </div>
                        </div>
                    )
                    })}
                </div>
            </li>
        :""}
        {subMenu?
            subMenu.map((sub, subindex) => {
                const page = menuSlug.find(col => col.sys.id == sub.sys.id);
                const blogCat = page.fields.blogCategory ? page.fields.blogCategory.fields.slug : null
                if(page.fields.subMenu) {
                    return (
                        page.fields.title == "Must-Have Gear"?
                        <div className="recomended--prod--nav one-five" key={subindex}>
                            <h2 className="tf-cp center mb-20 h5">{page.fields.title}</h2>
                        { mustHave ?
                            classs == "mobile"?
                            <Slider {...settings}>
                                {
                                    musthaveNav.map((reco, i) => 
                                    <ProductCardRelated product={reco} vColor={vColor} badge={badge} star keyIdx={`${subindex}-${i}`}/>
                                )
                                }
                            </Slider>
                            :
                            <ul>
                            {mustHave.map((reco, i) => 
                                i <= 1 ?
                                    <ProductCardRelated product={reco} vColor={vColor} badge={badge} star keyIdx={`${subindex}-${i}`}/>
                                :""
                            )}
                            </ul>
                        :""
                        }
                        </div>
                        :
                        <li className={`menu--item--sub third--level second--sub one-five ${page.fields.subMenu?"has--child":""}`} key={subindex}>
                            <div className={`sub--item single ${activeUrl(page.fields.slug, page.fields.customUrl)}`} key={subindex}>
                                {page.fields.subMenu?
                                <div className={`sub--item--title ${thirdLevel == subindex?"opened":"closed"}`} onClick={(e) => thirdMenu(subindex)}>
                                    <h2 className="tf-cp h5">{page.fields.title}</h2>
                                    <div className="add--less">
                                    <div className="arrow"><ArrowDownTwo/></div>
                                    </div>
                                </div>
                                :
                                <Link href={getURL(page.sys.contentType.sys.id, page.fields.slug, blogCat, page.fields.customUrl)}><a>
                                    <div className="sub--item--title">
                                        <h2 className="tf-cp h5">{page.fields.title}</h2>
                                    </div>
                                </a></Link>
                                }
                            </div>
                            <div className={`third--sub--item ${thirdLevel == subindex?"opened":"closed"}`}>
                            { page.fields.subMenu.map((thirdSubCild, thirdindex) => 
                                <div className={`sub--item single ${activeUrl(thirdSubCild.fields.slug, thirdSubCild.fields.customUrl)}`} key={thirdindex}>
                                    {thirdSubCild.sys.contentType?
                                        <Link href={getURL(thirdSubCild.sys.contentType.sys.id, thirdSubCild.fields.slug, thirdSubCild.fields.category, thirdSubCild.fields.customUrl)}><a>
                                            <div className="sub--item--title">
                                            <span>{thirdSubCild.fields.title}</span>
                                            </div>
                                        </a></Link>
                                    :""}
                                </div>
                            )}
                            </div>
                        </li>
                    )
                }
                else if(page.fields.subCollections) {
                    return (
                        <li className="menu--item--sub third--level second--sub one-five">
                            <div className={`sub--item single ${activeUrl(page.fields.slug, page.fields.customUrl)}`} key={subindex}>
                            <Link href={getURL(page.sys.contentType.sys.id, page.fields.slug, blogCat, page.fields.customUrl)}><a>
                                <div className="sub--item--title">
                                <h2 className="tf-cp h5">{page.fields.title}</h2>
                                </div>
                            </a></Link>
                            </div>
                            <div className="third--sub--item">
                            { page.fields.subCollections.map((thirdSubCild, thirdindex) => 
                                <div className={`sub--item single ${activeUrl(thirdSubCild.fields.slug, thirdSubCild.fields.customUrl)}`} key={thirdindex}>
                                    <Link href={getURL(thirdSubCild.sys.contentType.sys.id, thirdSubCild.fields.slug, thirdSubCild.fields.category, thirdSubCild.fields.customUrl)}><a>
                                        <div className="sub--item--title">
                                        <span>{thirdSubCild.fields.title}</span>
                                        </div>
                                    </a></Link>
                                </div>
                            )}
                            </div>
                        </li>
                    )
                }
                else {
                    return (
                        <li className={`sub--item single second--sub ${activeUrl(page.fields.slug, page.fields.customUrl)}`} key={subindex}>
                            <div className="sub--item--title">
                                <Link href={getURL(page.sys.contentType.sys.id, page.fields.slug, blogCat, page.fields.customUrl)}>
                                    <a className="tf-cp h5">
                                        {page.fields.title}
                                    </a>
                                </Link>
                            </div>
                        </li>
                    )
                }
        })
        :""}
    </div>
)
}
export default subNav