const path = require('path')
const withPWA = require('next-pwa')
const runtimeCaching = require("next-pwa/cache");

module.exports = withPWA({
  reactStrictMode: true,
  pwa: {
    dest: "public",
		register: true,
		skipWaiting: true,
		runtimeCaching,
    disable: process.env.NODE_ENV === 'development',
		buildExcludes: [/middleware-manifest.json$/]
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  env: {
    siteTitle: 'Vented Button Down / Up Fishing Shirts | UPF Sun Protection | AFTCO',
    siteDescription: 'Men"s Button Down / Button Up casual fishing shirts come in short and long sleeve, vented to keep cool in hot weather and AFBLOCK UPF sun protection to help protect you from harmful UV rays for your next fishing trip. Wear on the boat or at the bar and live the fishing lifestyle with AFTCO Button Down Fishing Shirts.',
    siteKeywords: 'Vented Button Down / Up Fishing Shirts | UPF Sun Protection | AFTCO',
    siteUrl: 'https://aftco.com/',
    siteImagePreviewUrl: '/images/main.jpg',
    twitterHandle: '@donato'
  },
  images: {
    domains: ['cdn.shopify.com', 'images.ctfassets.net', 'cdn.stamped.io', 'downloads.ctfassets.net'],
  }
})
