import Image from 'next/image'
import { blurlogo } from '@/components/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'

function UnderHeroTitle({content, products, reviewNeeded, basicProdData, richTextData}) {

    function date(date) {
        const d = new Date(date);
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
    
        return(d.toLocaleDateString("en-US", options))
      }

    return (
        <div className="post--header">
            <div className="img--hero">
            <Image
                src={content.fields.heroImage && content.fields.heroImage.fields?'https:'+content.fields.heroImage.fields.file.url:"/icons/logo.png"}
                alt={content.fields.heroImage && content.fields.heroImage.fields?content.fields.heroImage.fields.file.fileName:"aftco"}
                width={content.fields.heroImage && content.fields.heroImage.fields?content.fields.heroImage.fields.file.details.image.width:500}
                height={content.fields.heroImage && content.fields.heroImage.fields?content.fields.heroImage.fields.file.details.image.height:280}
                layout="responsive"
                placeholder="blur"
                blurDataURL={blurlogo}
            />
            </div>
            <div className="container">
                <div className="meta--data">
                    <p className="date">{date(content.fields.publishDate)}</p>
                    <span className='post--header--separator'><FontAwesomeIcon icon={faCircle} /></span>
                    <p className="category">{content.fields.category}</p>
                </div>
                <h1 className='h2'>{content.fields.title}</h1>
            </div>
        </div>
    )
}
export default UnderHeroTitle