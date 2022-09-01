import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import SEO from '@/components/SEO'
import Image from 'next/image'
import cookieCutter from 'cookie-cutter'
import * as cookie from 'cookie'
import { getCusomerAddress } from '@/lib/shopify'
import { getContenfulData } from '@/lib/cache'
import { getNavDataNeeded } from '@/lib/contentful'
import SideBar from '@/components/myaccount/sidebar' 
import Address from '@/components/myaccount/address' 
import AddressForm from '@/components/myaccount/addressForm'
import { getCustomerUpdatedAddress, deleteAddress, setDefaultAddress } from '@/utils/helpers'

function addresses({customerData}) {
    const [expand, setExpand] = useState(null)
    const [newDefaultAddress, setNewDefaultAddress] = useState(null)
    const [newAddressList, setNewAddressList] = useState(null)
    const [token, setToken] = useState(null)
    const [onload, setOnLoad] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const newToken = cookieCutter.get('_cds')
        if(newToken && newToken != "null") {
            setToken(newToken)
            getNewData(newToken)
        }
        else {
            cookieCutter.set('_cdnc', null)
            router.push("/account/login")
        }
      },[customerData, router.asPath]);  

    function opendAddress(id) {
        const currentStatus = expand
        if(currentStatus == id) {
            setExpand(null)
        }
        else {
            setExpand(id)
        }
    }
    
    async function getNewData(newToken) {
        const newaddr = await getCustomerUpdatedAddress(newToken,"request")
        const defaultAddress = newaddr.data.data.customer?newaddr.data.data.customer.defaultAddress:null
        const addressList = newaddr.data.data.customer?newaddr.data.data.customer.addresses.edges.filter( address =>  address.node.id != newaddr.data.data.customer.defaultAddress.id ):null
        setNewDefaultAddress(defaultAddress)
        setNewAddressList(addressList)
    }

    async function setAddress(data,type) {
        if(type == "delete") {
          await deleteAddress(data)
        }
        else {
           await setDefaultAddress(data)
        }
        getNewData(token)
    }  

    return (
        <div className="addresses">
            <SEO title="Account Adress List Page" description="Account Adress List Page of Aftco"/> 
            <div className="container">
                <div className="customer__grid">
                    <SideBar />
                    <div className="customer__main customer__addresses">
                        <h3>Saved Addresses</h3>
                        {newDefaultAddress?
                            <>
                                <div className='address--section flex'>
                                    <h4>Default</h4>
                                    <div className='address--cta'>
                                        <button className='button--text' onClick={(e) => opendAddress(newDefaultAddress.id)}>Edit</button>
                                    </div>
                                </div>
                                <Address address={newDefaultAddress}/>
                                <AddressForm token={token} id={newDefaultAddress.id} dataAddress={newDefaultAddress} dataExpand={expand} title="Edit address"/>
                            </>
                        :
                            onload?
                                <div className="loading saved--address">
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
                            :<h4>No Address Found</h4>
                        }
                        {newAddressList?
                            <div className='address--list mt-50 mb-30'>
                                {newAddressList.map( address => 
                                    <>
                                        <div className='address--section flex'>
                                            <Address address={address.node}/>
                                            <div className='address--cta'>
                                                <button className='button--text' onClick={(e) => opendAddress(address.node.id)}>Edit</button>
                                                <button className='button--text' onClick={(e) => setAddress({id:address.node.id,token:token},"delete")}>Delete</button>
                                                <button className='button--text' onClick={(e) => setAddress({id:address.node.id,token:token},"set")}>Set as Default</button>
                                            </div>
                                        </div>
                                        <AddressForm token={token} id={address.node.id} dataAddress={address.node} dataExpand={expand} title="Edit address"/>
                                    </>
                                )}
                            </div>
                        :""}
                        <a className="button light" onClick={(e) => opendAddress("new")}>Add a new address</a>
                        <AddressForm token={token} id={"new"} dataAddress={null} dataExpand={expand} title="Add a new address"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const contenfulData = await getContenfulData()
    const searchPopular = contenfulData.searchPopular
    const navs = contenfulData.naventries
    const navsData = await getNavDataNeeded(navs, contenfulData)
    const topBar = contenfulData.topBar[0].fields.contents.content
    const basicProdData = {
        "vColor":contenfulData.vColor, 
        "badge":contenfulData.badge, 
        "discount":contenfulData.discount,
        "gwp":contenfulData.gwp
    }
    const token = cookie.parse(context.req.headers.cookie)._cds
    const customerData = await getCusomerAddress(token)
    return {
      props: {
        navs,
        navsData,
        topBar,
        basicProdData,
        customerData,
        searchPopular
      },
    }
  }

  export default addresses