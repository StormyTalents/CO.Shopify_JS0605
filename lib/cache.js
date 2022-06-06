import fs from 'fs'
import path from 'path'
import { getProductSlugs, getAllRedirects } from '@/lib/shopify'
import { searchPopularProd, searchPopularSugges } from '@/lib/klevu'
import { 
  menuEntries, 
  menuItem, 
  variantColor,
  getBadge, 
  getcollectionSlugs, 
  getblogCategoriesSlugs, 
  getPagesSlugs, 
  getAllBlogPost, 
  getFilter, 
  getBannerList, 
  getChainList, 
  getPdpRichText, 
  getTopBar, 
  getAds,
  getGwp,
  getdiscountList,
  getSizeChart 
  } from '@/lib/contentful'
import { getAllReview } from '@/lib/review'

const PRODUCTS_CACHE_PATH = path.resolve('public/cache/.products')
const CONTENFULDATA_CACHE_PATH = path.resolve('public/cache/.contenfuldata')
const REVIEW_CACHE_PATH = path.resolve('public/cache/.review')
const PAGES_CACHE_PATH = path.resolve('public/cache/.pages')
const SHOPIFY_REDIRECT_CACHE_PATH = path.resolve('public/cache/.shopifyredirect')

export async function getAllProducts() {
  let cachedData
  try {
    cachedData = JSON.parse(
      fs.readFileSync(PRODUCTS_CACHE_PATH, 'utf8')
    )
  } catch (error) {
    console.log('products cache not initialized')
  }

  if (!cachedData) {
    const data = await getProductSlugs()

    try {
      fs.writeFileSync(
        PRODUCTS_CACHE_PATH,
        JSON.stringify(data),
        'utf8'
      )
      console.log('Wrote to products cache')
    } catch (error) {
      console.log('ERROR WRITING PRODUCS CACHE TO FILE')
      console.log(error)
    }

    cachedData = data
  }

  return cachedData
}

export async function getContenfulData() {
  let cachedData
  try {
    cachedData = JSON.parse(
      fs.readFileSync(CONTENFULDATA_CACHE_PATH, 'utf8')
    )
  } catch (error) {
    console.log('Contentful cache not initialized')
  }

  if (!cachedData) {
    const menu = await menuEntries()
    const navEntries = await menu.map((n) => {
      return n.fields
    })

    const menuItemData = await menuItem()

    const collections = await getcollectionSlugs()
    const blogCategories = await getblogCategoriesSlugs()
    const pages = await getPagesSlugs()
    const post = await getAllBlogPost()
    const allCat = collections.concat(blogCategories)

    const varColor = await variantColor()
    const vColor = await varColor.map((n) => {
      return n.fields
    })

    const fetchBadge = await getBadge()
    const badge = await fetchBadge.map((n) => {
      return n.fields
    })

    const fetchSizeChart = await getSizeChart()
    const sizeChart = await fetchSizeChart.map((n) => {
      return n.fields
    })

    const fetchDiscount = await getdiscountList()
    const discount = await fetchDiscount.map((n) => {
      return n.fields
    })

    const filter = await getFilter()
    const bannerList = await getBannerList()
    const chainList = await getChainList()
    const pdpRichText = await getPdpRichText()
    const topBar = await getTopBar()
    const ads = await getAds()
    const gwp = await getGwp()

    const searchProd = await searchPopularProd()
    const searchSugges = await searchPopularSugges()
    const searchPopular = {suggestionResults:searchSugges.suggestionResults,queryResults:searchProd.queryResults}

    const contenfulData = {
      "naventries":navEntries, 
      "pdpRichText":pdpRichText, 
      "post": post, 
      "collections":allCat,
      "page":pages,
      "menuSlug":menuItemData, 
      "vColor":vColor, 
      "filter":filter, 
      "bannerList":bannerList, 
      "chainList":chainList, 
      "topBar":topBar, 
      "ads":ads, 
      "badge":badge, 
      "discount":discount,
      "gwp":gwp,
      "sizeChart":sizeChart,
      "searchPopular":searchPopular
    }

    try {
      fs.writeFileSync(
        CONTENFULDATA_CACHE_PATH,
        JSON.stringify(contenfulData),
        'utf8'
      )
      console.log('Wrote to ContentfulData cache')
    } catch (error) {
      console.log('ERROR WRITING ContentfulData CACHE TO FILE')
      console.log(error)
    }

    cachedData = contenfulData
  }

  return cachedData
}

export async function getPages() {
  let cachedData
  try {
    cachedData = JSON.parse(
      fs.readFileSync(PAGES_CACHE_PATH, 'utf8')
    )
  } catch (error) {
    console.log('Review cache not initialized')
  }

  if (!cachedData) {
    const pages = await getPagesSlugs()

    try {
      fs.writeFileSync(
        PAGES_CACHE_PATH,
        JSON.stringify(pages),
        'utf8'
      )
      console.log('Wrote to pages cache')
    } catch (error) {
      console.log('ERROR WRITING PAGES CACHE TO FILE')
      console.log(error)
    }

    cachedData = pages
  }

  return cachedData
}

export async function getSumaryReview(data) {
  let cachedData
  try {
    cachedData = JSON.parse(
      fs.readFileSync(REVIEW_CACHE_PATH, 'utf8')
    )
  } catch (error) {
    console.log('Review cache not initialized')
  }

  if (!cachedData) {
    const review = await getAllReview(data)

    try {
      fs.writeFileSync(
        REVIEW_CACHE_PATH,
        JSON.stringify(review),
        'utf8'
      )
      console.log('Wrote to review cache')
    } catch (error) {
      console.log('ERROR WRITING review CACHE TO FILE')
      console.log(error)
    }

    cachedData = review
  }

  return cachedData
}

export async function getShopifyRedirectPath() {
  let cachedData
  try {
    cachedData = JSON.parse(
      fs.readFileSync(SHOPIFY_REDIRECT_CACHE_PATH, 'utf8')
    )
  } catch (error) {
    console.log('404 path cache not initialized')
  }

  if (!cachedData) {
    const redirects = await getAllRedirects()

    try {
      fs.writeFileSync(
        SHOPIFY_REDIRECT_CACHE_PATH,
        JSON.stringify(redirects),
        'utf8'
      )
      console.log('Wrote to pages cache')
    } catch (error) {
      console.log('ERROR WRITING PAGES CACHE TO FILE')
      console.log(error)
    }

    cachedData = redirects
  }

  return cachedData
}