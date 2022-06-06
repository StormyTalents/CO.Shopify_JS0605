<div className="reco--item full grid--child" key={idx}>
    {windowSize == "desktop"?
            <Link href={`/${product.fields.contentSource.sys.contentType.sys.id == "page"?"pages":"blogs"}${product.fields.contentSource.sys.contentType.sys.id =="blog"?`/${product.fields.contentSource.fields.category.replace(/\s+/g, '-').toLowerCase()}`:""}/${product.fields.contentSource.fields.slug}`}><a>
                <div className='dark--layer'></div>
                <Image
                    src={product.fields.customBanner?`https:${product.fields.customBanner.fields.file.url}`:"/icons/placeholder.png"}
                    alt={product.fields.customBanner?product.fields.customBanner.fields.file.fileName:"aftco"}
                    width={product.fields.customBanner?product.fields.customBanner.fields.file.details.image.width:500}
                    height={product.fields.customBanner?product.fields.customBanner.fields.file.details.image.height:500}
                    layout="responsive"
                    className={`home--banner--img`} 
                />
            </a></Link>
        :
            product.fields.mobileCustomBanner?
                <Link href={`/${product.fields.contentSource.sys.contentType.sys.id == "page"?"pages":"blogs"}${product.fields.contentSource.sys.contentType.sys.id =="blog"?`/${product.fields.contentSource.fields.category.replace(/\s+/g, '-').toLowerCase()}`:""}/${product.fields.contentSource.fields.slug}`}><a>
                    <div className='dark--layer'></div>
                    <Image
                        src={product.fields.mobileCustomBanner?`https:${product.fields.mobileCustomBanner.fields.file.url}`:"/icons/placeholder.png"}
                        alt={product.fields.mobileCustomBanner?product.fields.mobileCustomBanner.fields.file.fileName:"aftco"}
                        width={product.fields.mobileCustomBanner?product.fields.mobileCustomBanner.fields.file.details.image.width:500}
                        height={product.fields.mobileCustomBanner?product.fields.mobileCustomBanner.fields.file.details.image.height:500}
                        layout="responsive"
                        className={`home--banner--img`} 
                    />
                </a></Link>
            :
                <Link href={`/${product.fields.contentSource.sys.contentType.sys.id == "page"?"pages":"blogs"}${product.fields.contentSource.sys.contentType.sys.id =="blog"?`/${product.fields.contentSource.fields.category.replace(/\s+/g, '-').toLowerCase()}`:""}/${product.fields.contentSource.fields.slug}`}><a>
                    <div className='dark--layer'></div>
                    <Image
                        src={product.fields.customBanner?`https:${product.fields.customBanner.fields.file.url}`:"/icons/placeholder.png"}
                        alt={product.fields.customBanner?product.fields.customBanner.fields.file.fileName:"aftco"}
                        width={product.fields.customBanner?product.fields.customBanner.fields.file.details.image.width:500}
                        height={product.fields.customBanner?product.fields.customBanner.fields.file.details.image.height:500}
                        layout="responsive"
                        className={`home--banner--img`} 
                    />
                </a></Link>
    }
    <div className={`reco--caption ${node.banner.captionStyle}`}>
        {windowSize == "desktop" ?<h3 className="cl-w tf-cp">{product.fields.title?product.fields.title:""}</h3>:<h4 className="cl-w tf-cp">{product.fields.title?product.fields.title:prodBanner(product.fields.product).node.title}</h4>}
        <Link href={`/${product.fields.contentSource.sys.contentType.sys.id == "page"?"pages":"blogs"}${product.fields.contentSource.sys.contentType.sys.id =="blog"?`/${product.fields.contentSource.fields.category.replace(/\s+/g, '-').toLowerCase()}`:""}/${product.fields.contentSource.fields.slug}`}><a>
            <button className="button small white">{product.fields.buttonText?product.fields.buttonText:"Shop Now"}</button>
        </a></Link>
    </div>
</div>