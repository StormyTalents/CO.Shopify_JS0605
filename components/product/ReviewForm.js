import { useState } from 'react'
import { createReview } from '@/lib/review'
import Rating from '@/components/Form/Rating'

function ReviewForm({ product, type }) {
    const [rateToShow, setRateToShow] = useState(0);
    const [fileUrl, setFileUrl] = useState(null);
    const globalProdId = Buffer.from(product.id, 'base64').toString('binary')
    const prodId = globalProdId.replace("gid://shopify/Product/", "")
    const sku = product.variants.edges[0].node.sku ? product.variants.edges[0].node.sku.split("-") : "aftco"

    function file(file) {
        var fReader = new FileReader();
        fReader.readAsDataURL(file);  
        setFileUrl(fReader)
        fReader.onloadend = function(event){
            setFileUrl(event.target.result)
        }
    }

    function rate(data) {
        setRateToShow(data)
    }

return (
    <>
    {type == "review" ?
        <form id="review" onSubmit={(event) => createReview(event)}>
            <input id="productId" name="productId" type="hidden" value={prodId}/>
            <input id="productName" name="productName" type="hidden" value={product.title} />
            <input id="productSKU" name="productSKU" type="hidden" value={sku[0]} />
            <input id="productImageUrl" name="productImageUrl" type="hidden" value={product.images.edges[0] ? product.images.edges[0].node.smallImage:"/icons/logo.png"} />
            <input id="productUrl" name="productUrl" type="hidden" value={"https://aftco.com/products/"+product.handle} />
            <div className="flex half full--mobile">
                <label className="name full" htmlFor="username">Name<br/><input id="username" name="username" type="text" className="thin" required autoComplete="name" /></label>
                <label className="full" htmlFor="email">Email<br/><input id="email" name="email" type="email" autoComplete="email" className="thin" required /></label>
            </div>
            <div className="rating">
                <div><p>Rating</p></div>
                <Rating
                    selected={rateToShow}
                    onChange={(e) => rate(parseInt(e.target.value))}
                />
            </div>
            <div>
                <label htmlFor="title">Title of Review</label>
                <input className="thin" id="title" name="title" type="text" required />    
            </div>
            <label htmlFor="comment">How was your overall experience?</label><br/>
            <textarea rows="10" className="full" id="comment" name="comment" form="review"></textarea>
            <div className="form--footer flex full">
                <img src={fileUrl} />
                <div className="submit flex">
                    <input className="file-input" type="file" id="myfile" name="myfile" accept="image/png, image/gif, image/jpeg" onChange={ (e) => file(e.target.files[0])} />
                    <button type="submit">Submit</button>
                </div>
            </div>
        </form>
        :
        <form id="question" onSubmit={(event) => createQuestion(event)}>
            <input id="productId" name="productId" type="hidden" value={prodId}/>
            <input id="productName" name="productName" type="hidden" value={product.title} />
            <input id="productSKU" name="productSKU" type="hidden" value={sku[0]} />
            <input id="productImageUrl" name="productImageUrl" type="hidden" value={product.images.edges[0] ? product.images.edges[0].node.smallImage:"/icons/logo.png"} />
            <input id="productUrl" name="productUrl" type="hidden" value={"https://aftco.com/products/"+product.handle} />
            <label htmlFor="username">Name</label>
            <input id="username" name="username" type="text" required />
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required />
            <label htmlFor="comment">Questions?</label>
            <textarea rows="4" cols="50" id="comment" name="comment" form="review"></textarea>
            <div className="form--footer full">
                <div className="submit">
                    <button type="submit">Submit Questions</button>
                </div>
            </div>
            
        </form>
    }
    </>
)
}
export default ReviewForm