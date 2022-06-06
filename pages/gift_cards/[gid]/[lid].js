import { searchGiftCard } from '@/lib/shopify'

function giftCard() {

   return (
     <div className="page"> 
       <h1 className='center'>Getting everything ready...</h1>
       <h2 className='h5 center mt-50'>The server was finding the best route for you.</h2>
     </div>
   )
 }

export async function getServerSideProps(params) {
  const giftCardid = params.query.gid
  const giftCardSesson = params.query.lid
  return {
    redirect: {
      destination: `https://shop.aftco.com/gift_cards/${giftCardid}/${giftCardSesson}`,
    },
  }
}

export default giftCard
