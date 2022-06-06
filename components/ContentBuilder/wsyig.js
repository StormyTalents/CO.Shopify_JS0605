import Link from 'next/link'

function wsyig({data}) {

    function removeParam(key, sourceURL) {
        var rtn = sourceURL.split("?")[0],
            param,
            params_arr = [],
            queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
        if (queryString !== "") {
            params_arr = queryString.split("&");
            for (var i = params_arr.length - 1; i >= 0; i -= 1) {
                param = params_arr[i].split("=")[0];
                if (param === key) {
                    params_arr.splice(i, 1);
                }
            }
            if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
        }
        return rtn;
    }

    function checkOpenTag(data) {

        const urlParam = (urlP,i,val) => { 
            const params = new URLSearchParams(urlP) 
            const rel = params.get('rel')
            const target = params.get('target')
            const urlNoRel = removeParam("rel", urlP)
            const urli = removeParam("target", urlNoRel)

            return <Link key={i} href={urli} passHref ><a rel={rel} target={target}>{val}</a></Link>
        } 

        switch(data.nodeType) { 
            case "heading-1":
            return(
                <h1>
                { data.content.map((isi,i) =>
                    isi.nodeType == "hyperlink"?
                        urlParam(isi.data.uri,i,isi.content[0].value)
                    :
                    <span key={i} className={isi.marks?isi.marks.map((mark)=>mark.type):""}>
                    {isi.value}
                    </span>
                    )}
                </h1>
            )
            break;
            case "heading-2":
            return(
                <h2>
                { data.content.map((isi,i) =>
                    isi.nodeType == "hyperlink"?
                        urlParam(isi.data.uri,i,isi.content[0].value)
                    :
                    <span key={i} className={isi.marks?isi.marks.map((mark)=>mark.type):""}>
                    {isi.value}
                    </span>
                    )}
                </h2>
            )
            break;
            case "heading-3":
            return(
                <h3>
                { data.content.map((isi,i) =>
                    isi.nodeType == "hyperlink"?
                        urlParam(isi.data.uri,i,isi.content[0].value)
                    :
                    <span key={i} className={isi.marks?isi.marks.map((mark)=>mark.type):""}>
                    {isi.value}
                    </span>
                    )}
                </h3>
            )
            break;
            case "heading-4":
            return(
                <h4>
                { data.content.map((isi,i) =>
                    isi.nodeType == "hyperlink"?
                        urlParam(isi.data.uri,i,isi.content[0].value)
                    :
                    <span key={i} className={isi.marks?isi.marks.map((mark)=>mark.type):""}>
                    {isi.value}
                    </span>
                    )}
                </h4>
            )
            break;
            case "heading-5":
            return(
                <h5>
                { data.content.map((isi,i) =>
                    isi.nodeType == "hyperlink"?
                        urlParam(isi.data.uri,i,isi.content[0].value)
                    :
                    <span key={i} className={isi.marks?isi.marks.map((mark)=>mark.type):""}>
                    {isi.value}
                    </span>
                    )}
                </h5>
            )
            break;
            case "heading-6":
            return(
                <h6>
                { data.content.map((isi,i) =>
                    isi.nodeType == "hyperlink"?
                        urlParam(isi.data.uri,i,isi.content[0].value)
                    :
                    <span key={i} className={isi.marks?isi.marks.map((mark)=>mark.type):""}>
                    {isi.value}
                    </span>
                    )}
                </h6>
            )
            break;
            default:
            return(
                <p>
                { data.content.map((isi,i) =>
                    isi.nodeType == "hyperlink"?
                        urlParam(isi.data.uri,i,isi.content[0].value)
                    :
                    <span key={i} className={isi.marks?isi.marks.map((mark)=>mark.type):""}>
                    {isi.value}
                    </span>
                    )}
                </p>
            )
        }
        }
        function checkCode(data) {
            const check = data.content.map((isi,i) => isi.marks?isi.marks.map((mark)=>mark.type):"")
            return(check)
            }
    return (
            <div className="wsyig">
                {data.nodeType == "paragraph" || data.nodeType == "heading-1" || data.nodeType == "heading-2" || data.nodeType == "heading-3" || data.nodeType == "heading-4" || data.nodeType == "heading-5" || data.nodeType == "heading-6" || data.nodeType == "unordered-list"? 
                <div className="container">
                    {checkCode(data) == "code"? 
                        <div dangerouslySetInnerHTML={
                        { __html: data.content.map((isi,i) => isi.value)}
                        }/>
                    : 
                        checkOpenTag(data)
                    }
                </div>
            :""}
            {data.nodeType == "unordered-list"?
                <ul>
                    {data.content.map((list,i) => 
                        <li key={i}>
                            {list.content[0].content.map((li,idx) =>
                                <>
                                    {li.nodeType == "text"?li.value:""}
                                    {li.nodeType == "hyperlink"?<Link href={li.data.uri}><a className="size-chart navigable">{li.content[0].value}</a></Link>:""}
                                </>
                            )}
                        </li>
                    )}
                </ul>
                    :""}
            </div>
    )
}
export default wsyig