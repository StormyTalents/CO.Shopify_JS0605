import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Price from '@/components/product/Price'
import ReviewStar from '@/components/product/ReviewStar' 
import { blurlogo } from '@/components/icons'
import { useRouter } from 'next/router'
import { useCartContext } from '@/context/Store'
import { dl_select_item } from '@/lib/dataLayer'

function ProductCard({ allProd, contenfulData, product, vColor, reviews, pos }) {
  const router = useRouter();
  const vipDiscount = useCartContext()[8]

  /* Chain Prod Function */
  const findChain = contenfulData.chainList.find(data => data.fields.mainProduct === product.node.id)

  let chainProd
  let options = []
  let images = []
  if(findChain) {
    chainProd = allProd.filter(prod => findChain.fields.subProducts.some(param => prod.node.id === param))
    chainProd.push(product)
    chainProd.map((chain,i) => {
      chain.node.options.map((item,index) => {
        if(item.name == "Color") {
          item.values.map((color) => {
            options.push(color)
          })
        }
      })
    })
    chainProd.map((chain,i) => {
      chain.node.images.edges.map((item,index) => {
        images.push(item)
      })
    })
  }
  else {
    product.node.options.map((item,index) => {
      if(item.name == "Color") {
        item.values.map((color) => {
          options.push(color)
        })
      }
    })
    
    images = product.node.images.edges
  }
  /* end */
  
  const defaultImg = images.find(function(image) {
    return image.node.altText && options[0] ? image.node.altText.replace(/\s/g, '') == options[0].replace(/\s/g, '') : null
  })

  const defaulthoverImg = images.find(function(image) {
    return image.node.altText && options[0] ? image.node.altText.replace(/\s/g, '') == `hover-${options[0].replace(/\s/g, '')}` : null
  })

  const handle = product.node.handle
  const title = product.node.title
  const price = product.node.priceRange.minVariantPrice.amount
  const [imageNode, setImageNode] = useState(defaultImg? defaultImg.node : images[0].node)
  const [hoverImageNode, sethoverImageNode] = useState(defaulthoverImg? defaulthoverImg.node : "")
  const [onload , setOnload] = useState(true)
  const [selected, setSelect] = useState(options[0]);
  
  useEffect(() => {
      setImageNode(defaultImg? defaultImg.node : images[0].node)
      sethoverImageNode(defaulthoverImg? defaulthoverImg.node : "")
  },[product, router.asPath]);
  
  const handleVariantChange = value => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOnload(false)
    const GalleryImg = images.find(function(image) {
      return image.node.altText?image.node.altText.replace(/\s/g, '') == value.replace(/\s/g, ''):null
    })
    const hoverImg = images.find(function(image) {
      return image.node.altText?image.node.altText.replace(/\s/g, '') == `hover-${value.replace(/\s/g, '')}`:null
    })

    setImageNode(GalleryImg ? GalleryImg.node : "")
    sethoverImageNode(hoverImg ? hoverImg.node : "")
    setSelect(value)
}
  
  function checkColor(value, i) {
    const colorHex = vColor.find((secopt) => {
      return secopt.color === value;
    })
    
    if(colorHex){
      if(colorHex.hex != undefined){
        return (
          <div className="with--bgColor" style={{backgroundColor:colorHex.hex}}></div>
          )
      }
      else{
        return (
          <div className="with--bgImg" style={{backgroundImage:`url(${colorHex.image.fields.file.url})`}}></div>
          )
      }
    }
    else {
      return (
        <div className="no--color">{value}</div>
      )
    }
  }
  function review(id) {
    const prodIdsUrl = Buffer.from(id, 'base64').toString('binary')
    const realProdId = prodIdsUrl.replace("gid://shopify/Product/", "")
    const review = reviews.find((reviewId) => {
      return reviewId.productId === realProdId;
    })
    return ( 
      review ?
        <div className="review">
          {review.rating >= 1 ?
          <div className="review--wrap" data-star={review.rating}>
            <ReviewStar star={review.rating}/>
            <p>{review.count}<span className="sr-only">customers have rated this product</span></p>
          </div>
          :""}
        </div>
        :""
    )
  }

  function badges(tags) {
    const tagBadge = contenfulData.badge?contenfulData.badge.filter(bad => tags.some(tagItem => bad.tag == tagItem)):""
    tagBadge.sort(function(x) {
      if (x.tag.includes("ICAST")) {
        return 1;
      }
      if (!x.tag.includes("ICAST")) {
        return -1;
      }
      return 0;
    });
    return tagBadge
  }

  function gtm() {
    dl_select_item(product,router.asPath,pos)
  }

  function vipDiscountCal(vendor) {
    let vipApplied = null
    let vipNotApplied = null

    if (vipDiscount.appliedTo) {
      vipApplied = vipDiscount.appliedTo.find( vip => vip == vendor )
      if(vipApplied) {
        return vipDiscount.amountIn
      }
      else {
        return null
      }
    }
    else {
      if (vipDiscount.notAppliedTo) {
        vipNotApplied = vipDiscount.notAppliedTo.find( vip => vip == vendor ) 
        if (vipNotApplied) {
          return null
        }
        else {
          return vipDiscount.amountIn
        }
      }
      else {
        return vipDiscount.amountIn
      }
    }
  }
  
  return (
      <li className="collection--list" key={product.node.handle} role="group" aria-label="product">
          <div className="product--image prod--img">
            <div className='badge--wraper flex'>
              {badges(product.node.tags)?
                badges(product.node.tags).map( badgeItem =>
                  <div className={`badge ${badgeItem.title ==  "Donation Product" ? "donation":"" } ${badgeItem.title.includes("ICAST")?"icast":"" }`}>
                      <Image
                        src={`https:${badgeItem.badge.fields.file.url}`}
                        alt={badgeItem.title}
                        width={badgeItem.badge.fields.file.details.image.width}
                        height={badgeItem.badge.fields.file.details.image.height}
                        layout="responsive"
                      />
                  </div>
                )
              :""}
            </div>
            <div className="img--wrap--fade">
              <Link href={`/products/${handle}`}><a onClick={() => gtm()}>
                <div className='main--img'>
                  <Image
                    src={imageNode?imageNode.smallImage:"/icons/placeholder.png"}
                    alt=""
                    width={500}
                    height={500}
                    layout="responsive"
                    data-img={imageNode?imageNode.smallImage:"/icons/placeholder.png"}
                    placeholder="blur"
                    blurDataURL={blurlogo}
                    onLoad={() => setOnload(true)}
                    className="clickable"
                  />
                </div>
                {hoverImageNode && 
                  <div className='sec--img'>
                    <Image
                      src={hoverImageNode.smallImage}
                      alt=""
                      width={500}
                      height={500}
                      layout="responsive"
                      data-img={hoverImageNode.smallImage}
                      placeholder="blur"
                      blurDataURL={blurlogo}
                      onLoad={() => setOnload(true)}
                      className="clickable"
                    />
                  </div>
                }
              </a></Link>
            </div>
          </div>
        <div className="collection--opt--wrap">
          <div className="collection--options">
            {options.map((value, i) => ( 
              options.length >= 2 && i <= 3 ?
                <div className={`options-color ${!!(value == selected)?"selected":""}`}>
                    <input
                        aria-selected={!!(value == selected)}
                        value={value}
                        type="radio"
                        id={`color-item-${handle}-${i}`}
                        name={`select-color-${handle}`}
                        checked={selected === value}
                        onChange={handleVariantChange(value)}
                    />
                    <label className="options--label" key={i}>
                        {checkColor(value, i)}
                    </label>
                </div>
                  : ""
            ))}
            <p>{options.length > 4 ? `+${options.length - 4}`:""}</p>
          </div>
                  
          <Link href={`/products/${handle}`}> 
            <a className="product--title" onClick={() => gtm()}>
            <h2 className='p'>{title}</h2>
            </a>
          </Link>
          {vipDiscount?
            <Price 
              currency="$" 
              num={price} 
              compareAtPrice={product.node.variants?product.node.variants.edges[0].node.compareAtPrice:null} 
              vip={vipDiscountCal(product.node.vendor)}
            />
            :
            <Price 
              currency="$" 
              num={price} 
              compareAtPrice={product.node.variants?product.node.variants.edges[0].node.compareAtPrice:null}
            />
          }
            {review(product.node.id)}
        </div>
      </li>
  )
}

export default ProductCard
