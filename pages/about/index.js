import React from 'react';
import AboutArea from '../../components/About/AboutArea';
import BgShape from '../../components/common/BgShape';
import Footer from '../../components/Home/Footer';
import Header from '../../components/Home/Header';
import SEO from '../../components/seo';

const About = () => {
   return (
      <>
         <SEO pageTitle={'About'} />
         <Header />
         <BgShape />
         <AboutArea />
         <Footer />
      </>
   );
};

export default About;