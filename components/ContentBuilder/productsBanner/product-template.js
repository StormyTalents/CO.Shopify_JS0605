<div className="reco--item full grid--child" key={idx}>
    {product.fields.customBanner ?
        windowSize == "desktop"?
            <Link href={`/products/${prodBanner(product.fields.product).node.handle}`}><a>
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
                <Link href={`/products/${prodBanner(product.fields.product).node.handle}`}><a>
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
                <Link href={`/products/${prodBanner(product.fields.product).node.handle}`}><a>
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
        <Link href={`/products/${prodBanner(product.fields.product).node.handle}`}><a>
            <div className='dark--layer'></div>
            <Image
                src={prodBanner(product.fields.product).node.images.edges[0].node.originalSrc}
                alt={prodBanner(product.fields.product).node.images.edges[0].node.altText}
                width={500}
                height={500}
                layout="responsive"
                className={`home--banner--img`} 
            />
        </a></Link>
    }
    <div className={`reco--caption ${node.banner.captionStyle}`}>
        {windowSize == "desktop" ?<h3 className="cl-w tf-cp">{product.fields.title?product.fields.title:prodBanner(product.fields.product).node.title}</h3>:<h4 className="cl-w tf-cp">{product.fields.title?product.fields.title:prodBanner(product.fields.product).node.title}</h4>}
        <Link href={`/products/${prodBanner(product.fields.product).node.handle}`}><a><button className="button small white">{product.fields.buttonText?product.fields.buttonText:"Shop Now"}</button></a></Link>
    </div>
</div>