import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowDownTwo } from '@/components/icons' 
import "slick-carousel/slick/slick.css";
import { useRouter } from 'next/router'
import { getURL } from '@/lib/headerFunction'
import Image from 'next/image'

function subNav({ featured, menuSlug, subMenu }) {

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

    const subWidth = 100 / (subMenu.length + 1 )

    return (
    <div className="subMenu old--style">
        {featured?
            <li className='featured--menu sub--item third--level second--sub one-five' onClick={(e) => thirdMenu("featured")} style={{width:`${subWidth}%`}}>
                <div className={`featured--title flex ${thirdLevel == "featured"?"opened":"closed"}`}>
                    <h2 className="tf-cp h5">Featured</h2> 
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
                                        <a className="tf-cp p">
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
                    return (
                        <li className={`sub--item single second--sub ${activeUrl(page.fields.slug, page.fields.customUrl)}`} key={subindex} style={{width:`${subWidth}%`}}>
                            <div className="sub--item--title">
                                <Link href={getURL(page.sys.contentType.sys.id, page.fields.slug, blogCat, page.fields.customUrl)}>
                                    <a className="tf-cp h5">
                                    <div className='img--nav'>
                                        <Image
                                            src={page.fields.navImage ? `https:${page.fields.navImage.fields.file.url}` : "/icons/logo.png"}
                                            alt={"aftco"}
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    </div>
                                        {page.fields.title}
                                    </a>
                                </Link>
                            </div>
                        </li>
                    )
            })
        :""}
    </div>
)
}
export default subNav