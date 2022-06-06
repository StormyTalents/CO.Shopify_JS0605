import { useState, useEffect, useCallback } from 'react'
import ReactPlayer from 'react-player';
import Image from 'next/image'
import Link from 'next/link'

function videoSection(node) {

    const [windowSize, setWindowSize] = useState("desktop")

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const width = window.innerWidth
            if(width <= 680) {
                setWindowSize("mobile")
            }
        }
    },[])

    function renderCaption(size, title, pos) {
        switch(size) {
            case "h1":
                return(
                    <h3 className={`center h1 ${pos === "first"?"mt-30":"mt-10" }`}>{title}</h3>
                )
                break;
            case "h2":
                return(
                    <h3 className={`center h2 ${pos === "first"?"mt-30":"mt-10" }`}>{title}</h3>
                )
                break;
            case "h3":
                return(
                    <h3 className={`center h3 ${pos === "first"?"mt-30":"mt-10" }`}>{title}</h3>
                )
                break;
            case "h4":
                return(
                    <h3 className={`center h4 ${pos === "first"?"mt-30":"mt-10" }`}>{title}</h3>
                )
                break;
            case "h5":
                return(
                    <h3 className={`center h5 ${pos === "first"?"mt-30":"mt-10" }`}>{title}</h3>
                )
                break;
            case "h6":
                return(
                    <h3 className={`center h6 ${pos === "first"?"mt-30":"mt-10" }`}>{title}</h3>
                )
                break;
            default:
                return(
                    <p className={`center mt-30`}>{title}</p>
                )
        }
    }

    const checkFeature = useCallback(
        (data) => {
            if(node.data.videoFeature && node.data.videoFeature.includes(data)){
                return true
            }
            
            return false
        },
        [node]
    );

    return (
    <div className={`container ${node.data.displayAtMobile?"":"desktop"} ${node.data.style?node.data.style:"boxed"}`}>
        <div className={`video--loop--section ${node.data.showTitle == true?"mt-75":""}`}>
            {node.data.showTitle ? <h2 className="heading tf-ih h3">{node.data.title}</h2> :""}
            <div className={`video--wraper ${node.data.embedVideo?"embed":"inline"}`}>
                <ReactPlayer 
                    url={node.data.embedVideo?node.data.embedVideo:`https:${node.data.video.fields.file.url}`} 
                    className={node.data.embedVideo?"embed--player":""}
                    controls 
                    loop={checkFeature("Loop")}
                    muted={checkFeature("Autoplay")?true:checkFeature("Muted")}
                    playing={checkFeature("Autoplay")?true:node.data.videoPreviewImage && node.data.videoPreviewImage.fields?true:false}
                    width='100%' 
                    height='100%'
                    light={checkFeature("Autoplay")?false:node.data.videoPreviewImage && node.data.videoPreviewImage.fields?`https:${node.data.videoPreviewImage.fields.file.url}`:""}
                />
            </div>
            <div className="video--caption">
                {renderCaption(node.data.caption1FontSize, node.data.caption1, "first")}
                {renderCaption(node.data.caption2FontSize, node.data.caption2, "second")}
                {renderCaption(node.data.caption3FontSize, node.data.caption3, "last")}
            </div>
            <div className="video--img flex">
                {node.data.images?
                    node.data.images.map((img) => (
                        <div className="img-accor-wraper mt-20">
                            <Image
                                src={`https:${img.fields.file.url}`}
                                alt={img.fields.file.fileName}
                                width={img.fields.file.details.image.width}
                                height={img.fields.file.details.image.height}
                                layout="fixed"
                                className={`home--accordion--img`}
                            />
                        </div>
                    ))
                    :""
                }
            </div>
            {node.data.buttonTitle?
                <Link href={node.data.buttonUrl} passHref ><a><button className="button small center mt-30">{node.data.buttonTitle}</button></a></Link>
            :""}
    </div>
    </div>
    )
}

export default videoSection