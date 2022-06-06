import Head from 'next/head'
import Script from 'next/script'

function SEO({ title, description }) {
  // customize meta properties
  // you can pass them as an argument like title in case you want to change for each page
  const deafaultDescription = `Family Owned & Operated, AFTCO represents a tradition of high performance precision-built fishing gear. Since 1958, AFTCO has been the leader in Men's, Women's and Kid's fishing clothing, tackle & performance apparel worn across the globe for fresh and salt water Angler's ready to catch any fish, any water.`
  const defaultTitle = "AFTCO | American Fishing Tackle Company"
  const keywords = "American Fishing Tackle"
  const siteURL = "https://aftco.com/"
  const siteName = "AFTCO"
  const img = "https://cdn.shopify.com/s/files/1/1127/7790/files/logo-white.png"

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="description" content={ description ? description : deafaultDescription } />
        <meta name="keywords" content={keywords} />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" key="twcard" />
        <meta name="twitter:site" content="@" />
        <meta name="twitter:title" content={ title ? title : defaultTitle } />
        <meta name="twitter:description" content={ description ? description : deafaultDescription } />
        <meta name="theme-color" content="#1b3668" />

        {/* Open Graph */}
        <meta property="og:url" content={siteURL} key="ogurl" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={siteName} key="ogsitename" />
        <meta property="og:title" content={ title ? title : defaultTitle } key="ogtitle" />
        <meta property="og:description" content={ description ? description : deafaultDescription } key="ogdesc" />
        <meta property="og:image" content={img} />
        <meta property="og:image:secure_url" content={img} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="628" />
        <title>{ title ? title : defaultTitle }</title>
        <link rel="manifest" href="/manifest.json" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap" rel="stylesheet" />
        <link
          href="/icons/logo-ico.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
          purpose="any maskable"
        />
        <link
          href="/icons/logo-ico.png" 
          rel="icon"
          type="image/png"
          sizes="32x32"
          purpose="any maskable"
        />
        <link rel="apple-touch-icon" href="/apple-icon.png"></link>
        <link
          rel="preload"
          href="/font/AktivGrotesk-Regular.ttf"
          as="font"
          crossOrigin="" 
        />
        <link
          rel="preload"
          href="/font/AktivGrotesk-Medium.ttf"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/font/AktivGrotesk-XBold.ttf"
          as="font"
          crossOrigin=""
        />
        <script>
            window.GORGIASCHAT_DISABLE_AUTO_OPEN = true
        </script>
      </Head> 

      <Script async id="gorgias-chat-widget-install" dangerouslySetInnerHTML={
            { __html: `
            !function(_){_.GORGIAS_CHAT_APP_ID="1558",_.GORGIAS_CHAT_BASE_URL="us-east1-898b.production.gorgias.chat",_.GORGIAS_API_BASE_URL="config.gorgias.chat";var e=new XMLHttpRequest;e.open("GET","https://config.gorgias.chat/applications/1558",!0),e.onload=function(t){if(4===e.readyState)if(200===e.status){var n=JSON.parse(e.responseText);if(!n.application||!n.bundleVersion)throw new Error("Missing fields in the response body - https://config.gorgias.chat/applications/1558");if(_.GORGIAS_CHAT_APP=n.application,_.GORGIAS_CHAT_BUNDLE_VERSION=n.bundleVersion,n&&n.texts&&(_.GORGIAS_CHAT_TEXTS=n.texts),n&&n.sspTexts&&(_.GORGIAS_CHAT_SELF_SERVICE_PORTAL_TEXTS=n.sspTexts),!document.getElementById("gorgias-chat-container")){var o=document.createElement("div");o.id="gorgias-chat-container",document.body.appendChild(o);var r=document.createElement("script");r.setAttribute("defer",!0),r.src="https://client-builds.production.gorgias.chat/{bundleVersion}/static/js/main.js".replace("{bundleVersion}",n.bundleVersion),document.body.appendChild(r)}}else console.error("Failed request GET - https://config.gorgias.chat/applications/1558")},e.onerror=function(_){console.error(_)},e.send()}(window||{});
            `}
        } strategy="lazyOnload"/>
        
      <Script 
        async 
        id="wknd" 
        src="https://tag.wknd.ai/4988/i.js"
        strategy="afterInteractive"
      />

    </>
  )
}

export default SEO
