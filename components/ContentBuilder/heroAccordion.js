import Image from 'next/image'
import Wsyig from '@/components/ContentBuilder/wsyig'

function herobox(node) {
    
    return (
        <div className={`hero--accordion mt-75`}>
            <div className="container">
                <h2 className="center accordion--title mb-30 h3">{node.data.title}</h2>
                <div className={`flex ${node.data.position === "Right"?"reverse":""}`}>
                    <div className="img--wraper">
                    <Image
                        src={node.data.image?`https:${node.data.image.fields.file.url}`:"/icons/placeholder.png"}
                        alt={node.data.image?node.data.image.fields.file.fileName:"aftco"}
                        width={node.data.image?node.data.image.fields.file.details.image.width:500}
                        height={node.data.image?node.data.image.fields.file.details.image.height:500}
                        layout="responsive"
                        className={`home--banner--img`}
                    />
                    </div>
                    <div className="hero--box--caption">
                        {node.data.accordion1Title && 
                        <div className="accordion">
                            <h2 className='h6'>{node.data.accordion1Title}</h2>
                            {node.data.accordion1Content?
                            node.data.accordion1Content.content.map(content => <Wsyig data={content} />)
                            :""}
                            {node.data.accordion1Img?
                                node.data.accordion1Img.map((img) => (
                                    <div className="img-accor-wraper mt-20">
                                        <Image
                                            src={`https:${img.fields.file.url}`}
                                            alt={img.fields.file.fileName}
                                            width={img.fields.file.details.image.width}
                                            height={img.fields.file.details.image.height}
                                            layout="responsive"
                                            className={`home--accordion--img`}
                                        />
                                    </div>
                                ))
                                :""
                            }
                        </div>
                        }
                        { node.data.accordion2Title &&
                        <div className="accordion">
                            <h2 className='h6'>{node.data.accordion2Title}</h2>
                            {node.data.accordion2Content?
                            node.data.accordion2Content.content.map(content => <Wsyig data={content} />)
                            :""}
                            {node.data.accordion2Img?
                                node.data.accordion2Img.map((img) => (
                                    <div className="img-accor-wraper mt-20">
                                        <Image
                                            src={`https:${img.fields.file.url}`}
                                            alt={img.fields.file.fileName}
                                            width={img.fields.file.details.image.width}
                                            height={img.fields.file.details.image.height}
                                            layout="responsive"
                                            className={`home--accordion--img`}
                                        />
                                    </div>
                                ))
                                :""
                            }
                        </div>
                        }
                        {node.data.accordion3Title &&
                        <div className="accordion">
                            <h6>{node.data.accordion3Title}</h6>
                            {node.data.accordion3Content?
                            node.data.accordion3Content.content.map(content => <Wsyig data={content} />)
                            :""}
                            {node.data.accordion3Img?
                                node.data.accordion3Img.map((img) => (
                                    <div className="img-accor-wraper mt-20">
                                        <Image
                                            src={`https:${img.fields.file.url}`}
                                            alt={img.fields.file.fileName}
                                            width={img.fields.file.details.image.width}
                                            height={img.fields.file.details.image.height}
                                            layout="responsive"
                                            className={`home--accordion--img`}
                                        />
                                    </div>
                                ))
                                :""
                            }
                        </div>
                        }
                        {node.data.accordion4Title && 
                        <div className="accordion">
                            <h2 className='h6'>{node.data.accordion4Title}</h2>
                            {node.data.accordion4Content?
                            node.data.accordion4Content.content.map(content => <Wsyig data={content} />)
                            :""}
                            {node.data.accordion4Img?
                                node.data.accordion4Img.map((img) => (
                                    <div className="img-accor-wraper mt-20">
                                        <Image
                                            src={`https:${img.fields.file.url}`}
                                            alt={img.fields.file.fileName}
                                            width={img.fields.file.details.image.width}
                                            height={img.fields.file.details.image.height}
                                            layout="responsive"
                                            className={`home--accordion--img`}
                                        />
                                    </div>
                                ))
                                :""
                            }
                        </div>
                        }
                    </div>
                </div>
            </div> 
        </div>
    )
}

export default herobox