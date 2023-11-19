// pages/search-results.js

import React from "react";
import { useRouter } from "next/router";
import SEO from "../components/seo";
import Header from "../components/Home/Header";
import Footer from "../components/Home/Footer";
import HomeThreeHeroArea from "../components/Home/HomeThreeHeroArea";
import HomeSearchCard from "../components/Home/HomeSearchCard";

const SearchResults = () => {
  const router = useRouter();
  const { term } = router.query;

  // Fetch the search results based on the term or pass it to a component that will

  return (
    <>
      <SEO pageTitle={`Search Results for "${term}"`} />
      <Header />
      <HomeThreeHeroArea />
      <HomeSearchCard searchTermObj={term} />
      <Footer />
    </>
  );
};

export default SearchResults;
