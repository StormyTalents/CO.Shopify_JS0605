import { useState, useEffect } from 'react'
import SearchResultItem from '@/components/product/search/SearchResultItem'
import classNames from 'classnames'
import { Close, Search } from '@/components/icons'
import Link from 'next/link'
import Image from 'next/image'
import { useCartContext, useSearchString } from '@/context/Store'
import { searchPrediction } from '@/lib/klevu'
import { useRouter } from 'next/router'
import { dl_search_results } from '@/lib/dataLayer'


function search({ vColor, searchPopular }) {
    const [searchPredic, setSearchPredic] = useState(null)
    const [searchPredicNumber, setSearchPredicNumber] = useState(null)
    const [searchProduct, setSearchProduct] = useState(null)
    const [searchProductStatus, setSearchProductStatus] = useState(null)
    const searchString = useCartContext()[4]
    const [showSearch, setShowSearch] = useState(false)
    const [expand, setExpand] = useState(false)
    const [load, setLoad] = useState(true)

    const updateSearch = useSearchString()
    const router = useRouter()

    useEffect(() => {
      router.events.on('routeChangeComplete', closeSearch)
      return () => {
        router.events.off('routeChangeComplete', closeSearch)
      }
    },[router.events])

    async function searchProd(data) {
        const searchText = data; 
        const searchResult = await searchPrediction(searchText)
        setSearchPredic(searchResult.suggestionResults[0].suggestions)
        if (searchResult.queryResults[0].meta.totalResultsFound) {
          setSearchPredicNumber(searchResult.suggestionResults[0].suggestions.length+" result found")
          setSearchProduct(searchResult.queryResults[0].records.slice(0, 4))
          updateSearch(searchResult.queryResults[0])
          const condItion = document.querySelector(".expand")
          if( router.asPath != "/products/search" && condItion) {
            setShowSearch(true)
          }
          setSearchProductStatus("done")
          setLoad(false)
          dl_search_results(searchResult.queryResults[0].records, searchText)
        } else if (searchResult.queryResults[1].meta.totalResultsFound) {
          setSearchPredicNumber(searchResult.suggestionResults[0].suggestions.length+" result found")
          setSearchProduct(searchResult.queryResults[1].records.slice(0, 4))
          updateSearch(searchResult.queryResults[1])
          const condItion = document.querySelector(".expand")
          if( router.asPath != "/products/search" && condItion) {
            setShowSearch(true)
          }
          setSearchProductStatus("done")
          setLoad(false)
          dl_search_results(searchResult.queryResults[1].records, searchText)
        }
        else {
          setSearchPredicNumber("0 result found")
          setSearchProduct(null)
          updateSearch(null)
          setLoad(false)
          setSearchProductStatus(null)
        }
      }
    
      async function useSuggest(data) {
        setLoad(true)
        document.getElementById("searchdesk").value = data;
        searchProd(data)
      }

      let typingTimer;                //timer identifier
      let doneTypingInterval = 400;
    
      function keyUp(e) {
        setSearchProductStatus(null)
        if ( e.key == "Enter" && searchProductStatus) {
          closeSearch()
          router.push('/products/search')
        }
        else {
          clearTimeout(typingTimer);
          if (e.target.value) {
            typingTimer = setTimeout(doneTyping, doneTypingInterval);
          }
        }
      } 
      function doneTyping () {
        setLoad(true)
        const data = document.getElementById("searchdesk").value
        searchProd(data)
    }

      async function expandSearch() {
        if (!expand) {
          setExpand(true)
          if( router.asPath != "/products/search") {
            setSearchPredic(searchPopular ? searchPopular.suggestionResults[0].suggestions : null)
            setSearchProduct(searchPopular ? searchPopular.queryResults[0].records : null)
            setShowSearch(true)
            setLoad(false)
            document.querySelector("body").classList.add("stay")
          }
        }
      }

      function closeSearch() {
        setExpand(false)
        setShowSearch(false)
        document.getElementById("searchdesk").value = "";
        document.querySelector("body").classList.remove("stay")
      }
 
    return (
        <div className={classNames("search--header", {"expand":expand})} >
          <div className="close--trigger" onClick={(e) => closeSearch()}></div>
            <div className="search--wrap">
              <div id="instructions" style={{display: "none"}}>Begin typing to search</div>
              <input type="search" 
                onClick={(e) => expandSearch()} 
                onKeyUp={(e) => keyUp(e)} 
                placeholder="Search" 
                className="desktop" 
                id="searchdesk"
                autoComplete='none'
                aria-autocomplete="off" 
                aria-controls="preresults"
                aria-expanded="false"
                aria-describedby="instructions"
              />
              <div className="search--ico mobile" onClick={(e) => expandSearch()}><Search /></div>
              <button aria-label="close search" className="close" onClick={(e) => closeSearch()}><Close /></button>
              <div className={classNames("search--mini--result ", {"show":showSearch})}>
                <div className="search--predictions" >
                  <h2 className='h5'>Popular Searches</h2>
                  <div className="search--predictions--result" id="preresults">
                  { searchPredic ? 
                    <h3 className="results-count sr-only h5" aria-live="assertive" >{searchPredicNumber}</h3>
                    :
                    <h3 className="h5" aria-live="assertive" >{searchPredicNumber}</h3>
                  }
                    {load? 
                        <div className='loadmore--wrap'>
                          <div id="loadmore">
                                <Image
                                    src={"/icons/loading.gif"}
                                    alt={"aftco"}
                                    width={64}
                                    height={64}
                                    layout="responsive"
                                />
                            
                          </div>
                        </div>
                      :""}
                      { searchPredic &&
                      <ul role="listbox" aria-labelledby="searchdesk">
                        {searchPredic.map((item,i) => (
                            <li className="search--prediction" role="option" dangerouslySetInnerHTML={
                            { __html: item.suggest}
                        } onClick={() => useSuggest(item.suggest.replace(/<b>|<\/b>/g,''))}></li>
                        ))}
                      </ul>
                      }
                      </div>
                </div>
                <div className="search--products">
                  <div className='search--suggest--head flex'>
                    <h2 className='h5'>Top Suggestions</h2>{searchString && !load?<Link href="/products/search"><a className='h5'>View All</a></Link>:""}</div>
                    {!searchProduct && <h3 className="h5" aria-live="assertive" >{searchPredicNumber}</h3>}
                  <div className="search--products--result grid">
                    {load? 
                      <div className='loadmore--wrap'>
                        <div id="loadmore">
                              <Image
                                  src={"/icons/loading.gif"}
                                  alt={"aftco"}
                                  width={64}
                                  height={64}
                                  layout="responsive"
                              />
                          
                        </div>
                      </div>
                    :""}
                    {searchProduct && searchProduct.map((item,i) => (
                          <SearchResultItem product={item} vColor={vColor} key={i} />
                      ))}
                  </div>
                </div>
              </div>
            </div>
        </div>
    )
  }
  
  export default search