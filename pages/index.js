import React from "react";

import HomeThreegpt from "../components/Home/HomeRandomCard";
import Header from "../components/Home/Header";
import HomeThreeHeroArea from "../components/Home/HomeThreeHeroArea";
import GPTCategories from "../components/GPT/GPTCategories";
import SEO from "../components/seo";
import Footer from "../components/Home/Footer";
import HomeRandomCard from "../components/Home/HomeRandomCard";

const index = ({ allPosts }) => {
  return (
    <>
      <SEO pageTitle={"Home Three"} />
      <Header />
      <HomeThreeHeroArea />
      <GPTCategories />
      <HomeRandomCard />
      <Footer />
    </>
  );
};

export default index;
