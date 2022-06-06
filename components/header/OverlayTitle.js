import Image from 'next/image'
import { blurlogo } from '@/components/icons'

function UnderHeroTitle({content}) {

    return (
        <div className="post--content">
            <div className="img--hero overlay">
                <Image
                    src={content.fields.heroImage && content.fields.heroImage.fields?'https:'+content.fields.heroImage.fields.file.url:"/icons/logo.png"}
                    alt={content.fields.heroImage && content.fields.heroImage.fields?content.fields.heroImage.fields.file.fileName:"aftco"}
                    width={content.fields.heroImage && content.fields.heroImage.fields?content.fields.heroImage.fields.file.details.image.width:500}
                    height={content.fields.heroImage && content.fields.heroImage.fields?content.fields.heroImage.fields.file.details.image.height:280}
                    layout="responsive"
                    placeholder="blur"
                    blurDataURL={blurlogo}
                />
                <div className='overlay--bg'></div>
                <div className={`caption ${content.fields.titlePosition}`}>
                    {content.fields.titleImage && content.fields.titleImageAlign.includes("top")?
                        <div className="img--wrap">
                            <Image
                                src={content.fields.titleImage && content.fields.titleImage.fields?'https:'+content.fields.titleImage.fields.file.url:"/icons/logo.png"}
                                alt={content.fields.titleImage && content.fields.titleImage.fields?content.fields.titleImage.fields.file.fileName:"aftco"}
                                width={content.fields.titleImage && content.fields.titleImage.fields?content.fields.titleImage.fields.file.details.image.width:500}
                                height={content.fields.titleImage && content.fields.titleImage.fields?content.fields.titleImage.fields.file.details.image.height:280}
                                layout="responsive"
                                placeholder="blur"
                                blurDataURL={blurlogo}
                            />
                        </div>
                    :""}
                    <h1 className='h2'>{content.fields.title}</h1>
                    {content.fields.titleImage && content.fields.titleImageAlign.includes("bottom")?
                        <Image
                            src={content.fields.titleImage && content.fields.titleImage.fields?'https:'+content.fields.titleImage.fields.file.url:"/icons/logo.png"}
                            alt={content.fields.titleImage && content.fields.titleImage.fields?content.fields.titleImage.fields.file.fileName:"aftco"}
                            width={content.fields.titleImage && content.fields.titleImage.fields?content.fields.titleImage.fields.file.details.image.width:500}
                            height={content.fields.titleImage && content.fields.titleImage.fields?content.fields.titleImage.fields.file.details.image.height:280}
                            layout="responsive"
                            placeholder="blur"
                            blurDataURL={blurlogo}
                        />
                    :""}
                </div>
            </div>
        </div>
    )
}
export default UnderHeroTitle