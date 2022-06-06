import Country from '@/components/myaccount/countrylist'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { updateAdress, addAdress } from '@/utils/helpers'


function addressesForm({id, token, dataAddress, dataExpand, title}) {

    const [prov, setProv] = useState(null)
    const [expand, setExpand] = useState(false)
    const [firstName, setFirstName] = useState(dataAddress?dataAddress.firstName:null)
    const [lastName, setLastName] = useState(dataAddress?dataAddress.lastName:null)
    const [company, setCompany] = useState(dataAddress?dataAddress.company:null)
    const [address1, setAddress1] = useState(dataAddress?dataAddress.address1:null)
    const [address2, setAddress2] = useState(dataAddress?dataAddress.address2:null)
    const [city, setCity] = useState(dataAddress?dataAddress.city:null)
    const [zip, setZip] = useState(dataAddress?dataAddress.zip:null)
    const [phone, setPhone] = useState(dataAddress?dataAddress.phone:null)

    const router = useRouter();
    const refreshData = () => {
        router.replace(router.asPath);
      }
      
      useEffect(() => {
          if(id == dataExpand) {
            setExpand(true)
          }
          else {
            setExpand(false) 
          }
      },[dataExpand]);

    function province(e) {
        const index = e.target.selectedIndex;
        const optionElement = e.target.childNodes[index]
        const option =  optionElement.getAttribute('provinces');
        const adrs = option.replace(/'/g, '"')
        const obj = JSON.parse(adrs);
        if (option == "[") {
            setProv(false)
        }
        else {
            setProv(obj)
        }
    }

    function fieldUpdate(e) {
        const val = e.target.value
        if(e.target.name == "first_name") {
            setFirstName(val)
        }
        if(e.target.name == "last_name") {
            setLastName(val)
        }
        if(e.target.name == "company") {
            setCompany(val)
        }
        if(e.target.name == "address1") {
            setAddress1(val)
        }
        if(e.target.name == "address2") {
            setAddress2(val)
        }
        if(e.target.name == "city") {
            setCity(val)
        }
        if(e.target.name == "zip") {
            setZip(val)
        }
        if(e.target.name == "phone") {
            setPhone(val)
        }
    }

    async function fromSubmit(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
          })
        setExpand(false)
        const formData = new FormData(e.target);
        const newAddress  = Object.fromEntries(formData.entries())
        if(dataAddress){
         const newaddr = await updateAdress({newAddress:newAddress})
        }
        else  {
            await addAdress({newAddress:newAddress})
        }
        refreshData()
    }

    return (
        <div id="AddAddress" className={`customer-form-gird address--list--form mt-50 ${expand?"expand":"hide"}`}>
            <h3 id="AddressNewHeading" data-open-accessibility-text-original="24px" >{title}</h3>
            <form method="post" action="/account/addresses" onSubmit={(e) => fromSubmit(e)} id="address_form_new" accept-charset="UTF-8" aria-labelledby="AddressNewHeading">
                <input type="hidden" name="id" value={id} />
                <input type="hidden" name="token" value={token} />
                <div className="flex address--name">
                    <div className="field">
                        <input type="text" id="AddressFirstNameNew" name="first_name"  autoComplete="given-name" value={firstName?firstName:""} onChange={(e) => fieldUpdate(e)} placeholder="First name" />
                        <label for="AddressFirstNameNew">First name</label>
                    </div>
                    <div className="field">
                        <input type="text" id="AddressLastNameNew" name="last_name"  autoComplete="family-name" value={lastName?lastName:""} onChange={(e) => fieldUpdate(e)} placeholder="Last name" />
                        <label for="AddressLastNameNew">Last name</label>
                    </div>
                </div>
                <div className="field">
                    <input type="text" id="AddressCompanyNew" name="company"  autoComplete="organization" value={company?company:""} onChange={(e) => fieldUpdate(e)} placeholder="Company" />
                    <label for="AddressCompanyNew">Company</label>
                </div>
                <div className="field">
                    <input type="text" id="AddressAddress1New" name="address1"  autoComplete="address-line1" value={address1?address1:""} onChange={(e) => fieldUpdate(e)} placeholder="Address 1" />
                    <label for="AddressAddress1New">Address 1</label>
                </div>
                <div className="field">
                    <input type="text" id="AddressAddress2New" name="address2"  autoComplete="address-line2" value={address2?address2:""} onChange={(e) => fieldUpdate(e)} placeholder="Address 2" />
                    <label for="AddressAddress2New">Address 2</label>
                </div>
                <div className="field">
                    <input type="text" id="AddressCityNew" name="city"  autoComplete="address-level2" value={city?city:""} onChange={(e) => fieldUpdate(e)} placeholder="City" />
                    <label for="AddressCityNew">City</label>
                </div>
                <div>
                    <Country selectedCountry={dataAddress?dataAddress.country:null} selectedProvince={dataAddress?dataAddress.province:null}/>
                </div>
                <div className="field">
                    <input type="text" id="AddressZipNew" name="zip"  autocapitalize="characters" autoComplete="postal-code" value={zip?zip:""} onChange={(e) => fieldUpdate(e)} placeholder="Postal/ZIP code" />
                    <label for="AddressZipNew">Postal/ZIP code</label>
                </div>
                <div className="field">
                    <input type="tel" id="AddressPhoneNew" name="phone"  autoComplete="tel" value={phone?phone:""} onChange={(e) => fieldUpdate(e)} placeholder="Phone" />
                    <label for="AddressPhoneNew">Phone</label>
                </div>
                <div className="address__form__buttons">
                    <button className="navigable button">{dataAddress?"Update address":"Add Address"}</button>
                    <button className="button light" type="reset" onClick={e => setExpand(false)}>Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default addressesForm