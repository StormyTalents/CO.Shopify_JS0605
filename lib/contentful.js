const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN

const client = require('contentful').createClient({
  space: space,
  accessToken: accessToken,
})

const aftcoClient = require('contentful').createClient({
  space: 'vypp6kxkjn7l',
  accessToken: 'CZRaIX910RmS-OEFcaonRPXkDi8Uajc6g07OXHl3pOY',
})

export async function menuEntries() {
  const entries = await aftcoClient.getEntries({'content_type': 'menu'})
  if (entries.items) return entries.items
  console.log(`Error getting Entries for ${contentType.name}.`)
} 

export async function menuItem() {
  const entries = await aftcoClient.getEntries({'content_type': 'menuItem','limit':500})
  if (entries.items) return entries.items
  console.log(`Error getting Entries for ${contentType.name}.`)
}

export async function variantColor() {
  const entries = await aftcoClient.getEntries({'content_type': 'variantColor','limit':500})
  if (entries.items) return entries.items
  console.log(`Error getting Entries for ${contentType.name}.`)
}

export async function getBadge() {
  const entries = await aftcoClient.getEntries({'content_type': 'badge','limit':500})
  if (entries.items) return entries.items
  console.log(`Error getting Entries for ${contentType.name}.`)
}

export async function getTechIco() {
  const entries = await aftcoClient.getEntries({'content_type': 'techIcons'})
  if (entries.items) return entries.items
  console.log(`Error getting Entries for ${contentType.name}.`)
}

export async function getPdpBadge() {
  const entries = await aftcoClient.getEntries({'content_type': 'pdpBadge'})
  if (entries.items) return entries.items
  console.log(`Error getting Entries for ${contentType.name}.`)
}

export async function getSizeChart() {
  const entries = await aftcoClient.getEntries({'content_type': 'sizeCharts'})
  if (entries.items) return entries.items
  console.log(`Error getting Entries for ${contentType.name}.`)
}

export async function getcollectionSlugs() {
  const entries = await aftcoClient.getEntries({'content_type': 'collections','limit':1000})
  if (entries.items) return entries.items 
  console.log(`Error getting Entries for ${contentType.name}.`)
}

export async function getblogCategoriesSlugs() {
  const entries = await aftcoClient.getEntries({'content_type': 'blogCategories','limit':1000})
  if (entries.items) return entries.items
  console.log(`Error getting Entries for ${contentType.name}.`)
}

export async function getSingleblogCategories(slug) {
  const entries = await aftcoClient.getEntries({'content_type': 'blogCategories', 'fields.slug': slug,'limit':1000})
  if (entries.items) return entries.items
  console.log(`Error getting Entries for ${contentType.name}.`)
}

export async function getPagesSlugs() {
  const entries = await aftcoClient.getEntries({'content_type': 'page','limit':1000})
  if (entries.items) return entries.items
  console.log(`Error getting Entries for ${contentType.name}.`)
}

export async function getPagesSlugsTest() {
  const entries = await aftcoClient.getEntries({'content_type': 'page','limit':1000, 'links_to_entry':'mPOiy74AiRhD8ZffJ7CQl'})
  if (entries.items) return entries.items
  console.log(`Error getting Entries for ${contentType.name}.`)
}
 
export async function getAllBlogPost() {
  const entries = await aftcoClient.getEntries({'content_type': 'blog','limit':1000, 'order': '-fields.publishDate'})
  if (entries.items) return entries.items
  console.log(`Error getting Entries for ${contentType.name}.`)
}

export async function getSingleBlogPost(slug) {
  const entries = await aftcoClient.getEntries({'content_type': 'blog','fields.slug': slug,'limit':1000})
  if (entries.items) return entries.items
  console.log(`Error getting Entries for ${contentType.name}.`)
}

export async function getGroupOfBlogCat() {
  const entries = await aftcoClient.getEntries({'content_type': 'blogGroupOfCategories','limit':1000})
  if (entries.items) return entries.items
  console.log(`Error getting Entries for ${contentType.name}.`)
}

export async function getFilter() {
  const entries = await aftcoClient.getEntries({'content_type': 'filter','limit':1000})
  if (entries.items) return entries.items
  console.log(`Error getting Entries for ${contentType.name}.`)
}

export async function getGwp() {
  const entries = await aftcoClient.getEntries({'content_type': 'relatedAddToCart','limit':100})
  if (entries.items) return entries.items
  console.log(`Error getting Entries for ${contentType.name}.`)
}

export async function getBannerList() {
  const entries = await aftcoClient.getEntries({'content_type': 'productsBannerList','limit':1000})
  if (entries.items) return entries.items
  console.log(`Error getting Entries for ${contentType.name}.`)
}

export async function getChainList() {
  const entries = await aftcoClient.getEntries({'content_type': 'chainProduct'})
  if (entries.items) return entries.items
  console.log(`Error getting Entries for ${contentType.name}.`)
}

export async function getPdpRichText() {
  const entries = await aftcoClient.getEntries({'content_type': 'richText','limit':1000})
  if (entries.items) return entries.items
  console.log(`Error getting Entries for ${contentType.name}.`)
}

export async function getGroupOfCollection() {
  const entries = await aftcoClient.getEntries({'content_type': 'groupOfCOllection','limit':1000})
  if (entries.items) return entries.items
  console.log(`Error getting Entries for ${contentType.name}.`)
}

export async function getAds() {
  const entries = await aftcoClient.getEntries({'content_type': 'ads'})
  if (entries.items) return entries.items
  console.log(`Error getting Entries for ${contentType.name}.`)
}

export async function getdiscountList() {
  const entries = await aftcoClient.getEntries({'content_type': 'discount','limit':1000})
  if (entries.items) return entries.items
  console.log(`Error getting Entries for ${contentType.name}.`)
}

export async function getVipdiscountList() {
  const entries = await aftcoClient.getEntries({'content_type': 'vipDiscount'})
  if (entries.items) return entries.items
  console.log(`Error getting Entries for ${contentType.name}.`)
}

export async function getTopBar() {
  const entries = await aftcoClient.getEntries({'content_type': 'topBar'})
  if (entries.items) return entries.items
  console.log(`Error getting Entries for ${contentType.name}.`)
}

export async function getRedirectList() {
  const entries = await aftcoClient.getEntries({'content_type': 'redirectList','limit':1000})
  if (entries.items) return entries.items
  console.log(`Error getting Entries for ${contentType.name}.`)
}

export async function getRelatedBlogPost(product, collections, productType ) {
  let collection
    collections ?
    collection = collections.map((collection) => (
      collection.node.handle
    )) : "";
    let blog
    collection ? blog = collection.join(",") :""
  const blogByHandle = await aftcoClient.getEntries({'content_type': 'blog', 'fields.productHandle[in]':product})
  const blogByCollections = await aftcoClient.getEntries({'content_type': 'blog', 'fields.productCategory[in]':blog})
  const blogByType = await aftcoClient.getEntries({'content_type': 'blog', 'fields.productCategory[in]':productType})
  const blogByHandleTag = await aftcoClient.getEntries({'content_type': 'blog', 'fields.tags[in]':product})
  const blogByCollectionsTag = await aftcoClient.getEntries({'content_type': 'blog', 'fields.tags[in]':blog})
  const blogByTypeTag = await aftcoClient.getEntries({'content_type': 'blog', 'fields.tags[in]':productType})
  const latestPost = await aftcoClient.getEntries({'content_type': 'blog', 'limit':5})
  const allPost = blogByHandle.items.concat(blogByCollections.items, blogByType.items, latestPost.items, blogByHandleTag.items, blogByCollectionsTag.items, blogByTypeTag.items ).slice(0, 5);
  const jsonObject = allPost.map(JSON.stringify);
  const uniqueSet = new Set(jsonObject);
  const uniqueArray = Array.from(uniqueSet).map(JSON.parse);
  if (uniqueArray) 
  return uniqueArray
  console.log(`Error getting Entries for ${contentType.name}.`)
}

async function getNavData(navs, contenfulData) {
  const menuItem = contenfulData.menuSlug
  const menuData = menuItem.concat(contenfulData.page, contenfulData.post, contenfulData.collections)
  let entryNeeded = []
  navs.map((menu) => {
    menu.menuItem.map((item) => {
      const mainMenuData = menuData.find((idxs) => {
        return idxs.sys.id === item.sys.id;
        })
        if (mainMenuData != undefined) {
          entryNeeded.push(mainMenuData)
        }
      <>
      {item.fields.featured?
        item.fields.featured.map((featured) =>
        {
          const featuredData = menuData.find((idxs) => {
            return idxs.sys.id === featured.sys.id;
            })
            if (featuredData != undefined) {
              entryNeeded.push(featuredData)
            }
        }
        )
      :""}
      {item.fields.subMenu?
        item.fields.subMenu.map((subMenu) =>
        {
          const subMenuData = menuData.find((idxs) => {
            return idxs.sys.id === subMenu.sys.id;
            })
            if (subMenuData != undefined) {
              entryNeeded.push(subMenuData)
            }
        }
        )
      :""
      }
      </>
    })
  })

  entryNeeded.map((data) =>
    data.fields.subMenu?
      data.fields.subMenu.map((subMenu) =>
      {
        const subMenuData = menuData.find((idxs) => {
          return idxs.sys.id === subMenu.sys.id;
          })
          if (subMenuData != undefined) {
            entryNeeded.push(subMenuData)
          }
      }
      )
    :""
  )
  return entryNeeded
}
export async function getNavDataNeeded(navs, contenfulData) {
 const navsData = await getNavData(navs, contenfulData)
 const dataNeeded = navsData.reduce(function(a,b){
  if (a.findIndex(img => img.sys.id === b.sys.id) < 0 ) a.push(b);
  return a;
},[]);
 const myJSON = JSON.stringify(dataNeeded)
 const obj = JSON.parse(myJSON)
 obj.map(data => {
   if(data.hasOwnProperty('metadata')) {
    delete data.metadata
   }
   if(data.fields.hasOwnProperty('content')) {
    delete data.fields.content
   }
   if(data.fields.hasOwnProperty('meta_Description')) {
    delete data.fields.meta_Description
   }
   if(data.fields.hasOwnProperty('metaTitleTag')) {
    delete data.fields.metaTitleTag
   }
   if(data.fields.hasOwnProperty('shopifySource')) {
    delete data.fields.shopifySource
   }
   if(data.fields.hasOwnProperty('heroImage')) {
    delete data.fields.heroImage
   }
   if(data.fields.hasOwnProperty('subTag')) {
    delete data.fields.subTag
   }
 })
 return obj
}

export async function getRichTextDataNeeded(contents, contenfulData) {
let bannerList = []
let blogCat = []
let ColforPage = []
let featuredPost = []
let latestPost = null
  contents.map(content =>{
    const nodeType = content.nodeType
    if(nodeType == "embedded-entry-block") {
      const type = content.data.target.sys.contentType.sys.id
      if (type == "productsBanner") {
        content.data.target.fields.productList.map(prod => { 
          const prodData = contenfulData.bannerList.find((idxs) => {
            return idxs.sys.id === prod.sys.id;
            })
            if (prodData != undefined) {
              bannerList.push(prodData)
            }
            if(prodData.fields.contentSource && prodData.fields.contentSource.fields.blogCategory) {
              const blogCatData = contenfulData.collections.find((idxs) => {
                return idxs.sys.id === prodData.fields.contentSource.fields.blogCategory.sys.id;
                })
                if (blogCatData != undefined) {
                  blogCat.push(blogCatData)
                }
            }
        })
      }
      if (type == "productsList" && content.data.target.fields.collection) {
        const prodData = contenfulData.collections.find((idxs) => {
          return idxs.sys.id === content.data.target.fields.collection.sys.id;
          })
          if (prodData != undefined) {
            ColforPage.push(prodData)
          }
      }
      if (type == "featuredCateggories") {
        content.data.target.fields.categoriesList.map(col => {
          const colData = contenfulData.collections.find((idxs) => {
            return idxs.sys.id === col.sys.id;
            })
            if (colData != undefined) {
              blogCat.push(colData)
            }
        })
      }
      if (type == "featuredPost") {
        const type = content.data.target.fields.type
        if( type == "Based on post entries" ) {
          const postList = content.data.target.fields.postList
          postList.map(list => {
            featuredPost.push(contenfulData.post.find((idxs) => {
              return idxs.sys.id === list.sys.id; 
            }))
          })
        }
        else if( type == "Latest Post" ) {
          const numberOfPost = content.data.target.fields.maxPost
          latestPost = contenfulData.post.slice(0, numberOfPost)
        }
        else {
          const catList = content.data.target.fields.categoriesList
          catList.map(list => {
            const catDetail = contenfulData.collections.find((idxs) => {
              return idxs.sys.id === list.sys.id;
            })
            const post = contenfulData.post.filter((idxs) => {

              let id
              if (idxs.fields.blogCategory){
                  id = idxs.fields.blogCategory.sys.id
              }
              else {
                  id = null
              }
              return id === list.sys.id;
            })
            post.map((data,i) =>{i<5?featuredPost.push(data):""})
            blogCat.push(catDetail)
          })
        }
      }
    }
  })
  const richtext = {"bannerList":bannerList,"post":featuredPost,"latestPost":latestPost,"blogCat":blogCat,"ColforPage":ColforPage}
  return richtext
}

export default { 
  menuEntries, 
  menuItem, 
  variantColor, 
  getblogCategoriesSlugs, 
  getcollectionSlugs, 
  getPagesSlugs, 
  getAllBlogPost, 
  getSingleBlogPost, 
  getRelatedBlogPost, 
  getFilter, 
  getBannerList, 
  getChainList, 
  getPdpRichText, 
  getNavDataNeeded, 
  getRichTextDataNeeded, 
  getTopBar
}