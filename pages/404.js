import { getContenfulData, getShopifyRedirectPath } from '@/lib/cache'
import { getNavDataNeeded, getRedirectList } from '@/lib/contentful'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

function Custom404({redirects, redirectList}) {

 const router = useRouter()
 
  useEffect(() => {
    const redirect = redirects.find(rd => rd.node.path == router.asPath)
    const redirectContenfull = redirectList.find(rd => rd.fields.from == router.asPath)

    if (redirectContenfull) {
      router.push(redirectContenfull.fields.to)
      } else if (redirect) {
        router.push(redirect.node.target)
      } else {
        router.push("/")
      }
  }, [])

  return (
    <div className="page"> 
      <h1 className='center'>Getting everything ready...</h1>
      <h2 className='h5 center mt-50'>The server was finding the best route for you.</h2>
    </div>
  )
}
export async function getStaticProps() {
  const contenfulData = await getContenfulData()
  const searchPopular = contenfulData.searchPopular
  const navs = contenfulData.naventries
  const navsData = await getNavDataNeeded(navs, contenfulData)
  const redirectList = await getRedirectList()
  const topBar = contenfulData.topBar[0].fields.contents.content
  const basicProdData = {"vColor":contenfulData.vColor, "badge":contenfulData.badge, "discount":contenfulData.discount,"gwp":contenfulData.gwp}
  const redirects = await getShopifyRedirectPath()

  return {
    props: {
      navs,
      navsData,
      topBar,
      basicProdData,
      redirectList,
      redirects,
      searchPopular
    },
  }
}

export default Custom404