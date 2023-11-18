import React from 'react';

import HomeThreeBlog from '../components/Home/HomeThreeBlog';
import Header from '../components/Home/Header';
import HomeThreeHeroArea from '../components/Home/HomeThreeHeroArea';
import SEO from '../components/seo';
import Footer from '../components/Home/Footer';
import { getAllPosts } from '../components/common/apicalculator';


const index = ({allPosts}) => {
   return (
      <>
         <SEO pageTitle={'Home Three'} />
         <Header />
         <HomeThreeHeroArea />
         <HomeThreeBlog posts={allPosts}/>
         <Footer />
      </>
   );
};

export default index;

export async function getStaticProps() {
   const allPosts = getAllPosts([
         'title',
         'date',
         'slug',
         'category',
         'user_img',
         'name',
         'coverImage',
         'desc',
         'content'])
    
      return {
        props:  {

         allPosts
       } 
      }
    }