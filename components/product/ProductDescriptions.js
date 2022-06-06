import { useEffect, useState } from 'react'
import classNames from 'classnames'
import Image from 'next/image'
import { Plus, Minus } from '@/components/icons'
import RichText from '@/components/richtext'


function ProductDescriptions({ description, tags, productData, richTextBasicData }) { 

  const [windowSize, setWindowSize] = useState("desktop")
  const [detailExpand, setDetailExpand] = useState("none")

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth
      if(width <= 680) {
          setWindowSize("mobile")
      }

    }
  },[]);

  function mobExpand(data) {
    if(windowSize == "mobile") {
      if(detailExpand == data ) {
        setDetailExpand(false)
      } 
      else {
        setDetailExpand(data)
      }
    }
  }

  function CheckTech(tags) {
    let techs = []
    tags.map((tag) => {
      const find = richTextBasicData.techIco.find((idxs) => {
        return idxs.fields.tag[0] === tag;
        })
        
      if(find){
        techs.push(find)
      }
    })
    return (techs)
  }

  function getIframes(string) {
    const imgRex = /<iframe.*?src="(.*?)"[^>]+>/g;
    const images = [];
      let img;
      while ((img = imgRex.exec(description))) {
         images.push(img[1]);
      }
    return images;
  }

  return ( 
    <div className="product--description font-primary mb-50">
      <div className="block--mobile flex descriptions--wrap">
      {richTextBasicData.richText && richTextBasicData.richText.fields.descriptions?
      <div className="descriptions half full--mobile contentful">
        <h2 id="myBtn" className={`${detailExpand == "details"?"open":"close"} h3`} onClick={() => mobExpand("details")}>
          Details <span className="minus mobile"><Minus/></span><span className="plus mobile"><Plus/></span>
        </h2>
        <div className={`descriptions--content ${windowSize=="mobile"?`mob--accordion ${detailExpand== "details"?"show":"hide"}`:""}`}>
          <RichText content={richTextBasicData.richText.fields.descriptions.content} products={richTextBasicData.products} basicProdData={richTextBasicData.basicProdData} richTextData={richTextBasicData.richTextData} reviews={richTextBasicData.reviewNeeded}/>
        </div>
      </div>
      :
        <div className="descriptions half full--mobile">
          <h2 id="myBtn" className={`${detailExpand == "details"?"open":"close"} h3`} onClick={(e) => mobExpand("details")}>
            Details <span className="minus mobile"><Minus/></span><span className="plus mobile"><Plus/></span>
          </h2>
          <div className={`descriptions--content ${windowSize=="mobile"?`mob--accordion ${detailExpand== "details"?"show":"hide"}`:""}`} dangerouslySetInnerHTML={ {__html: description} } ></div>
        </div>
      }
        <div className="features half full--mobile">
          {richTextBasicData.richText ?
            <>
              {richTextBasicData.richText.fields.features?
                <div className="features--wrap contentfull">
                  <h2 onClick={(e) => mobExpand("features")} className={`${detailExpand == "features"?"open":"close"} h3`}>Features
                    <span className="minus mobile"><Minus/></span>
                    <span className="plus mobile"><Plus/></span>
                  </h2>
                  <div className={`spec ${windowSize=="mobile"?`mob--accordion ${detailExpand == "features"?"show":"hide"}`:""}`} >
                    <RichText content={richTextBasicData.richText.fields.features.content}/>
                  </div>
                </div>
              :""}
              {richTextBasicData.richText.fields.sizeFit?
                <div className="size--wrap mt-30 contentfull">
                  <h2 onClick={(e) => mobExpand("size")} className={`${detailExpand == "size"?"open":"close"} h3`}>Size & Fit
                    <span className="minus mobile"><Minus/></span>
                    <span className="plus mobile"><Plus/></span>
                  </h2>
                  <div className={`spec ${windowSize=="mobile"?`mob--accordion ${detailExpand == "size"?"show":"hide"}`:""}`}  >
                    <RichText content={richTextBasicData.richText.fields.sizeFit.content}/>
                  </div>
                </div>
              :""}
            </>
          :
            productData.spec?
              <>
                <div className="features--wrap metafield">
                  <h2 onClick={(e) => mobExpand("features")} className={`${detailExpand == "features"?"open":"close"} h3`}>Features
                    <span className="minus mobile"><Minus/></span>
                    <span className="plus mobile"><Plus/></span>
                  </h2>
                  <div className={`spec ${windowSize=="mobile"?`mob--accordion ${detailExpand == "features"?"show":"hide"}`:""}`} dangerouslySetInnerHTML={ {__html: productData.spec.value} } ></div>
                </div>
                <div className="size--wrap metafield mt-30">
                  <h2 onClick={(e) => mobExpand("size")} className={`${detailExpand == "size"?"open":"close"} h3`}>Size & Fit
                    <span className="minus mobile"><Minus/></span>
                    <span className="plus mobile"><Plus/></span>
                  </h2>
                  <div className={`spec ${windowSize=="mobile"?`mob--accordion ${detailExpand == "size"?"show":"hide"}`:""}`}  id="sizepop" dangerouslySetInnerHTML={ {__html: productData.spec.value} } ></div>
                </div>
              </>
              :""
          }
          {
            productData.blurb?
              <>
              <h2 onClick={(e) => mobExpand("features")} className={`${detailExpand == "features"?"open":"close"} h3`}>Features
                <span className="minus mobile"><Minus/></span>
                <span className="plus mobile"><Plus/></span>
              </h2>
              <div className={`spec ${windowSize=="mobile"?`mob--accordion ${detailExpand == "features"?"show":"hide"}`:""}`} dangerouslySetInnerHTML={ {__html: productData.blurb.value} } ></div>
              </>
              :""
          }
        </div>
        </div>
        <div className="technology--wrap">
          {CheckTech(tags).length != 0?
          <>
            <h2 className='h3'>Technology</h2>
            <div className="technology">
              {CheckTech(tags).map((tech, i) => (
                <div className="aftech" key={i}>
                  <div className="tech--img">
                    <Image
                      src={`https:${tech.fields.ico.fields.file.url}`}
                      alt="Picture of the author"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <p className="aftech-tip">
                    {tech.fields.description}
                  </p>
                </div>
                ))}
            </div>
          </>
          :""}
        </div>
        {richTextBasicData.richText && richTextBasicData.richText.fields.content?"":
        <div className={classNames("descriptions--media", description.search("iframe") < 0 ? "hide":"")} >
          {getIframes().map((data) => (
            <iframe src={data} title="aftco"></iframe>
          ))}
        </div>}
    </div>
  )
}

export default ProductDescriptions