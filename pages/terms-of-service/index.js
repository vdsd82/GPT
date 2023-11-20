import React from "react";
import TermsServiceArea from "../../components/Terms/TermsArea";
import BgShape from "../../components/common/BgShape";
import Footer from "../../components/Home/Footer";
import Header from "../../components/Home/Header";
import SEO from "../../components/seo";

const About = () => {
  return (
    <>
      <SEO pageTitle={"About"} />
      <Header />
      <BgShape />
      <TermsServiceArea />
      <Footer />
    </>
  );
};

export default About;
