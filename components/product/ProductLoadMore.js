import ProductCard from '@/components/product/ProductCard'
import ProductAdsCard from '@/components/product/ProductAdsCard'
import { useState, useEffect } from 'react'
import classNames from 'classnames'
import { ArrowDown, Close } from '@/components/icons'
import { useRouter } from 'next/router'
import Image from 'next/image'
import FilterIco from '@/img/icons/filter.png'
import VisibilitySensor from 'react-visibility-sensor'
import Filters from './filters';

function ProductListings({ products, productsBestSeller, contenfulData, reviews, searchProduct, title, style, ads, bestSeller }) {

  const DefaultProd = products.filter(prod => contenfulData.chainList.every(param => param.fields.subProducts.some(data => prod.node.id != data)))
  const BestProd = productsBestSeller.filter(prod => contenfulData.chainList.every(param => param.fields.subProducts.some(data => prod.node.id != data)))
  const pordList = bestSeller ? BestProd : DefaultProd
  const [sortProd, setSortProd] = useState(pordList);
  const [prod, setProd] = useState(pordList);
  const [stateSearch, setStateSearch] = useState(searchProduct);
  const vColor = contenfulData.vColor
  const filters = contenfulData.filter[0].fields

  let screenWidth
  if ( typeof window !== 'undefined' ) {
    screenWidth = window.innerWidth;
  }

  const [list, setList] = useState("nothing")
  const [mobFilter, setMobFilter] = useState(false)

  let clr = [] 
  DefaultProd.map((item) => (item.node.tags? item.node.tags.map((tag) => clr.push(tag)): ""))
  const jsonObject = clr.map(JSON.stringify);
  const uniqueSet = new Set(jsonObject);
  const uniqueTag = Array.from(uniqueSet).map(JSON.parse);

  const [filterSize, setFilterSize] = useState(uniqueTag.filter(str => str.includes("filter::size")));
  const [filterColor, setFilterColor] = useState(uniqueTag.filter(str => str.includes("filter::color")));
  const [filterType, setFilterType] = useState(uniqueTag.filter(str => str.includes("filter::type")));
  

  const defaultSize = uniqueTag.filter(str => str.includes("filter::size"))
  const defaultColor = uniqueTag.filter(str => str.includes("filter::color"))
  const defaultType = uniqueTag.filter(str => str.includes("filter::type"))

  let sizeAr = []
  let colorAr = []
  let typeAr = []
  function getPos(name,data) {
    let sizeInd
    if(name == "size") {
      const sz = data.replace('filter::size:','')
       sizeInd = filters.size?filters.size.indexOf(sz):9999
    }
    if(name == "color") {
      const sz = data.replace('filter::color:','')
      sizeInd = filters.color?filters.color.indexOf(sz):9999
    }
    if(name == "type") {
      const sz = data.replace('filter::type:','')
     sizeInd = filters.type?filters.type.indexOf(sz):9999
    }
    if (sizeInd != -1) {
      return(sizeInd)
    }
    else {
      return(9999)
    }
  }

  function compare( a, b ) {
    if ( a.position < b.position ){
      return -1;
    }
    if ( a.position > b.position ){
      return 1;
    }
    return 0;
  }

  defaultSize.map((size) => (sizeAr.push({"title":size,"position":getPos("size",size)})))
  defaultColor.map((color) => (colorAr.push({"title":color,"position":getPos("color",color)})))
  defaultType.map((type) => (typeAr.push({"title":type,"position":getPos("type",type)})))
  
  sizeAr.sort( compare )
  colorAr.sort( compare )
  typeAr.sort( compare )

  const [params, setParams] = useState([])

  const router = useRouter()

  useEffect(() => {
      setProd(pordList)
      setSortProd(pordList)
      setParams([])
      setLoadMore(true)
      setProdToShow(pordList.slice(0, 20))
      setFilterSize(uniqueTag.filter(str => str.includes("filter::size")))
      setFilterColor(uniqueTag.filter(str => str.includes("filter::color")))
      setFilterType(uniqueTag.filter(str => str.includes("filter::type")))
      document.getElementById("sort").value = bestSeller ? "bestSeller" : "featured"

    if(screenWidth <= 760) {
      setList('size color type')
    }

  },[router.asPath]);

  useEffect(() => {
    setProd(pordList)
    setStateSearch(searchProduct)
  },[searchProduct]);

  function filter({ e }, data) {
    let tag 
    if (data) {
      tag = data
    }
    else {
      tag = e.target.value
    }
    
    let filters = params
    const pos = filters.indexOf(tag);
    if(tag != "clearall"){
     if (pos > -1) {
      filters.splice(pos,1)
     }
     else {
      filters.push(tag)
     }
    }
    else {
      filters = []
    }

     setParams(filters)

     let filterResult
     if (filters.length != 0) {
      filterResult = sortProd.filter(prod => filters.every(param => prod.node.tags.some( tag => tag.includes(param))))
      setProd(filterResult)
      }
      else {
        setProd(sortProd)
        filterResult = sortProd
      }
    
    let tagsList = []
    filterResult.map((item) => (item.node.tags? item.node.tags.map((tag) => tagsList.push(tag)): ""))
    const tagObj = tagsList.map(JSON.stringify);
    const newTag = new Set(tagObj);
    const uniqueTags = Array.from(newTag).map(JSON.parse);
    
    setFilterSize(uniqueTags.filter(str => str.includes("filter::size")))
    setFilterColor(uniqueTags.filter(str => str.includes("filter::color")))
    setFilterType(uniqueTags.filter(str => str.includes("filter::type")))
    setNextReview(20)
    loopWithSlice(0,20, filterResult)
  }

  function showList(data) {
    if(screenWidth >= 760) {
      if ( data == list) {
        setList("nothing")
      }
      else {
        setList(data)
      }
    }
  }

  function checkColor(value, i) {
    const colorHex = vColor.find((secopt) => {
      return secopt.color === value;
    })
    if(colorHex){
      if(colorHex.hex != null){
        return (
          <div className="opt--wraper">
            <div className={classNames("with--bgColor", value)} style={{backgroundColor:colorHex.hex}}></div>
          </div>
          )
      }
      else {
        return (
          <div className="opt--wraper">
            <div className="with--bgImg" style={{backgroundImage:`url(${colorHex.image.fields.file.url})`}}></div>
          </div>
          )
      }
    }
  }

  /* load More Product function */
  const postsPerPage = 20;
  const [prodToShow, setProdToShow] = useState(prod.slice(0, 20));
  const [nextReview, setNextReview] = useState(20);
  const [loadMore, setLoadMore] = useState(true);
  const loopWithSlice = (start, end, data) => {
    const slicedReview = data.slice(0, end);
    setProdToShow([...slicedReview]);
  };
  function handleShowMorePosts(isVisible){
    if ( isVisible && prodToShow < prod) {
      loopWithSlice(nextReview, nextReview + postsPerPage, prod);
      setNextReview(nextReview + postsPerPage);
    }
    if(prodToShow >= prod) {
      setLoadMore(false)
    }
    else {
      setLoadMore(true)
    }
  };

  /* SORT FUNCTION */
  function priceLow( a, b ) {
    const start = parseInt(a.node.priceRange.minVariantPrice.amount, 10)
    const end = parseInt(b.node.priceRange.minVariantPrice.amount, 10)
    if ( start < end ){
      return -1;
    }
    if ( start > end ){
      return 1;
    }
    return 0;
  }

  function priceHigh( a, b ) {
    const start = parseInt(a.node.priceRange.minVariantPrice.amount, 10)
    const end = parseInt(b.node.priceRange.minVariantPrice.amount, 10)
    if ( start < end ){
      return 1;
    }
    if ( start > end ){
      return -1;
    }
    return 0;
  } 

  function date( a, b ) {
    if ( a.node.createdAt < b.node.createdAt ){
      return 1;
    }
    if ( a.node.createdAt > b.node.createdAt ){
      return -1;
    }
    return 0;
  }
  function sort(e) {
    const param = e.target.value
    let defaultData = DefaultProd
    if (param == "newest") {
      defaultData.sort( date )
    }
    else if (param == "bestSeller") {
      defaultData = BestProd
    }
    else if (param == "priceLow") {
      defaultData.sort( priceLow )
    }
    else if (param == "priceHigh") {
      defaultData.sort( priceHigh )
    }
    else {
      defaultData = DefaultProd
    }

    if (params.length != 0) {
      const filterResult = defaultData.filter(prod => params.every(param => prod.node.tags.some( tag => tag.includes(param))))
      setProd(filterResult)
      setSortProd(defaultData)
      setProdToShow(filterResult.slice(0, 20))
      setLoadMore(true)
    }
    else {
      setProd(defaultData)
      setSortProd(defaultData)
      setProdToShow(defaultData.slice(0, 20))
      setLoadMore(true)
    }
    
  }
  if(ads != undefined){
    const adsLength = prodToShow.length / (ads.length + 20) 
        for (let i = 0; i < adsLength; i++) {
          ads.map(ad => 
            {
              //const posss = (i * 20) + (ad.fields.position - 1)
              const posss = ad.fields.position - 1
              if(!prodToShow?.[posss]?.sys) {
                if(prodToShow.length > posss) {
                  prodToShow.splice(posss, 0, ad);
                }
        }})
        }
  }
  return (
    <div className="container">
      <div className="collection--wrap">
        {style == "no--filter"?"":
          <div className="filter wrap flex">
              <div className="fillter--button button light flex" onClick={(e) =>  setMobFilter(prevMobFilter => !prevMobFilter)} >
                <h2 className="mobile--filter h5">Filter</h2>
                <div className="filter--ico">
                  <Image
                      src={FilterIco}
                      alt={"aftco"}
                      width={16}
                      height={16}
                      layout="responsive"
                    />
                  </div>
              </div>
            <div className={classNames("product--filter", {"mobFilter": mobFilter})} >
              <h2 className="desktop h5" >Filter</h2>
              <div className="close--filter" onClick={() =>  setMobFilter(prevMobFilter => !prevMobFilter)}>
                <button className="close" aria-label="close"><Close/></button>
                <h3 className="mobile">Filter</h3>
              </div>
              <Filters
                section="size"
                title={"Size"}
                isActive={list.includes("size")}
                onClick={(section) => showList(section)}
                options={sizeAr}
                Item={({ title, i }) => { 
                  const label = title.replace(`filter::size:`,'').toLowerCase().replace(/\b(\w)/g, x => x.toUpperCase())
  
                  return ( 
                    filterSize.includes(title)?
                    <label key={i} className={params.includes(title)?"selected":""}>
                      <input type="checkbox" name="filter--type" value={title} onChange={(e) => filter({e})} /> 
                      <legend className="option--size">{label}</legend>
                    </label> :""
                  )
                }}
              />
              <Filters
                section="color"
                title={"Color"}
                isActive={list.includes("color")}
                onClick={(section) => showList(section)}
                options={colorAr}
                Item={({ title, i }) => {
                  const Color = checkColor(title.replace('filter::color:',''), i)
                  return ( 
                    filterColor.includes(title)?
                      <label key={i} className={classNames(params.includes(title)?"selected":"", title.replace('filter::color:','') == ""?"hide":"")} >
                        <input type="checkbox" name="filter--color" value={title} onChange={(e) => filter({e})} />
                        {Color}
                        <legend>{title.replace('filter::color:','')}</legend>
                      </label> :""
                  )
                }}
              />
              <div className={classNames("filter-- filter--type", list.includes("type") ?"active":"")}>
                <div
                  aria-controls="type-dropdown"
                  aria-expanded={list.includes("type") ? "true" : "false"}
                  className="filter--dropdown"
                  onClick={(e) => showList("type")}>
                  <h5>Type</h5>
                  <ArrowDown />
                </div>
                <div id="type-dropdown" className={classNames("filter--content", list.includes("type") ?"active":"")}>
                  <button aria-label="close" className="close" onClick={(e) => showList("type")}><Close/></button>
                  <fieldset className="filter--list ">
                    {typeAr.map((type, i) => ( 
                      filterType.includes(type.title)?
                      <label key={i} className={params.includes(type.title)?"selected":""}>
                        <input type="checkbox" name="filter--type" value={type.title} onChange={(e) => filter({e})} /> 
                        <legend>{type.title.replace('filter::type:','').toLowerCase().replace(/\b(\w)/g, x => x.toUpperCase())}</legend>
                      </label> :""
                    ))}
                  </fieldset>
                </div>
              </div>
              <div className="filter-- filter--type mobile--filter flex">
                <div className="clear--filter mobile button light" onClick={(e) => filter({e}, "clearall")}>Clear ({params.length})</div>
                <div className="clear--filter mobile button" onClick={() =>  setMobFilter(prevMobFilter => !prevMobFilter)}>Apply</div>
              </div>
            </div>
            <div className="sort">
              <select aria-label='sort' name="sort" id="sort" onChange={(e) =>  sort(e)}>
                <option value="">- Sort By -</option>
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="bestSeller">Best Seller</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
              </select>
            </div>
          </div>
        }
        { params != '' ?
          <div className="selected--filter">
            <div className="selected--item item--size">
              {params.map(param => (
                  !!param.includes("size") && (
                    <div className="item--detail" onClick={(e) => filter({e}, param)}>
                      {param.replace('filter::size:','Size: ')}
                      <button aria-label="remove" ><Close /></button>
                    </div>
                  )
              ))}
              {params.map(param => (
                  !!param.includes("color") && (
                    <div className="item--detail" onClick={(e) => filter({e}, param)}>
                      {param.replace('filter::color:','Color: ')}
                      <button aria-label="remove"><Close /></button>
                    </div>
                  )
              ))}
              {params.map(param => (
                  !!param.includes("type") && (
                    <div className="item--detail" onClick={(e) => filter({e}, param)}>
                      {param.replace('filter::type:','Type: ').toLowerCase().replace(/\b(\w)/g, x => x.toUpperCase())}
                      <button aria-label="remove"><Close /></button>
                    </div>
                  )
              ))}
            </div>
            <button
              aria-label="Clear All"
              className="clear--filter"
              onClick={(e) => filter({e}, "clearall")}>
              Clear All
            </button>
          </div>
          :""
        }
        <h3 className="heading sub-collection--title tf-cp">{title}</h3>
          <ul className="product--listing grid">
          {prodToShow.map((product, index) => (
              product.cursor?
                <ProductCard key={index} pos={index} allProd={products} contenfulData={contenfulData} product={product} vColor={vColor} reviews={reviews} />
              :
                <ProductAdsCard key={index} product={product} />
            ))}
          </ul>
      </div>
        <VisibilitySensor onChange={handleShowMorePosts} offset={{top:100}}>
        <div id="loadmore">
          {loadMore?
              <Image
                  src={"/icons/loading.gif"}
                  alt={"aftco"}
                  width={64}
                  height={64}
                  layout="responsive"
              />
          :""}
        </div>
        </VisibilitySensor>
    </div>
  )
}

export default ProductListings
