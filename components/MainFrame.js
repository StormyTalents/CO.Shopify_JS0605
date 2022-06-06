import { useCartContext, useUpdateCartStateContext } from '@/context/Store'
import Header from '@/components/header/Header'
import Footer from '@/components/Footer'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import Image from 'next/image'

function mainFrame({ children, navs, menuSlug, basicProdData, topBar, searchPopular }) {
  
    const miniCart = useCartContext()[3]
    const updateCartItemState = useUpdateCartStateContext()
    const router = useRouter()
    const[load, setLoad] = useState(false)
    const { cid } = router.query
    function updateCartState() {
      updateCartItemState(!miniCart)
    }

    useEffect(() => {
      const handleStart = () => {
        setLoad(true)
      }
      const handleStop = () => {
        setLoad(false)
      }

      router.events.on('routeChangeStart', handleStart)
      router.events.on('routeChangeComplete', handleStop)

      return () => {
        router.events.off('routeChangeStart', handleStart)
        router.events.off('routeChangeComplete', handleStop)
      }
    }, [router.events])

  return (
      <div className={classNames("aftco", {'aftco--miniCart--active': miniCart}, {'discount': cid}, {'page--loading': load})}>
        { load && 
          <div className="loading page--global">
            <div className="loading--ico">
              <Image
                src={"/icons/loading.gif"}
                alt={"aftco"}
                width={64}
                height={64}
                layout="responsive"
              />
            </div>
          </div>
        }
        <div className={classNames("main--container", {'aftco--miniCart--cover': miniCart})}>
          <div className="cart--cover" onClick={(e) => updateCartState()}></div>
          <Header navs={navs} menuSlug={menuSlug} topBar={topBar} basicProdData={basicProdData} searchPopular={searchPopular}/>
          <main>
            {children}
          </main>
          <Footer navs={navs} menuSlug={menuSlug} />
        </div>
      </div>
  )
}

export default mainFrame