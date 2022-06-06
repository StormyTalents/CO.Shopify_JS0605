import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { signUpKlavio } from '@/utils/helpers'
import classNames from 'classnames'
import { phoneWhite, instagramWhite, facebookWhite, youtubeWhite } from '@/components/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import e from 'cors'

function Footer({navs, menuSlug}) {

  const [subscibe, setSubscibe] = useState(false)
  const [subscibeVal, setSubscibeVal] = useState(false)
  const [message, setMessage] = useState("Joined Successfully!") 
  const [windowSize, setWindowSize] = useState("desktop")
  const [detailExpand, setDetailExpand] = useState(9999)
  const [chat, setChat] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth
      if(width <= 768) {
          setWindowSize("mobile")
      }
    }
  },[]);

  async function subscribe(event) {
    event.preventDefault()  
    const subs = await signUpKlavio(event.target.email.value)
    if(event.target.email.value) {
      setSubscibe(true)
      setSubscibeVal(false)
      if(subs.status.length != 0) {
        setMessage("Joined Successfully!")
      } else {
        setMessage("Joined Error! Please try again later")
      }
    } else {
      setSubscibeVal(true)
    }
    
  }
  
  
  function getURL(type, handle, blogCat, customUrl) {

    let cat 
    let mainHandle

    if (blogCat != undefined){
        cat = blogCat[0].replace(/\s+/g, '-').toLowerCase()
    }

    if (handle == undefined && customUrl == undefined) {
        handle = "#"
    }

    if(customUrl) {
      handle = customUrl
    }

    switch(type) {
      case "blog":
        mainHandle = `/blogs/${cat}/`;
      break;
      case "blogCategories":
        mainHandle = `/blogs/`;
      break;
      case "collections":
        mainHandle = "/collections/";
      break;
      case "product":
        mainHandle = "/products/";
      break;
      case "page":
        mainHandle = "/pages/";
      break;
      default:
        mainHandle = "";
    }

    return(mainHandle+""+handle)
  }

  function mobExpand(data) {
    
    if (windowSize == "mobile") {
      if (data == detailExpand ) {
        setDetailExpand(9999)
      }
      else {
        setDetailExpand(data)
      }
    }
  }

  const d = new Date();
  const year = d.getFullYear()

  //function showCookies(e) {
  //  e.preventDefault()
  //  Cookiebot.show()
  //}

  return (
    <footer className="footer--wrap">
      <div className="footer--content">
        <div className="container flex mob-b">
          <div className="left--content half">
            <div className={`flex ${windowSize=="mobile"?`mob--accordion`:""}`}>
              {navs ?
                  navs.map((nav, index) => {
                  return (
                    nav.title == "Footer menu" ?
                    nav.menuItem.map((item, i) => {
                      return (
                        <div key={`main${i}`} className="footer--item one-third" onClick={(e) => mobExpand(i)}>
                          <h2 className='h5'>{item.fields.title} <span className="plus mobile"><FontAwesomeIcon icon={faPlus} /></span> <span className="minus mobile"><FontAwesomeIcon icon={faMinus} /></span></h2>
                          <ul className={detailExpand == i ?"show":""}>
                            {item.fields.subMenu?
                              item.fields.subMenu.map((sub, subindex) => {
                                const page = menuSlug.find(col => col.sys.id == sub.sys.id);
                                return (
                                    <li key={`sub${subindex}`}>
                                        <Link href={getURL(page.sys.contentType.sys.id, page.fields.slug, page.fields.category, page.fields.customUrl)}><a>{page.fields.title}</a></Link>
                                    </li>
                                )
                              })
                            :""}
                          </ul>
                        </div>  
                      )
                    })
                    :""
                    )
                })
                : ""
              }
            </div>
            <div className="social--media flex mobile">
              <div className="social--ico">
                <a href="https://www.instagram.com/aftco/"><Image src={instagramWhite} alt="Picture of the author" priority="true" layout="fixed" width={20} height={20} /></a>
              </div>
              <div className="social--ico">
                <a href="https://web.facebook.com/AftcoFishing?_rdc=1&_rdr"><Image src={facebookWhite} alt="Picture of the author" priority="true" layout="fixed" width={11} height={20} /></a>
              </div>
              <div className="social--ico">
                <a href="https://www.youtube.com/user/AFTCO1958"><Image src={youtubeWhite} alt="Picture of the author" priority="true" layout="fixed" width={29} height={20} /></a>
              </div>
            </div>
            <div className="call--action flex">
                <a href="tel:1-877-489-4278" className="button light white flex">
                  <div className="ico--footer">
                  <Image src={phoneWhite} alt="Picture of the author" priority="true" layout="responsive" width={21} height={20} />
                  </div> 
                  <h2 className='h5 white'>1-877-489-4278</h2>
                </a>
              <div id="georgias--trigger--open" onClick={(e) => setChat(true)}>
                <button className="button light white flex">
                  <div className="ico--footer">
                    <Image src="/icons/chat-white.png" alt="chat" priority="true" layout="responsive" width={20} height={17} />
                  </div> 
                    <h2 className='h5'>Live Chat</h2>
                </button>
                <div className='trigger--chat' dangerouslySetInnerHTML={
                  { __html: `
                      <div class="georgias--trigger--open--hide" onclick="GorgiasChat.open();">
                      </div>
                      `}
                  } />
              </div>
              {chat?
              <div id="georgias--trigger--close" onClick={(e) => setChat(false)} dangerouslySetInnerHTML={
                  { __html: `
                  <button class="gorgias-chat-messenger-button-close" onclick="GorgiasChat.close();">
                    <svg width="20" height="20" fill="none">
                      <path d="M15.25 4.758a.83.83 0 00-1.175 0L10 8.825 5.925 4.75A.83.83 0 104.75 5.925L8.825 10 4.75 14.075a.83.83 0 101.175 1.175L10 11.175l4.075 4.075a.83.83 0 101.175-1.175L11.175 10l4.075-4.075a.835.835 0 000-1.167z" fill="#fff">
                      </path>
                    </svg>
                  </button>
                  `}
              } />
              :""}
            </div>
          </div>
          <div className="sign--up--wrap half flex">
          <div className="half">
            <div className="sign--up">
              <h2 className='h5'>Connect With Us</h2>
              <div className={classNames("from-wrap")}>
                <p>Sign up to receive exclusive offers, product releases, original stories and more.</p>
                <form id="subscribe" onSubmit={(event) => subscribe(event)}>
                  <div className="form--content">
                    <input type="email" id="email" name="email" className={`light ${subscibeVal && "error"}`} placeholder={`Email Address ${subscibeVal ? "Required" :""}`} autoComplete="email"/>
                    <input type="submit" className="button" value=""/>
                  </div>
                </form>
              </div>
              <h4 className={subscibe?"show":"hide"}>{message}</h4>
            </div>
            <div className="social--media flex desktop">
              <div className="social--ico">
                <a href="https://www.instagram.com/aftco/"><Image src={instagramWhite} alt="Picture of the author" priority="true" layout="fixed" width={20} height={20} /></a>
              </div>
              <div className="social--ico">
                <a href="https://web.facebook.com/AftcoFishing?_rdc=1&_rdr"><Image src={facebookWhite} alt="Picture of the author" priority="true" layout="fixed" width={11} height={20} /></a>
              </div>
              <div className="social--ico">
                <a href="https://www.youtube.com/user/AFTCO1958"><Image src={youtubeWhite} alt="Picture of the author" priority="true" layout="fixed" width={29} height={20} /></a>
              </div>
            </div>
          </div>
          </div>
        </div>
        <div className="copyright mt-100">
          <div className="container flex">
            <p>© {year} AFTCO. All Rights Reserved.</p>
            <div className="most--footer--menu flex">
              <Link href="/policies/terms-of-service"><a className="cl-w mr-30">Terms & Conditions</a></Link>
              <Link href="/policies/privacy-policy"><a className="cl-w mr-30">Privacy Policy</a></Link>
              <a href="https://privacy.saymine.io/AFTCO" className="cl-w mr-30">Do Not Sell My Info</a>
              <Link href="/pages/site-accessibility"><a className="cl-w mr-30">Accessibility</a></Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
