import { getAllProducts, getContenfulData, getSumaryReview } from "@/lib/cache";
import SEO from "@/components/SEO";
import RichText from "@/components/richtext";
import { getProdNeeded, getCollectionDetailRichText } from "@/lib/shopify";
import {
  getNavDataNeeded,
  getRichTextDataNeeded,
  getPagesSlugs,
} from "@/lib/contentful";
import { getReviewNeeded } from "@/lib/review";

function IndexPage({
  pageContent,
  basicProdData,
  products,
  richTextData,
  reviewNeeded,
  productsCollection,
}) {
  return (
    <div className="home--index--page">
      <SEO
        title={
          pageContent.fields.metaTitleTag
            ? pageContent.fields.metaTitleTag
            : `${pageContent.fields.title} - AFTCO`
        }
        description={
          pageContent.fields.meta_Description
            ? pageContent.fields.meta_Description
            : null
        }
      />
      <RichText
        content={pageContent.fields.content.content}
        products={products}
        headerTitle={"No"}
        basicProdData={basicProdData}
        richTextData={richTextData}
        reviews={reviewNeeded}
        nostoProd={"home"}
        productsCollection={productsCollection}
      />
    </div>
  );
}

export async function getStaticProps() {
  const allProducts = await getAllProducts();
  const contenfulData = await getContenfulData();
  const pages = await getPagesSlugs();
  const searchPopular = contenfulData.searchPopular;

  const pageContent = pages.find((idxs) => {
    return idxs.fields.slug === "home";
  });
  const products = await getProdNeeded(
    pageContent.fields.content.content,
    allProducts,
    contenfulData.bannerList
  );
  const prodIds = allProducts.map((prodId) => {
    const prodIdsUrl = Buffer.from(prodId.node.id, "base64").toString("binary");
    const realProdId = prodIdsUrl.replace("gid://shopify/Product/", "");
    return {
      productId: realProdId,
    };
  });

  const richTextData = await getRichTextDataNeeded(
    pageContent.fields.content.content,
    contenfulData
  );
  let productsCollection = null;

  if (richTextData.ColforPage.length != 0) {
    productsCollection = await getCollectionDetailRichText(
      richTextData.ColforPage
    );
  }

  const basicProdData = {
    vColor: contenfulData.vColor,
    filter: contenfulData.filter,
    chainList: contenfulData.chainList,
    badge: contenfulData.badge,
    discount: contenfulData.discount,
    gwp: contenfulData.gwp,
  };
  const reviews = await getSumaryReview(prodIds);
  const reviewNeeded = await getReviewNeeded(products, reviews);
  const navs = contenfulData.naventries;
  const navsData = await getNavDataNeeded(navs, contenfulData);
  const topBar = contenfulData.topBar[0].fields.contents.content;

  return {
    props: {
      pageContent,
      basicProdData,
      products,
      navs,
      navsData,
      richTextData,
      reviewNeeded,
      topBar,
      productsCollection,
      searchPopular,
    },
  };
}

export default IndexPage;
