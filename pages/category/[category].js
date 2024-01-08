// pages/category/[category].js

import React from "react";
import GPTList from "../../components/GPT/GPTList"; // Assume this component lists GPTs in a category
import Header from "../../components/Home/Header";
import SEO from "../../components/seo";
import Footer from "../../components/Home/Footer";
import {
  findDocumentsByCategory,
  findAllCategories,
} from "../../utils/mongodbUtil";

const CategoryPage = ({ gpts, params }) => {
  const metaTitle = `${params.category} Custom GPTs - Find the Best Custom GPTs for Your Needs`;
  const metaDescription = `Explore a wide range of Custom GPTs in the ${params.category} category. Find the perfect Custom GPT to match your specific requirements.`;
  const metaKeywords = `GPT, AI, ${params.category}, ChatGPT, Artificial Intelligence Custom GPT`;
  const metaImage = "https://findgptpro.com/category/findgptpro-category.jpg";
  const currentPageUrl = `https://findgptpro.com/category/${params.category}`;

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={metaImage} />
        <meta property="og:url" content={currentPageUrl} />
        <meta property="og:type" content="website" />
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={metaImage} />
        {/* Add other necessary meta tags here */}
      </Head>
      <Header />
      <div className="section__title-wrapper text-center mb-5 mt-5">
        <h2 className="section__title">GPTs for {params.category}</h2>
      </div>
      <GPTList gpts={gpts} />
      <Footer />
    </>
  );
};

export default CategoryPage;

export async function getStaticProps({ params }) {
  try {
    let gpts = await findDocumentsByCategory(params.category);

    if (!gpts.length) {
      return { notFound: true };
    }

    // Convert _id to a string
    gpts = gpts.map((gpt) => {
      return {
        ...gpt,
        _id: gpt._id.toString(),
      };
    });

    return {
      props: {
        gpts,
        params,
      },
      revalidate: 86400, // In seconds
    };
  } catch (error) {
    console.error("Error fetching GPTs by category:", error);
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  try {
    const categories = await findAllCategories();
    const paths = categories.map((category) => {
      return { params: { category } };
    });

    return { paths, fallback: false };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { paths: [], fallback: false };
  }
}
