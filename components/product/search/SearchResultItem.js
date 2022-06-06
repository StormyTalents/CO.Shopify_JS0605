import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Price from '@/components/product/Price'
import { blurlogo } from '@/components/icons'
import { useCartContext } from '@/context/Store'
 
function SearchItem({ product, vColor}) {

  const vipDiscount = useCartContext()[8]
  const handle = product.url.replace("https://shop.aftco.com", "").replace("https://aftco.com", "")
  const title = product.name
  const price = parseFloat(product.price).toFixed(2)
  const brand = product.brand
  const salePrice = parseFloat(product.salePrice).toFixed(2)
  const [imageResult, setImageResult] = useState(product.image)

  useEffect(() => {
      setImageResult(product.image)
  },[product]);

  function checkColor(value, i) {
    const colorHex = vColor.find((secopt) => {
      return secopt.color == value;
    })
    if(colorHex){
      if(colorHex.hex != null){
        return (
          <div className="with--bgColor" style={{backgroundColor:colorHex.hex}}></div>
          )
      }
      else {
        return (
          <div className="with--bgImg" style={{backgroundImage:`url(${colorHex.image.fields.file.url})`}}></div>
          )
      }
    }
  }

  function swathes(data) {
    const myArr = data.split(";;;;");
    const colors = myArr.filter((str,i) => str.includes(`variantColor`))
    const img = myArr.filter((str,i) => str.includes(`variantImage`))
    const color = colors.map((color,i) => 
    (
          <div className="options--label" onClick={(e) => handleVariantChange(color.match( /\d+/g, ''),img)} >
            {checkColor(color.split(":").pop().trim(), i)}
          </div>
    ))
    return(color)
  }

  function handleVariantChange(num, img) {
    const varImg = img.filter((str,i) => str.includes(`variantImage${num}`))
    setImageResult(`https:${varImg[0].split(":").pop()}`)
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
      <div className="prod--list" key={handle}>
        <Link href={handle} passHref >
          <a className="product--image prod--img">
            <Image
              src={imageResult?imageResult:"/icons/logo.png"}
              alt="aftco"
              width={500}
              height={500}
              layout="responsive"
              className=""
              placeholder="blur"
              blurDataURL={blurlogo}
            />
          </a>
        </Link>
        <div className=""> 
        <Link href={handle} passHref >
            <a className="product--title">
              {title}
            </a>
          </Link>
          <div className="collection--opt--wrap">
            <div className="collection--options">
              {product.swatchesInfo?swathes(product.swatchesInfo):""}
            </div>
          </div>
            <Price 
              currency="$" 
              num={price > salePrice ? salePrice : price} 
              compareAtPrice={price > salePrice ? price : null} 
              vip={vipDiscountCal(brand)}
            />
        </div>
      </div>
  )
}

export default SearchItem
