import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Price from '@/components/product/Price'
import ReviewStar from '@/components/product/ReviewStar'
import { useRouter } from 'next/router'
import { useCartContext } from '@/context/Store'

function RelatedProductCard({product, vColor, badge, star, grid, keyIdx}) {

    const [img, setImg] = useState(product.imageUrl)
    const router = useRouter()
    const [selected, setSelect] = useState('');
    const vipDiscount = useCartContext()[8]

    useEffect(() => {
        setImg(product.imageUrl)
    }, [product])

    //function imageList(data){
    //    const img = data.filter((v,i,a)=>a.findIndex(t=>(t.imageUrl === v.imageUrl))===i)
    //   return img
    //}

    const handleVariantChange = value => (e) => {
        e.preventDefault();
        e.stopPropagation();
        const img = product.skus.filter((v,i,a)=>a.findIndex(t=>(t.imageUrl === v.imageUrl))===i)
        const newImg = img.find(function(image) {
            return image.name.includes(value)
          })
          setSelect(value)
          setImg(newImg.imageUrl)
    }
    function variantColor(data) {
        const inseam = data[0].name.includes("Inseam")
        let variant = null
        if(inseam) {
            variant = data.map(variants => {return variants.name.split(" / ")[1]})
        } else {
            variant = data.map(variants => {return variants.name.split(" / ")[0]})
        }
        const color = [...new Set(variant)]
        return color
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

    function badges(tags) {
        const tagBadge = badge?badge.filter(bad => tags.some(tagItem => bad.tag == tagItem)):""
        return tagBadge
      }

    function goTo(url) {
        router.push(url)
    }

    function vipDiscountCal(brand) {
        let vipApplied = null
        let vipNotApplied = null
        if (vipDiscount.appliedTo) {
          vipApplied = vipDiscount.appliedTo.find( vip => vip == brand )
          if(vipApplied) {
            return vipDiscount.amountIn
          }
          else {
            return null
          }
        }
        else {
          if (vipDiscount.notAppliedTo) {
            vipNotApplied = vipDiscount.notAppliedTo.find( vip => vip == brand )
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
        <li className={`collection--list nostyle related--product--item ${grid}`} key={keyIdx} role="group" aria-label="product">
            <div className='product--image prod--img'>
                <Link href={product.url.replace('https://shop.aftco.com','').replace('https://aftco.com','')}><a>
                    <div className='badge--wraper flex'>
                        {product.tags1 && badge?
                            badges(product.tags1).map( badgeItem =>
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
                    <Image
                        src={product.imageUrl?img.replace('_200x200_crop_center','_500x500_crop_center'):"/icons/logo.png"}
                        alt=""
                        width={500}
                        height={500}
                        layout="responsive"
                        className="clickable"
                    /> 
                </a></Link>
            </div>
            {vColor?
                <div className='collection--opt--wrap'>
                <div className="collection--options">
                    {variantColor(product.skus).map((value, i) => ( 
                        variantColor(product.skus).length >= 2 && i <= 3?
                        (
                            <div className={`options-color ${!!(value == selected)?"selected":""}`}>
                                <input
                                    aria-selected={!!(value == selected)}
                                    value={value}
                                    type="radio"
                                    id={`color-item-${product.url.replace('https://shop.aftco.com/products/','').replace('https://aftco.com','')}-${i}`}
                                    name={`select-color-${product.url.replace('https://shop.aftco.com/products/','').replace('https://aftco.com','')}`}
                                    checked={selected === value}
                                    onChange={handleVariantChange(value)}
                                />
                                <label className="options--label" key={i}>
                                    {checkColor(value, i)}
                                </label>
                            </div>
                        )
                        : ""
                    ))}
                    <p>{variantColor(product.skus).length > 4 ? `+${variantColor(product.skus).length - 4}`:""}</p>
                </div>
                </div>
            :""}
            <div className="product--description" >
                <Link href={product.url.replace('https://shop.aftco.com','').replace('https://aftco.com','')}><a className="product--title">
                    <h2 className='p'>{product.name}</h2>
                </a></Link>
                {vipDiscount?
                    <Price 
                    currency="$" 
                    num={product.price} 
                    compareAtPrice={product.price != product.listPrice?product.listPrice:null} 
                    vip={vipDiscountCal(product.vendor)}
                    />
                    :
                    <Price 
                    currency="$" 
                    num={product.price} 
                    compareAtPrice={product.price != product.listPrice?product.listPrice:null} 
                    />
                }
                {star ? 
                <div className="review--wrap" >
                    <ReviewStar star={product.ratingValue} />
                    <p>{product.reviewCount}<span className="sr-only">customers have rated this product</span></p>
                </div>
                : null}
            </div>
        </li>
    )
}

export default RelatedProductCard