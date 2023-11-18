import React from "react";
import GPTDetailsArea from "../../components/gptDetails/gptDetailsArea";
import BgShape from "../../components/common/BgShape";
import Header from "../../components/Home/Header";
import SEO from "../../components/seo";
import Footer from "../../components/Home/Footer";

const gptDetails = ({ post }) => {
  return (
    <>
      <SEO pageTitle={"GPT Details"} />
      <Header />
      <BgShape />
      <GPTDetailsArea webId={post.web_id} />
      <Footer />
    </>
  );
};

export default gptDetails;

// You receive `params` from the URL and use it to fetch data
export async function getStaticProps({ params }) {
  // Fetch the specific post using the `web_id` (or slug)
  console.log(params);
  const res = await fetch(
    `${process.env.SITE_URL}/api/random-document?web_id=${params.slug}`
  );
  const post = await res.json();

  // Pass the fetched post to the component
  return {
    props: {
      post, // Directly pass the fetched post
    },
    revalidate: 86400, // In seconds
  };
}

export async function getStaticPaths() {
  // Fetch your data, which includes the slugs
  console.log(`${process.env.SITE_URL}/api/random-document?all=true`);
  const res = await fetch(
    `${process.env.SITE_URL}/api/random-document?all=true`
  );
  const posts = await res.json();

  // Create paths with `slug` parameter
  const paths = posts.map((post) => {
    return {
      params: {
        slug: post.web_id.toString(), // Make sure `web_id` is the field you want to use as a slug
      },
    };
  });

  return {
    paths,
    fallback: false, // or 'blocking' if you want to enable ISR for new paths
  };
}
