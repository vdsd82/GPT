// pages/gpt-details/[webId].js

import React from "react";
import GPTDetailsArea from "../../components/GPTDetails/GPTDetailsArea";
import BgShape from "../../components/common/BgShape";
import Header from "../../components/Home/Header";
import SEO from "../../components/seo";
import Footer from "../../components/Home/Footer";
import { findDocumentByWebId, findAllDocuments } from "../../utils/mongodbUtil";

const gptDetails = ({ post }) => {
  // Ensure that post is not null before trying to access its properties
  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <>
      <SEO pageTitle={"GPT Details"} />
      <Header />
      <BgShape />
      <GPTDetailsArea posts={post} />
      <Footer />
    </>
  );
};

export default gptDetails;

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
