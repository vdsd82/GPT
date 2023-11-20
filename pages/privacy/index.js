import React from "react";
import PrivacyArea from "../../components/Privacy/PrivacyArea";
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
      <PrivacyArea />
      <Footer />
    </>
  );
};

export default About;
