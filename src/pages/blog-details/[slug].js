import React from 'react';
import BlogDetailsArea from '../../components/BlogDetails/BlogDetailsArea';
import BgShape from '../../components/common/BgShape';
import Header from '../../components/Home/Header';
import SEO from '../../components/seo';
import Footer from '../../components/Home/Footer';
import { getPostBySlug, getAllPosts } from '../../components/common/apicalculator';


const BlogDetails = ({post}) => {

   return (
      <>
         <SEO pageTitle={'Blog Details'} />
         <Header />
         <BgShape />
         <BlogDetailsArea posts={post}/>
         <Footer />
      </>
   );
};

export default BlogDetails;


    export async function getStaticProps({ params }) {
      const post = getPostBySlug(params.slug, [
         'title',
         'date',
         'slug',
         'category',
         'user_img',
         'name',
         'coverImage',
         'desc',
         'content',
      ])
      const allPosts = getAllPosts([
         'title',
         'date',
         'slug',
         'category',
         'user_img',
         'name',
         'coverImage',
         'desc',
         'content'
      ])
      return {
        props: {
          post: {
            ...post,allPosts
          },
          revalidate: 86400, // In seconds
        },
      }
    }
    
    export async function getStaticPaths() {
      const posts = getAllPosts(['slug'])
    
      return {
        paths: posts.map((post) => {
          return {
            params: {
              slug: post.slug,
            },
          }
        }),
        fallback: false,
      }
    }