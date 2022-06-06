import { useState, useEffect, useCallback, useRef } from 'react'
import { useCartContext, useAddToCartContext } from '@/context/Store'
import ProductInfo from '@/components/product/ProductInfo'
import ProductImage from '@/components/product/ProductImage'
import { backInStockKlavio, getCartSubTotal, getTotalCartQuantity } from '@/utils/helpers'
import Image from 'next/image'
import Link from 'next/link'
import classNames from 'classnames'
import { blurlogo, Close } from '@/components/icons'
import { useRouter } from 'next/router'
import { dl_add_to_cart } from '@/lib/dataLayer'
import cookieCutter from 'cookie-cutter'

import ProductDescriptions from '@/components/product/ProductDescriptions'
import RelatedProduct from '@/components/product/RelatedProduct'
import RichText from '@/components/richtext' 


function ProductDetails({ productData, productQuantityData, reviews, chainProduct, relatedProduct, slider, metafields, richTextBasicData, sizeChartContent }) {

  const modalSoldOutRef = useRef(null);
  const modalSizeRef = useRef(null);

  // Button Modal
  const btnSizeChart = useRef(null);
  const btnSoldOut = useRef(null);
  const findADealer = productData.vendor == "TACKLE" ? true : false
  const firstProduct = [productData]
  const allProduct = chainProduct?firstProduct.concat(chainProduct):productData
  const isLoading = useCartContext()[2]
  const vipDiscount = useCartContext()[8]
  const cart = useCartContext()[0]
  const addToCart = useAddToCartContext()
  const gaff = productData.options.some(opt => opt.name.includes("Handle"))
  let options
  let stock = []
  let variants = []
  let images = []
  let stockUse
  
  if (chainProduct != null) {
    variants.push(...productData.variants.edges)
    chainProduct.map((chain,i) => {
      variants.push(...chain.variants.edges)
    })

    let optArray = []
    allProduct.map((chain,i) => {
      chain.options.map((item,index) => {
        optArray.push(chain.options[index])
      })
    })

    var output = [];
    optArray.forEach(function(item) {
      var existing = output.filter(function(v, i) {
        return v.name == item.name;
      });
      if (existing.length) {
        var existingIndex = output.indexOf(existing[0]);
        output[existingIndex].values = output[existingIndex].values.concat(item.values);
      } else {
        if (typeof item.values == 'string')
          item.values = [item.values];
        output.push(item);
      }
    });
    
    options = output.map((item,i) => {
        const uniq = item.values.reduce(function(a,b){
          if (a.indexOf(b) < 0 ) a.push(b)
          return a
        },[])
        return Object.assign({},item,{"values":uniq})
    })

    images.push(...productData.images.edges)
    chainProduct.map((img,i) => {
      images.push(...img.images.edges)
    })
    
    if(productQuantityData) {
      productQuantityData.map((item,i) => {
        if(item != undefined) {
        stock.push(...item.variants)
        }
      })
    }
    else {
      stock = null
    }
    
    stockUse = productQuantityData?productQuantityData[0].useStock:null;
  }
  else {
    stock = productQuantityData?productQuantityData[0].variants:null;
    variants = productData.variants.edges
    options = productData.options
    images = productData.images.edges
    stockUse = productQuantityData?productQuantityData[0].useStock:null;
  }

  /* size chart */
  const [sizeChart, setSizeChart] = useState("inch")
  const [sizeChartPop, setSizeChartPop] = useState(false)
  const [sku, setSku] = useState(productData.variants.edges[0].node.sku)
  const [firstopt, setFirstOpt] = useState(variants.filter(function(variant) {
    return variant.node.selectedOptions[0].value == options[0].values[0]
  }));
  const SelectedColor = firstopt[0].node.selectedOptions.find(clr => clr.name == "Color")
  const SelectedSize = firstopt[0].node.selectedOptions.find(clr => clr.name == "Size")
  const selectedHook = firstopt[0].node.selectedOptions.find(clr => clr.name == 'Hook Size')

  const [gallery, setGallery] = useState(images.filter(function(image) {
    if(image.node.altText) {
      if(image.node.altText.includes("size") && SelectedSize) {
        return image.node.altText.includes(`size-${SelectedSize.value}`) 
      }
      else if (image.node.altText.includes("in") && selectedHook ){
        return image.node.altText.includes(selectedHook.value ) 
      }
      else {
        return image.node.altText.includes(SelectedColor ? SelectedColor.value : '') 
      }
    }
  }));

  const [variantPrice, setVariantPrice] = useState(productData.variants.edges[0].node.price)
  const atcBtnStyle = isLoading ? `button--loading` : `button--loaded`
  const [mainImg, setMainImg] = useState(gallery[0] ? gallery[0] : images[0])
  const [pop, setPop] = useState(false)
  const [bis, setBis] = useState(false)
  const [error, setError] = useState({ email: { error: false, message: ''} })
  const compareAtPrice = productData.variants.edges[0].node.compareAtPrice

  const[mobile, setMobile] = useState(false) 
  const[breadcrumb, setBreadcrumb] = useState(null) 
  const router = useRouter()

  const _mountedModalSize = useRef(sizeChartPop);
  const _mountedModalSoldOut = useRef(pop);

  // Variant default options
  const selectedOptionsObj = options.reduce((prev,   curr, i) => {
    prev[curr.name] = curr.values[0]
    return prev
  }, {})
  const selectedVariant = variants.find((variant) => {
    return variant.node.selectedOptions.every((selectedOption) => {
      return selectedOptionsObj[selectedOption.name] === selectedOption.value;
    });
  })

  const [opt, setOpt] = useState({selectedVariant: selectedVariant,selectedOptions: selectedOptionsObj})
  const [inventory, setInventory] = useState(stock != null && stock != []?stock.quantity:20)
  const [timeout, setTimeout] = useState(0)

  useEffect(() => {

    updateInventory()
    if (typeof window !== 'undefined') {
      const w = window.innerWidth;
      if(w <= 768) {
        setMobile(true)
      }
    }

    const prevPath = sessionStorage.getItem("prevPath")
    if(prevPath && prevPath.includes("collection")){
    setBreadcrumb(sessionStorage.getItem("prevPath"))
    }
    else {
      setBreadcrumb(null)
    }

    let selectedVariantQuery = selectedVariant
    let selectedOptionsQuery = selectedOptionsObj
    if (router.isReady) {
      const { variant } = router.query
      if(variant) {
        selectedVariantQuery = variants.find((variantId) => {
          const varId = Buffer.from(variantId.node.id, 'base64').toString('binary').replace("gid://shopify/ProductVariant/","")
    
            return varId === variant
        })
        selectedOptionsQuery = opt.selectedOptions;
        selectedVariantQuery.node.selectedOptions.map(qOpt => selectedOptionsQuery[qOpt.name] = qOpt.value )
      }
    }
      
    const newFirstOpt = variants.filter(function(variant) {
      return variant.node.selectedOptions[0].value == selectedVariantQuery.node.selectedOptions[0].value
    })

    const newSelectedColor = selectedVariantQuery.node.selectedOptions.find(clr => clr.name == "Color")
    const newSelectedSize = selectedVariantQuery.node.selectedOptions.find(clr => clr.name == "Size")
    const newSelectedHook = selectedVariantQuery.node.selectedOptions.find(clr => clr.name == 'Hook Size')
    const newImg = images.filter(function(image) {
      if(image.node.altText) {
        if(image.node.altText.includes("size") && newSelectedSize) {
          return image.node.altText.includes(`size-${newSelectedSize.value}`) 
        }
        else if (image.node.altText.includes("in") && newSelectedHook ){
          return image.node.altText.includes(newSelectedHook.value ) 
        }
        else {
          return image.node.altText.includes(newSelectedColor ? newSelectedColor.value : '') 
        }
      }
    })

    const selectedVariantId = Buffer.from(selectedVariantQuery.node.id, 'base64').toString('binary').replace("gid://shopify/ProductVariant/", "")
    const newQuatity = productQuantityData ?
    productQuantityData[0].variants.find( variant => variant.id === Number(selectedVariantId))
    :null;

    setInventory(newQuatity != null && newQuatity != []?newQuatity.quantity:20)
    setVariantPrice(selectedVariantQuery.node.price)
    setSku(selectedVariantQuery.node.sku)
    setFirstOpt(newFirstOpt)
    setOpt({selectedVariant: selectedVariantQuery,selectedOptions: selectedOptionsQuery})
    setGallery(newImg[0] ? newImg : images)
    setMainImg(newImg[0] ? newImg[0] : images[0])

  },[router.asPath.split('?')[0], router.isReady, productQuantityData]);

  // Focus to element active modal
  useEffect(() => {
    if (modalSizeRef.current) {
      if (sizeChartPop) modalSizeRef.current.focus()
      else modalSizeRef.current.blur();
    }

    if (modalSoldOutRef.current) {
      if (pop) modalSoldOutRef.current.focus();
      else modalSoldOutRef.current.blur();
    }
  }, [modalSizeRef, sizeChartPop, modalSoldOutRef, pop])

  const getElementRef = targetRef => {
    if (!targetRef) return { lastFocusableElement: null, firstFocusableElement: null };

    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const firstFocusableElement = targetRef.current.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
    const focusableContent = targetRef.current.querySelectorAll(focusableElements);
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    return { lastFocusableElement, firstFocusableElement };
  }

  const handleEscModal = (e) => {
    const isTabPressed = e.key === 'Tab' || e.keyCode === 9;
    const isOpenModals = _mountedModalSize.current || _mountedModalSoldOut.current
    if (isTabPressed && isOpenModals) {
      const targetRef = _mountedModalSize.current ? modalSizeRef : (_mountedModalSoldOut && modalSoldOutRef);
      
      const { lastFocusableElement, firstFocusableElement } = getElementRef(targetRef);

      if (isTabPressed) {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus(); // add focus for the last focusable element
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) { // if focused has reached to last focusable element then focus first focusable element after pressing tab
            firstFocusableElement.focus(); // add focus for the first focusable element
            e.preventDefault();
          }
        }
      }
    }

    // close modal with btn escape
    if (e.keyCode === 27 && isOpenModals) {
      if (_mountedModalSize.current) {
        if (btnSizeChart.current) {
          btnSizeChart.current.focus();
        }
        
        return handleToggleModal();
      }
      if (_mountedModalSoldOut.current) {
        if (btnSoldOut.current) {
          btnSoldOut.current.focus();
        }

        return close();
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleEscModal);

    return () => document.addEventListener('keydown', handleEscModal);
  }, [sizeChartPop, pop])

  // VIP DISCOUNT
  function vipDiscountCal() {
    const vendor = productData.vendor
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

  const vipDiscountAmount = vipDiscountCal();

  function handleAddToCart() { 
    dl_add_to_cart(productData)
    const prevUrl = sessionStorage.getItem("prevPath")

      addToCart({
        productTitle: opt.selectedVariant.node.product.title,
        productHandle: opt.selectedVariant.node.product.handle,
        productImage: mainImg?mainImg.node:"",
        productId: opt.selectedVariant.node.product.id,
        variantId: opt.selectedVariant.node.id,
        variantPrice: opt.selectedVariant.node.price,
        variantTitle: opt.selectedVariant.node.title,
        compareAtPrice: opt.selectedVariant.node.compareAtPrice,
        variantQuantity: 1,
        previousUrl: prevUrl,
        brand:productData.vendor,
        category:productData.productType,
        sku:opt.selectedVariant.node.sku,
      })
  }

  function checkSecondOpt(value, i) {
    if (i == 1){
      let secondOpt = undefined
        if(firstopt[0].node.selectedOptions.length > 1 ) {
          secondOpt = firstopt.find((secopt) => {
            return secopt.node.selectedOptions[1].value === value;
          })
        }
      if (secondOpt == undefined) {
        return true
      }
    }
    if (i == 2){
      const selectedOptions = opt.selectedOptions;
      const valSecondOpt = Object.values(selectedOptions);
      let selectedVar
      let thirdondOpt = undefined
      if(firstopt[0].node.selectedOptions.length > 1 ) {
        selectedVar = firstopt.filter(function(hero) {
          return hero.node.selectedOptions[1].value == valSecondOpt[1];
        })
      } 
      if(firstopt[0].node.selectedOptions.length > 2 ) {
        thirdondOpt = selectedVar.find((secopt) => {
          return secopt.node.selectedOptions[2].value === value;
        })
      }
      
      if (thirdondOpt == undefined) {
        return true
      }
    }
  }

  function checkDisabled(value, i, length) {
    if(length < 3) {
      if (i == 1){
        let secondOpt = undefined
          if(firstopt[0].node.selectedOptions.length > 1 ) {
            secondOpt = firstopt.find((secopt) => {
              return secopt.node.selectedOptions[1].value === value;
            })
          }
        if (secondOpt == undefined) {
          return true
        }
        //if (secondOpt.node.availableForSale == false) {
        //  return true
        //}
        const globalVarId =  Buffer.from(secondOpt.node.id, 'base64').toString('binary')
        const varId = globalVarId.replace("gid://shopify/ProductVariant/", "")
        if (stock != null && stock != [] && stockUse == "useStock") {
          const varQuan = stock.find((quan) => {
            return quan.id == varId;
          })
          if(varQuan != undefined) {
            if (varQuan.inStock == false) {
              return true
            }
            if (varQuan.quantity == 0) {
              return true
            }
        }
        else {
          return true
        }
        }
      }
    }
    else {
      if (i == 2){
        const selectedOptions = opt.selectedOptions;
        const valSecondOpt = Object.values(selectedOptions);
        let secondOpt
        let thirdondOpt = undefined
        if(firstopt[0].node.selectedOptions.length > 1) {
          secondOpt = firstopt.filter(function(hero) {
            return hero.node.selectedOptions[1].value == valSecondOpt[1];
          })
        }
        if(firstopt[0].node.selectedOptions.length > 2) {
          thirdondOpt = secondOpt.find((secopt) => {
            return secopt.node.selectedOptions[2].value === value;
          })
        }
        if (thirdondOpt == undefined) {
          return true
        }
        //if (secondOpt.node.availableForSale == false) {
        //  return true
        //}
        const globalVarId =  Buffer.from(thirdondOpt.node.id, 'base64').toString('binary')
        const varId = globalVarId.replace("gid://shopify/ProductVariant/", "")
        if (stock != null && stock != [] && stockUse == "useStock") {
          const varQuan = stock.find((quan) => {
            return quan.id == varId;
          })
          if(varQuan != undefined) {
            if (varQuan.inStock == false) {
              return true
            }
            if (varQuan.quantity == 0) {
              return true
            }
        }
        else {
          return true
        }
        }
      }
    }
  }

  function updateInventory() {
    if(stock != undefined && stock != null) {
      if( timeout === 0 ) {
        if(stockUse == "useStock") {
          setInventory(stock[0].quantity)
        }
        else {
          setInventory(20)
        }
      }
      setTimeout(1)
    }
  }
  
  function handleVariantChange(e,i) {
    
    const target = e.target
    const selectedOptions = opt.selectedOptions;
    const selectedVariants = opt.selectedVariant
    selectedOptions[target.name] = target.value

    if ( i == 0) {
      const selectedVar = variants.filter(function(hero) {
        return hero.node.selectedOptions[0].value == target.value;
    ``})
      let status = selectedVar
      selectedVar[0].node.selectedOptions.map(function(item, i) {
        if (i >= 1) {
          status = status.filter(OtherOpt => OtherOpt.node.selectedOptions[i].value === selectedVariants.node.selectedOptions[i].value)
          if(status.length == 0) {
            selectedOptions[item.name] = item.value
          }
        }
      })
      setFirstOpt (selectedVar)
    }
    if ( i == 1) {
      const selectedVar = firstopt.filter(function(hero) {
        return hero.node.selectedOptions[1].value == target.value;
    ``})
      let status = selectedVar
      selectedVar[0].node.selectedOptions.map(function(item, idx) {
      if (idx >= 2) {
        status = status.filter(OtherOpt => OtherOpt.node.selectedOptions[idx].value === selectedVariants.node.selectedOptions[idx].value)
          if(status.length == 0) {
            selectedOptions[item.name] = item.value
          }
        }
      })
    }

    // IMG change
    const GalleryImg = images.filter(function(image) {
      if(image.node.altText) {
        if(image.node.altText.includes("size") && SelectedSize) {
          return image.node.altText.includes(selectedOptions.Size) 
        }
        else if (image.node.altText.includes("in") && selectedHook){
          return image.node.altText.includes(selectedOptions[ 'Hook Size' ] ) 
        }
        else {
          return image.node.altText.includes(selectedOptions.Color) 
        }
      }
    })
    
    setGallery ( GalleryImg.length < 1? images : GalleryImg ) 
    setMainImg ( GalleryImg.length < 1? images[0] : GalleryImg[0] ) 

    const selectedVariant = variants.find((variant) => {
      return variant.node.selectedOptions.every((selectedOption) => {
        return selectedOptions[selectedOption.name] === selectedOption.value;
      });
    })
    
    setOpt({
      selectedVariant: selectedVariant,
      selectedOptions: selectedOptions  
    })
    
    //check low stock
    const selectedVariantId = Buffer.from(selectedVariant.node.id, 'base64').toString('binary').replace("gid://shopify/ProductVariant/", "")
    const slectedQuantity = stock.find((stok) => {
      return stok.id == selectedVariantId;
    })

    if(productQuantityData){
      if(stockUse === "useStock") {
        setInventory(slectedQuantity.quantity)
      }
      else {
        setInventory(100)
      }
    }
    setSku(selectedVariant.node.sku)
    setVariantPrice(selectedVariant.node.price)

    const varId = Buffer.from(selectedVariant.node.id, 'base64').toString('binary').replace("gid://shopify/ProductVariant/","")
    //router.push(`${router.asPath.split('?')[0]}?variant=test`, undefined, { shallow: true })
    const url = window.location.href;       
    const urlSplit = url.split( "?" );       
    const obj = { Title : "New title", Url: urlSplit[0] + `?variant=${varId}`};       
    history.pushState(obj, obj.Title, obj.Url);
  }

  function getVariantImage(value, i) {
    const VariantImg = images.filter(function(image) {
      if(image.node.altText && image.node.altText != null) {
        return image.node.altText.includes(value)
      } 
    })
    return VariantImg[0] || images[0]
  }

  /* OUT OF STOCK FUNCION */
  const listOutOfStock = variants.filter(data => data.node.quantityAvailable < 1)

  function backInStock() {
    const varId = opt.selectedVariant.node.id
    _mountedModalSoldOut.current = true; // for persist data flag modal to event listener
    setPop(true)
  }

  function close() {
    _mountedModalSoldOut.current = false; // for persist data flag modal to event listener
    setPop(false)
    setBis(false)
  }

  async function requestBackInStock(e) {
    e.preventDefault()
    const email = e?.target?.email?.value;
    if (!email) {
      setError({ ...error, email: { error: true, message: 'Email is required' }});

      return;
    }

    if (error && email) setError({
      ...error,
      email: { error: false, message: '' }
    });

    const callBack = await backInStockKlavio(e)
    if (callBack.status.success ) {
      setBis("success")
    }
    else {
      setBis("error")
    }
  }

  /* Title and description for chain product */
  function dynamicText() {
    let slectedText
    if (chainProduct) {
      const selectedProd = opt.selectedVariant?opt.selectedVariant.node.product.id:productData.id
      slectedText = allProduct.find((secopt) => {
        return secopt.id === selectedProd;
      })
    }
    else {
      slectedText = productData
    }
    
    return slectedText
  }

  /* 2 day shipping calculation */

  function dateCal() {
    const today = new Date()
    const convertDate = today.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
    const shopifyDate = new Date(convertDate)
    const todayDate = shopifyDate.toISOString().slice(0,10)
    const dataResult = ['2022-11-11', '2022-11-26-', '2022-12-25-', '2023-01-01', '2022-05-23', '2022-07-05', '2022-08-26']

    const publicHolidays = {
      usa:dataResult
    }

    Date.prototype.isPublicHoliday = function( data ){
      if(!data) return 1;
      return data.indexOf(this.toISOString().slice(0,10))>-1? 0:1;
    }

    // calculation of business days
    Date.prototype.businessDays = function( d, holidays ){
      var holidays = holidays || false, t = new Date( this );
      while( d ){
        t.setDate( t.getDate() + 1 );
        switch( t.getDay() ){
          case 0: case 6: break;
          default:
            d -= t.isPublicHoliday( holidays );
        }

      }
      return t.toISOString().slice(0,10);
    }

    let hour=0;
    const currentime = shopifyDate.getHours();
    if ( currentime >= 11 ) {
      hour = 1;
    }

    const deliveryDate = new Date(todayDate).businessDays(3, publicHolidays.usa)
    const todayShipping = new Date(deliveryDate)
    const dateShipping = todayShipping.getDate() + hour;
    const monthSipping = todayShipping.getMonth() + 1;
    const arrived = `${monthSipping}/${dateShipping}`
    return(arrived)
  }

  const handleToggleModal = () => {
    _mountedModalSize.current = !sizeChartPop
    setSizeChartPop(!sizeChartPop);
  }
  const handleChangeTab = useCallback(
    (e) => setSizeChart(e.currentTarget.id),
    [sizeChart]
  );

  const [badgeContent, setBadgeContent] = useState(null)
  const handleToggleModalBadge = (content) => {
    setBadgeContent(content);
  }

  // WUNDERKIND
  useEffect(() => {
    if(cart) {
      const getEmail = cookieCutter.get('_cdnc')
      const Email = getEmail && getEmail != "null" ? JSON.parse(getEmail).email : null
      const prod_id = Buffer.from(opt.selectedVariant.node.product.id, 'base64').toString('binary').replace("gid://shopify/Product/", "")
      const variant_id = Buffer.from(opt.selectedVariant.node.id, 'base64').toString('binary').replace("gid://shopify/ProductVariant/", "")
      if(typeof window !== 'undefined') {
        window.wunderkind = {
          group_item_id: prod_id, 
          variant_item_id: variant_id, 
          product_name: productData.title, 
          url: router.asPath,
          imageurl: productData.images.edges[0].node.originalSrc, 
          price: productData.variants.edges[0].node.price,
          in_stock: "yes",
          item_category: productData.collections.edges[0].node.handle.replace("-", " "),
          email: Email,
          cart_qty: getTotalCartQuantity(cart),
          cart_value: getCartSubTotal(cart),
          email_submit: ""
        }
      }
    }
  }, [cart, opt]);

  return (
  <div className="product--detail--wrap">
    <div className="breadcrumb mt-30">
      <Link href="/">
        <a>Home</a>
      </Link>
      { breadcrumb ?
        <Link href={breadcrumb}>
          <a> / {breadcrumb.substring(breadcrumb.lastIndexOf('/') + 1).replace(/-/g, ' ')}</a>
        </Link>
      :
      <Link href={`/collections/${productData.collections.edges[0].node.handle}`}>
          <a> / {productData.collections.edges[0].node.handle.replace(/-/g, ' ')}</a>
        </Link>
      }
    </div>
    <div className="mobile pt-30" id="mobileproddetail">
      <ProductInfo 
        sku={sku} 
        title={productData.title} 
        price={variantPrice} 
        compareAtPrice={compareAtPrice} 
        vip={vipDiscountAmount}
        reviewRate={reviews.rating} 
        reviewUser={reviews.total} 
        layout="mobile"
      />
    </div>
    <div className="flex block--mobile block--tablet"> 
      <ProductImage gallery={gallery} mainImg={mainImg} title={productData.title}/>
      <div className="product--detail two-five full--mobile full--tablet">
        {dynamicText()?
        <div className="desktop">
          <ProductInfo 
            sku={sku} 
            title={dynamicText().title} 
            price={variantPrice} 
            compareAtPrice={compareAtPrice} 
            vip={vipDiscountAmount} 
            reviewRate={reviews.rating} 
            reviewUser={reviews.total} 
          />
        </div>
        :""}
        <div className="full product--detail--wrap">
          {options[0].values[0] != "Default Title" && 
          <div className={`product--options--wrap ${gaff?"gaff":""}`}>
              {options.map((option, i) => {
                return(
                  <div className={`options ${option.name}`} key={`${option.name}-${i}`}>
                    {option.name == "Size"?
                      <div className="size--chart flex">
                        {sizeChartContent && <button ref={btnSizeChart} onClick={handleToggleModal}>Size Chart</button> }
                        <button ref={btnSoldOut} onClick={backInStock}>Sold Out?</button>
                      </div>
                    :""}
                    <span className="option--name">{option.name}: { opt.selectedOptions[option.name] ? opt.selectedOptions[option.name] : "Select a "+ option.name}</span>
                    { option.values.map((value, index) => {
                      const source = getVariantImage(value, option.name);

                      return (
                        <label 
                          key={`${value}-${index}`} 
                          className={classNames(
                            "opt--lable", 
                            checkDisabled(value, i, options.length)?'not-available':'available', 
                            checkSecondOpt(value, i)?'hide':'radio--opt', 
                            value == opt.selectedOptions[option.name] ? "selected":"" )
                          }
                        >
                          <fieldset style={{ border: 'unset' }}>
                            <input 
                              type="radio"
                              key={`${option.name}-${i}-${value}`} 
                              id={`${option.name}-${i}`} 
                              name={option.name} 
                              value={value} 
                              onChange={(e) => handleVariantChange(e,i)} 
                              className={checkDisabled(value, i, options.length)?'not-available':'available'}
                              checked={value == opt.selectedOptions[option.name] ?"checked":""}
                            />
                            <legend>
                              <div className={option.name== "Color"? "variant variant--image": "variant variant--size"} >
                                {option.name == "Color"? (
                                  <Image
                                    src={source ? source.node.originalSrc : "/icons/logo.png"}
                                    alt={source ? `color ${source.node.altText}` : "aftco"}
                                    width={50}
                                    height={50}
                                    layout="responsive"
                                    placeholder="blur"
                                    blurDataURL={blurlogo}
                                  />
                                ) : value}
                              </div>
                              <div className="sold">
                                <Image
                                  src={"/icons/soldout.png"}
                                  alt={"aftco"}
                                  objectFit="fill"
                                  layout="fill"
                                />
                              </div>
                            </legend>
                          </fieldset>
                        </label>
                      )
                    })}
                  </div>
                )
              })}
          </div>
          }
          
          { !findADealer ?
            <>
            <p className="mb-20">Order with 2-Day Air to receive by <span>{dateCal()}</span>.</p>
            {inventory <= 10 && inventory >= 1 ?
              <div className="notif--low--stock"><span className="low--stock">LOW STOCK</span><b><em>HURRY,</em></b> there's only <b>{inventory}</b> left - order soon!</div>
            :""}
              { inventory >= 1 ? 
                  <button 
                    data-inven={inventory} 
                    className={classNames("button add--to--cart Rise-add-to-cart-button", atcBtnStyle)} 
                    aria-label="cart-button" 
                    onClick={handleAddToCart}
                  >
                    Add To Cart
                  </button> 
                : 
                  <button data-inven={inventory} className={classNames("button notif", atcBtnStyle)} onClick={backInStock}>
                    Notify Me When Restocked
                  </button> 
              }
              </>
            :
            <Link href="/pages/store-locator"><a className="button notif light blue">Find a Dealer</a></Link>
          }
        </div>
        <div className="bedge flex mt-30">
        {richTextBasicData.pdpBadge.map(badge =>
          badge.fields.customUrl ?
            <Link href={badge.fields.customUrl}><a>
              <div className="ico--wrap">
              <div className="ico--list" dangerouslySetInnerHTML={ {__html: badge.fields.svgIcon} } />
                <span>{badge.fields.title}</span>
              </div>
            </a></Link>
          :
            <button alt={`Showing ${badge.fields.title} Descriptions`} href="#" onClick={() => handleToggleModalBadge(badge.fields.popUpContent.content)}>
              <div className="ico--wrap">
                <div className="ico--list" dangerouslySetInnerHTML={ {__html: badge.fields.svgIcon} } />
                <span>{badge.fields.title}</span>
              </div>
            </button>
        )}
        </div>
      </div>
      {badgeContent && 
        <div
          aria-labelledby="badge"
          role="dialog"
          aria-modal="true"
          className="badge--popup size--chart--pop"
          ref={modalSoldOutRef}>
            <div className="chart--pop--content">
              <button className="close" onClick={() => handleToggleModalBadge(null)} aria-label="Close">
                <Close/>
              </button>
              <div className='table--content'>
                {badgeContent && <RichText content={badgeContent} />}
              </div>
            </div>
        </div>
      }
      {/* Modal Sold Out */}
      <div
        id="modalSoldOut"
        tabIndex="-1"
        aria-labelledby="sold-out"
        role="dialog"
        aria-modal="true"
        className={classNames("lity klaviyo--pop--out-of-stock", {"lity-opened":pop})}
        ref={modalSoldOutRef}>
        <div aria-modal="true" role="dialog" className="pop--wrap lity-wrap">
          <div className="pop--content lity-container">
            <div className="lity-content">
              <h2 id="sold-out">{productData.title}</h2>
              <p>Receive a notification when this item is back in stock.</p>
              <form onSubmit={(event) => requestBackInStock(event)} className={classNames(bis?"hide":"show")}>
                <label className="label-form" for="varid">Product Size and Color</label>
                <select name="varid" id="varid" defaultValue={opt.selectedVariant.node.id}>
                  {
                    listOutOfStock.map( (option, i) => {
                      return (
                        <option aria-label={option.node.title || option.node.id} key={option.node.id} value={option.node.id} >{option.node.title}</option>
                      )
                    })
                  }
                </select>

                <label className="label-form email" for="email" aria-label="email">Email</label>
                <input aria-describedby='email' className={classNames({ 'is-error': error?.email?.error })} type="email" name="email" id="email" autoComplete='email'/>
                {error?.email?.error && <span id='email' className="error-message">{error?.email?.message || ''}</span>}

                <label className="signup"><input type="checkbox" value="signup" /> Sign me up to receive news & offers.</label>
                <input type="submit" name="signup" id="signup"value="Notify Me" className="button" /> 
              </form>
              <div className={classNames(bis?"show":"hide", bis == "success"?"sent-request":"",bis == "error"?"error-sent-request":"")}>
                <div className="success"><h5 onClick={(e) => close(e)}>We'll let you know when it's back! Close</h5></div>
                <div className="error"><h5 onClick={(e) => close(e)}>Error PLease try again later!</h5></div>
              </div>
            </div>
            <button className="lity-close navigable" type="button" aria-label="Close (Press escape to close)" onClick={(e) => close(e)} >
              {/* × */}
              <Close/>
            </button> 
          </div>
        </div>
      </div>
    </div>
    <div id="productpage-nosto-32" className="nosto_element nosto-dynamic-placement"></div>
    {relatedProduct && 
        <RelatedProduct 
          product={relatedProduct? relatedProduct[2].primary : ""} 
          star 
          title="Frequently Bought With" 
          slider={mobile} 
          sliderSet={2} 
          gridSet={4} 
          vColor={richTextBasicData.basicProdData.vColor}
          badge={richTextBasicData.basicProdData.badge}
        />
      }
      
      {dynamicText()?
        <ProductDescriptions 
          description={dynamicText().descriptionHtml} 
          tags={dynamicText().tags} 
          productData={productData} 
          slider={slider} 
          richTextBasicData={richTextBasicData}
        />
      :""}

      {/* Modal Size Chart */}
      {sizeChartContent && sizeChartPop?
      <div
        id="modalSizeChart"
        className="size--chart--pop"
        aria-labelledby="size-chart"
        tabIndex="-1"
        ref={modalSizeRef}
        role="dialog"
        aria-modal="true">
        <div className="close-cover" onClick={handleToggleModal}></div>
        <div className="chart--pop--content">
          <button className="close" onClick={handleToggleModal} aria-label="Close">
            <Close/>
          </button>
          <div className="table--content" dangerouslySetInnerHTML={ {__html: sizeChartContent.sizeChartContent} }/>
        </div>
      </div>
      :""}
  </div>
  )
}

export default ProductDetails
