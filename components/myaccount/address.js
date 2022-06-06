function addresses({address}) {

    return (
        <div className="address__addresses mb-20">
            <p>
            {address?address.firstName:""} {address.lastName?<>{address.lastName} <br/></>:""}
            {address.company?<>{address.company} <br/></>:""}
            {address.address1?<>{address.address1} <br/></>:""}
            {address.address2?<>{address.address2} <br/></>:""}
            {address?address.city:""} {address?address.province:""} {address?address.zip:""} {address.zip || address.province || address.city ?<br/>:""}
            {address?address.country:""}
            </p>
        </div>
    )
}

export default addresses