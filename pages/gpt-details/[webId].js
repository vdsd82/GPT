// pages/gpt-details/[webId].js

import React from "react";
import GPTDetailsArea from "../../components/GPTDetails/GPTDetailsArea";
import BgShape from "../../components/common/BgShape";
import Header from "../../components/Home/Header";
import SEO from "../../components/seo";
import Footer from "../../components/Home/Footer";
import { findDocumentByWebId, findAllDocuments } from "../../utils/mongodbUtil";
import Head from "next/head";

const gptDetails = ({ post }) => {
  // Ensure that post is not null before trying to access its properties
  if (!post) {
    return <div>Post not found</div>;
  }
  let keywords = `${post.Title}, GPT, AI, Technology, ChatGPT, Artificial Intelligence`;
  if (post.Tags && post.Tags !== "NaN") {
    keywords += `, ${post.Tags}`;
  }
  const metaTitle = `${post.Title} - In-depth Analysis and Details`;
  const metaDescription = `Custom GPT | ${post.Description}`;
  const metaImage = "https://findgptpro.com/details/findgptpro.jpg";
  const currentPageUrl = `https://findgptpro.com/details/${post.web_id}`;

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={metaImage} />
        <meta property="og:url" content={currentPageUrl} />
        <meta name="keywords" content={keywords} />
        <meta property="og:type" content="article" />
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={metaImage} />
        {/* Add other necessary meta tags here */}
      </Head>
      <Header />
      <BgShape />
      <GPTDetailsArea webId={post.web_id} />
      <Footer />
    </>
  );
};

export default gptDetails;
//Test

export async function getStaticProps({ params }) {
  try {
    const post = await findDocumentByWebId(params.webId);

    if (!post) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        post,
      },
      revalidate: 86400, // In seconds
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return {
      notFound: true,
    };
  }
}

export async function getStaticPaths() {
  try {
    const posts = await findAllDocuments();
    const paths = posts.map((post) => {
      // Make sure `web_id` is a property in your documents
      // Also ensure that `web_id` is converted to a string if it's not already
      return { params: { webId: post.web_id.toString() } };
    });

    return { paths, fallback: false };
  } catch (error) {
    console.error("Error fetching paths:", error);
    return { paths: [], fallback: false };
  }
}
