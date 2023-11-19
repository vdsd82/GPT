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

const CategoryPage = ({ gpts }) => {
  return (
    <>
      <SEO pageTitle={"GPT Category"} />
      <Header />
      <GPTList gpts={gpts} />
      <Footer />
    </>
  );
};

export default CategoryPage;

export async function getStaticProps({ params }) {
  try {
    const gpts = await findDocumentsByCategory(params.category);

    if (!gpts.length) {
      return { notFound: true };
    }

    return {
      props: {
        gpts,
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
