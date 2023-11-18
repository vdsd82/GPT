import React from "react";
import gptArea from "../../components/gpt/gptArea";
import gptBreadCrumb from "../../components/gpt/gptBreadCrumb";
import BgShape from "../../components/common/BgShape";
import Footer from "../../components/Home/Footer";
import Header from "../../components/Home/Header";
import SEO from "../../components/seo";
import {
  getPostBySlug,
  getAllPosts,
} from "../../components/common/apicalculator";

const index = ({ allPosts }) => {
  return (
    <>
      <SEO pageTitle={"gpt"} />
      <Header />
      <BgShape />
      <gptBreadCrumb />
      <gptArea posts={allPosts} />
      <Footer />
    </>
  );
};

export default index;

export async function getStaticProps() {
  const allPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "category",
    "user_img",
    "name",
    "coverImage",
    "desc",
    "content",
  ]);

  return {
    props: {
      allPosts,
    },
  };
}
