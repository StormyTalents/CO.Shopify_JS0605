import countries from "/static/json/countries.json"
import { getProvince } from '@/utils/helpers'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

function country({selectedCountry, selectedProvince}) {

    const [province, setProvince] = useState(null)
    const router = useRouter();

    async function getProv(e) {
        let country
        if ( e.target ) {
            country = e.target.value
        }
        else {
            country = e
        }
        const prov = await getProvince(country.toLowerCase().replace(/ /g, "-"))
        if(prov != "Not Found"){
            setProvince(prov)
        }
        else {
            setProvince(null)
        }
    }

    useEffect(() => {
       if (selectedCountry) {
        getProv(selectedCountry)
       }
      },[router.asPath]); 
    
    return (
        <>
            <div id="AddressProvinceContainerNew" >
                <div className="select">
                    <label for="AddressCountryNew">Country/region</label>
                    <select id="AddressCountryNew" name="country" data-default="" autocomplete="address-level1" onChange={(e) => getProv(e)}>
                        <option value="---">---</option>
                        {countries.map(ctry =>
                            <option value={ctry.name} selected={ctry.name == selectedCountry?true:false}>{ctry.name}</option>
                            )}
                    </select>
                </div>
            </div>
            {province?
                <div id="AddressProvinceContainerNew" >
                    <label for="AddressProvinceNew">Province</label>
                    <div className="select">
                        <select id="AddressProvinceNew" name="province" data-default="" autocomplete="address-level1">
                                {province.map(prov =>
                                    <option value={prov.name} selected={prov.name == selectedProvince?true:false}>{prov.name}</option>
                                    )}
                        </select>
                    </div>
                </div>
            :
            <div className="field">
                    <input type="text" id="AddressProvinceContainerNew" name="province"  autocapitalize="characters"placeholder="Province" />
                    <label for="AddressZipNew">Province</label>
                </div>
            }
        </>

    )
}

  export default country