import Image from 'next/image'
import Link from 'next/link'

function herobox(node) {
    return (
        <div className={`hero--box mt-75`}>
            <div className="container">
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
                        <h2 className='h3'>{node.data.title}</h2>
                        <p>{node.data.descriptions}</p>
                        {node.data.buttonUrl?<Link href={node.data.buttonUrl}><a className='no--decor'><button className='button blue'>{node.data.button}</button></a></Link>:""}
                    </div>
                </div>
            </div> 
        </div>
    )
}

export default herobox