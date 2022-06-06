import { useState, useEffect } from 'react'
import classNames from 'classnames'
import SubNav from '@/components/header/DesktopMenu/subNav'
import SubNavOld from '@/components/header/DesktopMenu/subNavOld'
import { useCartContext } from '@/context/Store'
import { useRouter } from 'next/router'
import { getURL } from '@/lib/headerFunction'

function NavBar({ navs, menuSlug, status, vColor, badge, classs }) {
  const router = useRouter();
  const mustHave = useCartContext()[5]
  const [menu, setNav] = useState(classs == "mobile"?0:99999)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    const elem = document.getElementById("subMenuId")
    if(elem != null ){
      const subs = document.getElementById("subMenuId").childNodes
      let HeightArray = []
      subs.forEach(sub => HeightArray.push(sub.offsetHeight?sub.offsetHeight:0))
      const maxHeight = Math.max(...HeightArray)
      document.getElementById("subMenuId").style.height = maxHeight+"px"
    }
  }, [menu])

  useEffect(() => {
    setHover(false)
    setNav(99999)
  },[router.asPath])


  function updateNavIn(i, sub, megaMenu) {
    setNav(i)
    if(sub) {
      setHover(true)
    }
  }
  
  function updateNavOut(i, sub) {
    if(sub) {
      setHover(false)
    }
    if (classs == "mobile") {
      setNav(i)
    }
    else {
      setNav(99999)
    }
  }

  const onClickMenu = item => () => {

    const hasSlugAndCustomURL = item.fields.slug || item.fields.customUrl;
    const target = hasSlugAndCustomURL
      ? getURL(item.sys.contentType.sys.id, item.fields.slug, item.fields.blogCategory, item.fields.customUrl)
      : `#${(item.fields.title || '').toLowerCase()}`;
    router.push(target);
  }

  const classWrapper = classNames("top--nav full", {'open':status}, classs)
  
  return (
    <nav className={classWrapper}>
      {hover && <div className='hover--wrap'></div>}
      {!!navs &&
        navs.map((nav, index) => {
          return (
            !!(nav.title == "Main Menu") && nav.menuItem.map((item, i) => {
                const classMenuItem = classNames(
                  "nav--item first--level sub--menu",
                  {
                    'has--sub' : item.fields.subMenu,
                    'mega--menu': item.fields.megaMenu,
                    'wide': item.fields.megaMenu, 
                    'oldStyle': item.fields.oldStyle, 
                    'simple': !item.fields.megaMenu,
                    'active': menu === i
                  }
                );

                return (
                  <div
                    className={classMenuItem}
                    key={i}
                    onFocus={() => updateNavIn(i, item.fields.subMenu, item.fields.megaMenu)}
                    onMouseOver={() => updateNavIn(i, item.fields.subMenu, item.fields.megaMenu)}
                    onMouseLeave={() => updateNavOut(i, item.fields.subMenu)}> 
                    <button
                      type='button'
                      role="tooltip"
                      aria-controls={item.fields.title}
                      aria-expanded={menu === i ? item.fields.subMenu ? "true" : "false" : "false"}
                      aria-label={item.fields.title}
                      className={`nav--title ${menu === i ? 'active-hover' : ''}`}
                      onClick={onClickMenu(item)}
                    >
                      <span className="tf-cp">{item.fields.title}</span>
                    </button>
                    {item.fields.subMenu && <div className={classNames("sub--menu", menu === i ? 'active':'')} id={item.fields.title}> 
                      <div className="sub--menu--wrap second--level">
                        {item.fields.oldStyle ? 
                          <SubNavOld
                            type="" 
                            featured={item.fields.featured} 
                            menuSlug={menuSlug} 
                            subMenu={item.fields.subMenu}
                            megaMenu={item.fields.megaMenu}
                          />
                        :
                          <SubNav 
                            type="" 
                            featured={item.fields.featured} 
                            menuSlug={menuSlug} 
                            subMenu={item.fields.subMenu} 
                            mustHave={mustHave} 
                            vColor={vColor}
                            badge={badge}
                            classs={classs}
                            megaMenu={item.fields.megaMenu}
                          />
                        }
                      </div> 
                    </div>}
                  </div>
                )
            })
          )
        })
      }
    </nav>
  )
}
export default NavBar