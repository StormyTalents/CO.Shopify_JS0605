import ProductCard from '@/components/product/ProductCard'
import { useState, useEffect } from 'react'
import classNames from 'classnames'
import { ArrowDown, FilterIco } from '@/components/icons'
import { useRouter } from 'next/router'
import { Close } from '@/components/icons'
import Image from 'next/image'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";

function ProductListings({ products, contenfulData, reviews, searchProduct, title, style, slider, sliderSet }) {

  const [prod, setProd] = useState(products);
  const [stateSearch, setStateSearch] = useState(searchProduct);
  const vColor = contenfulData.vColor
  const filters = contenfulData.filter[0].fields

  let screenWidth
  if ( typeof window !== 'undefined' ) {
    screenWidth = window.innerWidth;
  }

  const [page, setPage] = useState(1);
  const [list, setList] = useState("nothing")
  const [mobFilter, setMobFilter] = useState(false)

  let clr = [] 
  products.map((item) => (item.node.tags? item.node.tags.map((tag) => clr.push(tag)): ""))
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
  const [paramsPos, setParamsPos] = useState([])

  const router = useRouter()

  useEffect(() => {
    setProd(DefaultProd)
    setSortProd(DefaultProd)
    setParams([])
    setLoadMore(true)
    setProdToShow(DefaultProd.slice(0, 20))
    setFilterSize(uniqueTag.filter(str => str.includes("filter::size")))
    setFilterColor(uniqueTag.filter(str => str.includes("filter::color")))
    setFilterType(uniqueTag.filter(str => str.includes("filter::type")))
    document.getElementById("sort").value = "featured"

  if(screenWidth <= 760) {
    setList('size color type')
  }

},[router.asPath]);

useEffect(() => {
  setProd(DefaultProd)
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
     setParamsPos("change")

     let filterResult
     if (filters.length != 0) {
      filterResult = products.filter(prod => filters.every(param => prod.node.tags.some( tag => tag.includes(param))))
      setProd(filterResult)
    }
    else {
      setProd(products)
      filterResult = products
    }
    
    let tagsList = []
    filterResult.map((item) => (item.node.tags? item.node.tags.map((tag) => tagsList.push(tag)): ""))
    const tagObj = tagsList.map(JSON.stringify);
    const newTag = new Set(tagObj);
    const uniqueTags = Array.from(newTag).map(JSON.parse);
    setFilterSize(uniqueTags.filter(str => str.includes("filter::size")))
    setFilterColor(uniqueTags.filter(str => str.includes("filter::color")))
    setFilterType(uniqueTags.filter(str => str.includes("filter::type")))
    
  }

  const itemsPerPage = 20;
  const totalPages = Math.ceil((prod.length - 1) / itemsPerPage)
  
  function displayData() {
    const start = (page - 1) * itemsPerPage;
    return prod.slice(start, start + itemsPerPage);
  }
  function range(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
  }
  const result = range(1, totalPages); 

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

  var settings = {
    dots: false,
    infinite: true,
    swipeToSlide: true,
    slidesToShow: sliderSet?sliderSet:3,
    slidesToScroll: 1,
    cssEase: 'linear',
    speed: 250,
  };

  return (
    <div className="container">
      <div className="collection--wrap">
        {style == "no--filter"?"":
          <div className="filter wrap">
              <div className="fillter--button button light flex" onClick={(e) =>  setMobFilter(prevMobFilter => !prevMobFilter)} >
                <h5 className="mobile--filter">Filter</h5>
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
              <h5 className="desktop" >Filter</h5>
              <div className="close--filter" onClick={(e) =>  setMobFilter(prevMobFilter => !prevMobFilter)}>
                <div className="close"><Close/></div>
                <h3 className="mobile">Filter</h3>
              </div>
              {/* Dropdown Filters */}
              <div className={classNames("filter-- filter--size", list.includes("size") ?"active":"")}>
                <button
                  aria-controls="size-dropdown-pagination"
                  className="filter--dropdown"
                  aria-expanded={list.includes("size") ? "true" : "false"}
                  onClick={(e) => showList("size")}
                >
                  <h5>Size</h5>
                  <ArrowDown />
                </button>
                <div id="size-dropdown-pagination" className={classNames("filter--content", list.includes("size") ? "active":"")}>
                  <div className="close" onClick={(e) => showList("size")}><Close/></div>
                  <div className="filter--list">
                    {sizeAr.map((size, i) => ( 
                      filterSize.includes(size.title)?
                      <label key={i} className={params.includes(size.title)?"selected":""}>
                        <input type="checkbox" name="filter--size" value={size.title} onChange={(e) => filter({e})} /> 
                        <div className="option--size">{size.title.replace('filter::size:','')}</div>
                      </label> :""
                    ))}
                  </div>
                </div>
              </div>
              <div className={classNames("filter-- filter--color", list.includes("color") ?"active":"")}>
                <div
                  aria-controls="colors-dropdown-pagination"
                  aria-expanded={list.includes("color") ? "true": "false"}
                  className="filter--dropdown"
                  onClick={(e) => showList("color")}
                >
                  <h5>Color</h5>
                  <ArrowDown />
                </div>
                <div id="colors-dropdown-pagination" className={classNames("filter--content", list.includes("color") ?"active":"")}>
                  <div className="close" onClick={(e) => showList("color")}><Close/></div>
                  <div className="filter--list ">
                    {colorAr.map((color, i) => ( 
                      filterColor.includes(color.title)?
                      <label key={i} className={classNames(params.includes(color.title)?"selected":"", color.title.replace('filter::color:','') == ""?"hide":"")} >
                        <input type="checkbox" name="filter--color" value={color.title} onChange={(e) => filter({e})} />
                        {checkColor(color.title.replace('filter::color:',''), i)}
                        <p>{color.title.replace('filter::color:','')}</p>
                      </label> :""
                    ))}
                  </div>
                  </div>
              </div>
              <div className={classNames("filter-- filter--type", list.includes("type") ?"active":"")}>
                <div
                  aria-controls="colors-dropdown-pagination"
                  aria-expanded={list.includes("type") ? "true": "false"}
                  className="filter--dropdown"
                  onClick={(e) => showList("type")}
                >
                  <h5>Type</h5>
                  <ArrowDown />
                </div>
                <div id="colors-dropdown-pagination" className={classNames("filter--content", list.includes("type") ?"active":"")}>
                  <div className="close" onClick={(e) => showList("type")}><Close/></div>
                  <div className="filter--list ">
                    {typeAr.map((type, i) => ( 
                      filterType.includes(type.title)?
                      <label key={i} className={params.includes(type.title)?"selected":""}>
                        <input type="checkbox" name="filter--type" value={type.title} onChange={(e) => filter({e})} /> {type.title.replace('filter::type:','')}
                      </label> :""
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        { params != '' ?
          <div className="selected--filter">
            <div className="selected--item item--size">
              {params.map(param => (
                  param.includes("size")? <div className="item--detail" onClick={(e) => filter({e}, param)}>{param.replace('filter::size:','Size: ')} <Close/></div>:""
              ))}
            </div>
            <div className="selected--item item--color">
              {params.map(param => (
                  param.includes("color")? <div className="item--detail" onClick={(e) => filter({e}, param)}>{param.replace('filter::color:','Color: ')} <Close/></div>:""
              ))}
            </div>
            <div className="selected--item item--type">
              {params.map(param => (
                  param.includes("type")? <div className="item--detail" onClick={(e) => filter({e}, param)}>{param.replace('filter::type:','Type: ')} <Close/></div>:""
              ))}
            </div>
            <div className="clear--filter" onClick={(e) => filter({e}, "clearall")}>Clear All</div>
          </div>
          :""
        }
        <h3 className="heading sub-collection--title tf-cp">{title}</h3>
          { slider ?
          <div className="product--listing slider">
          <Slider {...settings}>
            {displayData().map((product, index) => (
              <ProductCard key={index} product={product} contenfulData={contenfulData} vColor={vColor} reviews={reviews} page={page} params={paramsPos}/>
            ))}
          </Slider>
          </div>
          :
          <div className="product--listing grid">
            {displayData().map((product, index) => (
              <ProductCard key={index} product={product} contenfulData={contenfulData} vColor={vColor} reviews={reviews} page={page} params={paramsPos}/>
            ))}
            </div>
          }
      </div>
      {totalPages > 1?
      <div className="pagination flex">
        {
          page != 1 ?
          <button className="button small black prev" onClick={() => setPage(page - 1)}> Prev Page </button>
          :
          <button className="button small black disable prev" > Prev Page </button>
        }
        {
          result.map((pages, index) => (
            index < page - 1   && index >= page - 9999 ?
            <span key={index} onClick={() => setPage(pages)}>{pages}</span>
            :""
          ))
        }
        {
          result.map((pages, index) => (
            index == page - 1 ?
            <span key={index} className="current">{pages}</span>
            :""
          ))
        }
        {
          result.map((pages, index) => (
            index > page - 1  && index <= page + 9999 ?
            <span key={index} onClick={() => setPage(pages)}>{pages}</span>
            :""
          ))
        }
        {
          page == totalPages ?
          <button className="button small black next disable"> Next Page </button>
          :
          <button className="button small black next" onClick={() => setPage(page + 1)}> Next Page </button>
        }
      
      </div>
      :""}
    </div>
  )
}

export default ProductListings
