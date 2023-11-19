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
  return (
    <>
      <SEO pageTitle={"GPT Category"} />
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
