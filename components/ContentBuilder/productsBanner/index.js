import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getURL } from '@/lib/headerFunction'

function hero(node) {

    const [windowSize, setWindowSize] = useState("desktop")

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const width = window.innerWidth
            if(width <= 680) {
                setWindowSize("mobile")
            }
        }
    },[])

    const prodList = node.listDetail.filter(list => node.banner.productList.some(banner => list.sys.id === banner.sys.id))

    function prodBanner(prods) {

        let url
        let img
        let imgWidth
        let imgHeight
        let mobileImg
        let mobileWidth
        let mobileHeight
        const title = prods.title
        const button = prods.buttonText

        if(prods.customBanner) {
            img = `https:${prods.customBanner.fields.file.url}`
            imgWidth = prods.customBanner.fields.file.details.image.width
            imgHeight = prods.customBanner.fields.file.details.image.height
        }
        if(prods.mobileCustomBanner) {
            mobileImg = `https:${prods.mobileCustomBanner.fields.file.url}`
            mobileWidth = prods.mobileCustomBanner.fields.file.details.image.width
            mobileHeight = prods.mobileCustomBanner.fields.file.details.image.height
        }
        if(prods.product) {
            const productBanner = node.allProducts.find((idxs) => {
                return idxs.node.id === prods.product;
            })
            
            url = `/products/${productBanner.node.handle}`
            if(!prods.customBanner) {
                img = productBanner.node.images.edges[0].node.originalSrc
                imgWidth = 500
                imgHeight = 500
            }
        } else {
            
            let blogCatData 
            if(prods.contentSource.fields.blogCategory) {
                blogCatData = node.blogCat.find( cat => cat.sys.id === prods.contentSource.fields.blogCategory.sys.id )
            }
            const blogCat = blogCatData ? blogCatData.fields.slug : null
            url = getURL(
                    prods.contentSource.sys.contentType.sys.id, 
                    prods.contentSource.fields.slug, 
                    blogCat, 
                    prods.contentSource.fields.customUrl
                )
        }
        return ({
            "url" : url,
            "img" : img,
            "imgWidth" : imgWidth,
            "imgHeight" : imgHeight,
            "mobileImg" : mobileImg,
            "mobileWidth" : mobileWidth,
            "mobileHeight" : mobileHeight,
            "title" : title,
            "button" : button
        })
    }

    return (
        <div className={`container ${node.banner.displayAtMobile?"":"desktop"}`} key={node.i} data-indx={node.i}>
            <div className={`reco--section ${node.banner.showTitle?"mt-75":"mt-20"}`}>
                {node.banner.showTitle === true?<h2 className="heading tf-cp h3">{node.banner.title}</h2>:""}
                <div className={`grid mob-b ${prodList.length <= 3 ? "nwp": "ls"}`}>
                   { prodList.map( (prod, idx) => {
                        const item = prodBanner(prod.fields)

                        const imgUrl = windowSize == "desktop" ? item.img : item.mobileImg ? item.mobileImg : item.img
                        const imgWidthS = windowSize == "desktop" ? item.imgWidth : item.mobileWidth ? item.mobileWidth : item.imgWidth
                        const imgHeightS = windowSize == "desktop" ? item.imgHeight : item.mobileHeight ? item.mobileHeight : item.imgHeight
                       return (
                        <div className="reco--item full grid--child" key={idx}>
                            <Link href={item.url}><a>
                                <div className='dark--layer'></div>
                                    <Image
                                        src={imgUrl ? imgUrl : "/icons/placeholder.png"}
                                        alt={item.title ? item.title : "aftco"}
                                        width={imgWidthS ? imgWidthS  :500}
                                        height={imgHeightS ? imgHeightS :500}
                                        layout="responsive"
                                        className={`home--banner--img`} 
                                    />
                            </a></Link>
                            <div className={`reco--caption ${node.banner.captionStyle}`}>

                                {windowSize == "desktop" ?
                                    <h3 className="cl-w tf-cp">{item.title ? item.title: ""}</h3>
                                :
                                    <h4 className="cl-w tf-cp">{item.title ? item.title : ""}</h4>
                                }
                                <Link href={item.url}><a><button className="button small white">{item.button ? item.button : "Shop Now"}</button></a></Link>
                            </div>
                        </div>
                       )
                    }
                    ) }                
                </div>
            </div>
        </div>
    )
}

export default hero