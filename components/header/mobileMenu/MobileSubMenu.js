import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowDownTwo } from '@/components/icons' 
import { useRouter } from 'next/router'
import cookieCutter from 'cookie-cutter'
import { getURL } from '@/lib/headerFunction'

function NavBar({ navs, menuSlug, url }) {

  const navsRef = navs && navs.map(() => useRef(null))
  const router = useRouter();
  const [customer, setCustomer] = useState(null)
  const [thirdLevel, setThirdLevel] = useState(9999)

  useEffect(() => {
    const token = cookieCutter.get('_cds')
    if(token == undefined){
      setCustomer(null)
    }
    else {
      const getName = cookieCutter.get('_cdnc')
      const firstName = getName && getName != "null" ? JSON.parse(getName).firstName : "Customer"
      setCustomer(firstName)
    }
  },[] )

function thirdMenu(subindex) {
    const current = thirdLevel
    if (current == subindex) {
        setThirdLevel(99999)

        if (navsRef[subindex] && navsRef[subindex].current) {
          navsRef[subindex].current.blur();
        }
    }
    else {
        setThirdLevel(subindex) 

        if (navsRef[subindex] && navsRef[subindex].current) {
          navsRef[subindex].current.focus();
        }
    } 
}
function activeUrl(slug, customUrl) {
    let current = ""
    if(url.includes(slug)) {
    current =  "active"
    }
    if(url.includes(customUrl)) {
    current = "active"
    }
    return(current)
}

function mobilemenulink(e) {
    e.preventDefault()
}

    return (
        <div className='mob--menu--overflow'>
            {navs ?
                navs.map((nav, index) => {
                    return (
                        nav.title == "Mobile Menu" ?
                        nav.menuItem.map((item, subindex) => {
                        const page = menuSlug.find(col => col.sys.id == item.sys.id);
                        if(page.fields.subMenu) {
                            return (
                                <div className='mob--menu--item--wrap'>
                                    <div className='mob--menu--item'>
                                            { item.fields.slug && item.fields.customUrl?
                                                <Link href={getURL(page.sys.contentType.sys.id, page.fields.slug, page.fields.category, page.fields.customUrl)}>
                                                    <a className="tf-cp">
                                                        <h3 className='h4'>{item.fields.title}</h3>
                                                    </a>
                                                </Link>
                                            :
                                                page.fields.subMenu?
                                                    <div
                                                      tabIndex="-1"
                                                      ref={navsRef[index]}
                                                      className={`sub--item--title ${thirdLevel == subindex?"opened":"closed"}`}
                                                      onClick={() => thirdMenu(subindex)}
                                                    >
                                                        <button href="#" onClick={(e) => mobilemenulink(e)} className="focustrap button--text plain" aria-label="menu item"><h3 className='h4'>{item.fields.title}</h3></button>
                                                        <div className="add--less">
                                                            <div className="arrow"><ArrowDownTwo/></div>
                                                        </div>
                                                    </div>
                                                :
                                                    <div
                                                      tabIndex="-1"
                                                      ref={navsRef[index]}
                                                      className={`sub--item--title`}>
                                                        <h3 className='h4'>{item.fields.title}</h3>
                                                    </div>
                                            }
                                    </div>
                                    <div className={`third--sub--item ${thirdLevel == subindex?"opened":"closed"}`}>
                                    { page.fields.subMenu.map((thirdSubCild, thirdindex) => 
                                        <div className={`sub--item single ${activeUrl(page.fields.slug, page.fields.customUrl)}`} key={thirdindex}>
                                            {thirdSubCild.sys.contentType?
                                                <Link href={getURL(thirdSubCild.sys.contentType.sys.id, thirdSubCild.fields.slug, thirdSubCild.fields.category, thirdSubCild.fields.customUrl)}>
                                                    <a>
                                                        <div className="sub--item--title">
                                                            <h5>{thirdSubCild.fields.title}</h5>
                                                        </div>
                                                    </a>
                                                </Link>
                                            :""}
                                        </div>
                                    )}
                                    </div>
                                </div>
                            )
                        }
                        else {
                            return (
                                <div className="mob--menu--item--wrap">
                                    <div className='mob--menu--item'>
                                        <div className='sub--item--title '>
                                            <Link href={getURL(page.sys.contentType.sys.id, page.fields.slug, page.fields.category, page.fields.customUrl)}>
                                                <a className="tf-cp focustrap">
                                                    <h3 className='h4'>{item.fields.title}</h3>
                                                </a>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        })
                        :""
                    )
                })
            : ""
            }
            <div className="mob--menu--item--wrap">
                <div className='mob--menu--item'>
                    <div className='sub--item--title '>
                        <Link href="/account">
                            <a><h3 className='h4'>{customer?`Hi, ${customer}`:"Sign In"}</h3></a>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
  }
export default NavBar