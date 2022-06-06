import { CartProvider } from '@/context/Store'
import Main from '@/components/MainFrame'

function Layout({ children, navs, menuSlug, basicProdData, topBar, searchPopular }) {
  
  return (
    <CartProvider>
      <Main 
        navs={navs} 
        menuSlug={menuSlug} 
        basicProdData={basicProdData}
        topBar={topBar}
        searchPopular={searchPopular}
      >
          {children}
      </Main>
    </CartProvider> 
  )
}

export default Layout
