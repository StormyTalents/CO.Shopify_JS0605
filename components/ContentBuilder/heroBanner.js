import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

function hero(node) {

    const [windowSize, setWindowSize] = useState(null)

    useEffect(() => {
            const width = window.innerWidth
            if(width > 1200 ) {
                setWindowSize("desktop")
            }
            if(width <= 1200 && width >= 820 ) {
                setWindowSize("tablet")
            }
            if (width < 820 && width > 680) {
                setWindowSize("tablet-potrait")
            }
            if (width <= 680) {
                setWindowSize("mobile")
            }
    },[])

    const targetLink = node.hero.button2Url ? null : node.hero.button1Url;

    const heading = (showTitle, content, type, captionTitle) => {
        if(showTitle && type == "title") {
            return(<h2 className="cl-w h2">{content}</h2>)
        }
        if(showTitle && type == "Subtitle") {
            if(captionTitle) {
                return(<h3 className="cl-w h4">{content}</h3>) 
            }
            else {
                return(<h2 className="cl-w h4">{content}</h2>)
            }
        }
        if(!showTitle && type == "title") {
            if (node.i > 0) {
                return(<h2 className="cl-w h2">{content}</h2>) 
            }
            else {
                return(<h1 className="cl-w h2">{content}</h1>)
            }
        }
        if(!showTitle && type == "Subtitle") {
            if (node.i > 0) {
                if(captionTitle) {
                    return(<h3 className="cl-w h4">{content}</h3>)
                }
                else {
                    return(<h2 className="cl-w h4">{content}</h2>)
                }
            }
            else {
                return(<h2 className="cl-w h4">{content}</h2>)
            }
        }
    }

    return (
        windowSize ?
        <div className={`${node.hero.fullWidth == true?"full":"container"} ${node.hero.displayAtMobile?"":"desktop"} ${node.hero.darkerBackground && "darker"}`}>
            <div className={`${node.hero.showTitle?"hero--ban mt-75":""} ${node.i>0?"hero--ban mt-75":""}`}>
                {node.hero.showTitle?<h2 className="heading tf-cp h3" >{node.hero.title}</h2>:""}
                { windowSize == "desktop" ||  windowSize == "tablet" ?
                    targetLink ?
                        <div className="home--hero--banner with-button-2" key={node.i}>
                            <Link href={targetLink}>
                                <a>
                                    <Image
                                        src={`https:${node.hero.image.fields.file.url}`}
                                        alt={`Go to ${node.hero.title}`}
                                        width={node.hero.image.fields.file.details.image.width}
                                        height={node.hero.image.fields.file.details.image.height}
                                        layout="responsive"
                                        className={`home--banner--img`}
                                        priority={node.i>0?"false":"true"}
                                    />
                                    <div className="container hero--caption--wrap">
                                        <div className={`hero--caption ${node.hero.captionWidth == "Half" ? "half":""} ${node.hero.captionsAlign} ${node.hero.captionPosition}`}>
                                            {node.hero.captionTitle?heading(node.hero.showTitle, node.hero.captionTitle,"title"):""}
                                            {node.hero.captionSubtitle?heading(node.hero.showTitle, node.hero.captionSubtitle,"Subtitle", node.hero.captionTitle):""}
                                            <div className={`call--action flex ${node.hero.captionsAlign}`}>
                                                {node.hero.button1?
                                                    <button className={`button small ${node.hero.buttonColor?node.hero.buttonColor.toLowerCase():""}`}>
                                                        {node.hero.button1}
                                                    </button>
                                                :""}
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </Link>
                        </div>
                    :
                        <div className="home--hero--banner no-button-2" key={node.i}>
                                <Image
                                    src={`https:${node.hero.image.fields.file.url}`}
                                    alt={`Go to ${node.hero.title}`}
                                    width={node.hero.image.fields.file.details.image.width}
                                    height={node.hero.image.fields.file.details.image.height}
                                    layout="responsive"
                                    className={`home--banner--img`}
                                    priority={node.i>0?"false":"true"}
                                />
                                <div className="container hero--caption--wrap">
                                    <div className={`hero--caption ${node.hero.captionWidth == "Half" ? "half":""} ${node.hero.captionsAlign} ${node.hero.captionPosition}`}>
                                        {node.hero.captionTitle?heading(node.hero.showTitle, node.hero.captionTitle,"title"):""}
                                        {node.hero.captionSubtitle?heading(node.hero.showTitle, node.hero.captionSubtitle,"Subtitle", node.hero.captionTitle):""}
                                        <div className={`call--action flex ${node.hero.captionsAlign}`}>
                                            {node.hero.button1?
                                                <Link href={node.hero.button1Url?node.hero.button1Url:"/"}><a>
                                                    <button className={`button small ${node.hero.buttonColor?node.hero.buttonColor.toLowerCase():""}`}>
                                                        {node.hero.button1}
                                                    </button>
                                                </a></Link>
                                            :""}
                                            {node.hero.button2?
                                                    <Link href={node.hero.button2Url?node.hero.button2Url:"/"}><a>
                                                        <button className={`button small ${node.hero.buttonColor?node.hero.buttonColor.toLowerCase():""}`}>
                                                            {node.hero.button2}
                                                        </button>
                                                    </a></Link>
                                                :""}
                                        </div>
                                    </div>
                                </div>
                            </div>
                :
                    node.hero.mobileImage && windowSize != "tablet" && windowSize != "tablet-potrait"?
                        targetLink ?
                            <div className={`home--hero--banner ${node.hero.mobileCaptionStyle}`} key={node.i}>
                                <Link href={targetLink}><a>
                                    <Image
                                        src={`https:${node.hero.mobileImage.fields.file.url}`}
                                        alt={node.hero.title}
                                        width={node.hero.mobileImage.fields.file.details.image.width}
                                        height={node.hero.mobileImage.fields.file.details.image.height}
                                        layout="responsive"
                                        className={`home--banner--img`}
                                        priority
                                    />
                                    <div className="container hero--caption--wrap mobile">
                                        <div className={`hero--caption mt-30 ${node.hero.captionWidth == "Half" ? "half":""} ${node.hero.mobileCaptionAlign} ${node.hero.mobileCaptionPosition}`}>
                                            {node.hero.captionTitle?heading(node.hero.showTitle, node.hero.captionTitle,"title"):""}
                                            {node.hero.captionSubtitle?heading(node.hero.showTitle, node.hero.captionSubtitle,"Subtitle"):""}
                                            <div className={`call--action flex ${node.hero.captionsAlign}`}>
                                                {node.hero.button1?
                                                    <button className="button small blue">{node.hero.button1}</button>
                                                :""}
                                            </div>
                                        </div>
                                    </div>
                                </a></Link>
                            </div>
                        :
                            <div className={`home--hero--banner ${node.hero.mobileCaptionStyle}`} key={node.i}>
                                <Image
                                    src={`https:${node.hero.mobileImage.fields.file.url}`}
                                    alt={node.hero.title}
                                    width={node.hero.mobileImage.fields.file.details.image.width}
                                    height={node.hero.mobileImage.fields.file.details.image.height}
                                    layout="responsive"
                                    className={`home--banner--img`}
                                    priority
                                />
                                <div className="container hero--caption--wrap mobile">
                                    <div className={`hero--caption mt-30 ${node.hero.captionWidth == "Half" ? "half":""} ${node.hero.mobileCaptionAlign} ${node.hero.mobileCaptionPosition}`}>
                                        {node.hero.captionTitle?heading(node.hero.showTitle, node.hero.captionTitle,"title"):""}
                                        {node.hero.captionSubtitle?heading(node.hero.showTitle, node.hero.captionSubtitle,"Subtitle"):""}
                                        <div className={`call--action flex ${node.hero.captionsAlign}`}>
                                            {node.hero.button1?
                                                <Link href={node.hero.button1Url}><a>
                                                    <button className="button small blue">{node.hero.button1}</button>
                                                </a></Link>
                                            :""}
                                            {node.hero.button2?
                                                <Link href={node.hero.button2Url}><a>
                                                    <button className="button small blue">{node.hero.button2}</button>
                                                </a></Link>
                                            :""}
                                        </div>
                                    </div>
                                </div>
                            </div>
                    :
                        targetLink ?
                            <div className={`home--hero--banner ${node.hero.mobileCaptionStyle}`} key={node.i}>
                                <Link href={node.hero.button1Url}><a>
                                    <div className="no-img-for-mobile">
                                        <Image
                                            src={`https:${node.hero.image.fields.file.url}`}
                                            alt={node.hero.title}
                                            layout="fill"
                                            objectFit="cover"
                                            className={`home--banner--img`}
                                            priority
                                        />
                                    </div>
                                    <div className="container hero--caption--wrap mobile">
                                        <div className={`hero--caption mt-30 ${node.hero.captionWidth == "Half" ? "half":""} ${node.hero.mobileCaptionAlign} ${node.hero.mobileCaptionPosition}`}>
                                            {node.hero.captionTitle?heading(node.hero.showTitle, node.hero.captionTitle,"title"):""}
                                            {node.hero.captionSubtitle?heading(node.hero.showTitle, node.hero.captionSubtitle,"Subtitle"):""}
                                            <div className={`call--action flex ${node.hero.captionsAlign}`}>
                                                {node.hero.button1?
                                                    
                                                        <button className="button small blue">{node.hero.button1}</button>
                                                    
                                                :""}
                                            </div>
                                        </div>
                                    </div>
                                </a></Link>
                            </div>
                        :
                            <div className={`home--hero--banner ${node.hero.mobileCaptionStyle}`} key={node.i}>
                                <div className="no-img-for-mobile">
                                    <Image
                                        src={`https:${node.hero.image.fields.file.url}`}
                                        alt={node.hero.title}
                                        layout="fill"
                                        objectFit="cover"
                                        className={`home--banner--img`}
                                        priority
                                    />
                                </div>
                                <div className="container hero--caption--wrap mobile">
                                    <div className={`hero--caption mt-30 ${node.hero.captionWidth == "Half" ? "half":""} ${node.hero.mobileCaptionAlign} ${node.hero.mobileCaptionPosition}`}>
                                        {node.hero.captionTitle?heading(node.hero.showTitle, node.hero.captionTitle,"title"):""}
                                        {node.hero.captionSubtitle?heading(node.hero.showTitle, node.hero.captionSubtitle,"Subtitle"):""}
                                        <div className={`call--action flex ${node.hero.captionsAlign}`}>
                                            {node.hero.button1?
                                                <Link href={node.hero.button1Url}><a>
                                                    <button className="button small blue">{node.hero.button1}</button>
                                                </a></Link>
                                            :""}
                                            {node.hero.button2?
                                                <Link href={node.hero.button2Url}><a>
                                                    <button className="button small blue">{node.hero.button2}</button>
                                                </a></Link>
                                            :""}
                                        </div>
                                    </div>
                                </div>
                            </div>
                    }

                {node.hero.imageList?
                    <div className={`sub--hero flex img--list ${windowSize == "mobile" || windowSize == "tablet-potrait" && node.hero.mobileCaptionStyle != "overlay"? "mt-20":""}`}>
                        {node.hero.imageList.map((img, i) =>
                            <div className="img--item" key={i} style={{width:`calc( 100% / ${node.hero.imageList.length})`}}>
                                <Image
                                    src={`https:${img.fields.file.url}`}
                                    alt={img.fields.title+' logo'}
                                    width={img.fields.file.details.image.width}
                                    height={img.fields.file.details.image.height}
                                    layout="responsive"
                                    className={`list--img`}
                                />
                            </div>
                        )}
                    </div>
                :""}                    
            </div>
        </div>
        :""
    )
}

export default hero