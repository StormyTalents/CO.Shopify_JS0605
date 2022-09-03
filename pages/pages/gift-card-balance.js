import { getContenfulData} from '@/lib/cache' 
import { getNavDataNeeded } from '@/lib/contentful'
import Script from 'next/script'
import SEO from '@/components/SEO'

function balancePage() {
    return (
        <div className='page'>
          <SEO title="Check My Gift Card Balance | AFTCO" description="For Gift Card Rules click here."/> 
          <Script async src='https://str.rise-ai.com/?shop=aftco-test.myshopify.com' strategy="afterInteractive"/>
          <div id="GiftWizard-account__div"></div>
        </div>
    )
  }

  export async function getStaticProps() {
    const contenfulData = await getContenfulData()
    const searchPopular = contenfulData.searchPopular
    const navs = contenfulData.naventries
    const navsData = await getNavDataNeeded(navs, contenfulData)
    const topBar = contenfulData.topBar[0].fields.contents.content
    const basicProdData = {"vColor":contenfulData.vColor, "badge":contenfulData.badge, "discount":contenfulData.discount,"gwp":contenfulData.gwp}

    return {
      props: {
        navs,
        navsData,
        topBar,
        basicProdData,
        searchPopular
      },
    }
  }

  export default balancePage