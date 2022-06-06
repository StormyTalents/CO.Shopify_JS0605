import TopBanner from '@/components/header/TopBanner'
import DesktopMenu from '@/components/header/DesktopMenu'
import MobileMenu from '@/components/header/mobileMenu'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

function Nav({ navs, menuSlug, topBar, basicProdData, searchPopular }) {

  const [device, setDevice] = useState("desktop")
  const [menuTop, setMenuTop] = useState(true)
  const [scroll, setScroll] = useState(true)
  const router = useRouter()

  useEffect(() => {

    if (typeof window !== 'undefined') {
      const wSize = window.innerWidth
      if (wSize <= 769 ) {
        setDevice("mobile")
      }
    }

    let lastScroll = 0 
    function onWheel() {
      var st = window.pageYOffset || document.documentElement.scrollTop;
      if (st > lastScroll){
          setScroll(false)
      } else {
        if(lastScroll - st > 5) {
          setScroll(true)
        }
      }
      if (st <= 140) {
        setMenuTop(true)
      } else {
        setMenuTop(false)
      }
      
      lastScroll = st <= 0 ? 0 : st;
    }

    if (typeof window !== 'undefined') {
      const wSize = window.innerWidth
      if (wSize <= 769 ) {
        window.addEventListener("scroll", onWheel);
        return () => window.removeEventListener("scroll", onWheel);
      }
    }

  }, [router.asPath])

  useEffect(() => {

    const handleStop = (url) => {
      if(url.includes("products")) {
        const loadPos = document.getElementById("mobileproddetail")
        if(loadPos) {
          loadPos.scrollIntoView()
          setScroll(false)
        }
      }
    }
    
    router.events.on('routeChangeComplete', handleStop)

    return () => {
      router.events.off('routeChangeComplete', handleStop)
    }

  },[router.events])
  
  return (
    <header className={`header--nav ${menuTop?"ontop":""} ${scroll?"scrollup":"scrolldown"}`} >
      <TopBanner topBar={topBar}/>
      {device == "desktop" ?
        <DesktopMenu navs={navs} menuSlug={menuSlug} basicProdData={basicProdData} searchPopular={searchPopular}/>
      :
        <MobileMenu navs={navs} menuSlug={menuSlug} basicProdData={basicProdData} searchPopular={searchPopular}/>
      }
    </header >
  )
}

export default Nav
