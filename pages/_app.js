import Layout from '@/components/Layout'
import '@/styles/globals.scss'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Script from 'next/script'
import { pageview } from '@/lib/dataLayer'
import { hotjar } from 'react-hotjar'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [urlRouter, setUrlRouter] = useState('')

  function storePathValues(prev, current) {
    sessionStorage.setItem("prevPath", prev);
    sessionStorage.setItem("currentPath", current);
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.onload = function() {
        console.log("init data layer")
      }
    }
    router.events.on('routeChangeComplete', pageview)
    return () => {
      router.events.off('routeChangeComplete', pageview)
    }
  }, [router.events])

  useEffect(() => {
    hotjar.initialize(2951015, 6)
  }, [])

  useEffect(() => {
    if (router.isReady) {
      const { utm_source, utm_medium, utm_campaign, utm_content, utm_id, utm_term } = router.query
      if(utm_source) {
        localStorage.setItem("UTM",JSON.stringify({utm_source: utm_source, utm_medium: utm_medium, utm_campaign: utm_campaign, utm_content: utm_content, utm_id: utm_id, utm_term: utm_term}))
      }
     }
     const oldCart = localStorage.getItem('twelves')

    if(oldCart) {
    localStorage.clear()
    }

    if(urlRouter != router.asPath) {
      setUrlRouter(router.asPath)
      if (typeof window !== 'undefined') {
        storePathValues(urlRouter, router.asPath)
      }
    }
  }, [router.asPath, router.isReady])

  
  return (
    <Layout 
      navs={pageProps.navs?pageProps.navs:""} 
      menuSlug={pageProps.navsData?pageProps.navsData:""} 
      basicProdData={pageProps.basicProdData?pageProps.basicProdData:null} 
      topBar={pageProps.topBar?pageProps.topBar:""}
      searchPopular={pageProps.searchPopular}
    >
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', 'GTM-TB9NCXB');
          `,
        }}
      />
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
