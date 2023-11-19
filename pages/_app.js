import React from "react";
import { Provider } from "react-redux";
import "react-responsive-modal/styles.css";
import "./index.scss";
import { store } from "../redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head"; // Import Head from Next.js

import SEO from "../components/seo";
if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Google Tag Manager */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-P1EZJR43SJ"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-P1EZJR43SJ');
            `,
          }}
        />

        <meta
          property="og:url"
          content={meta.url || "https://www.findgptpro.com"}
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={meta.title || "FindGPTPro.com"} />
        <meta
          property="og:description"
          content={
            meta.description ||
            "Explore our curated collection of third-party GPT models, offering diverse AI solutions. From creative writing aids to sophisticated data analysis tools, find the perfect GPT to elevate your project or business with advanced machine learning capabilities. Dive into the world of GPTs and unlock new possibilities today!"
          }
        />
        <meta
          property="og:image"
          content={
            meta.image || "https://www.findgptpro.com/ss/DefaultImage.png"
          }
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@FindGPTPro" />
        <meta name="twitter:title" content={meta.title || "FindGPTPro.com"} />
        <meta
          name="twitter:description"
          content={
            meta.description ||
            "Explore our curated collection of third-party GPT models, offering diverse AI solutions. From creative writing aids to sophisticated data analysis tools, find the perfect GPT to elevate your project or business with advanced machine learning capabilities. Dive into the world of GPTs and unlock new possibilities today!"
          }
        />
        <meta
          name="twitter:image"
          content={
            meta.image || "https://www.findgptpro.com/ss/DefaultImage.png"
          }
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>
      <SEO
        font={
          "https://fonts.googleapis.com/css2?family=Be+Vietnam:wght@300;400;500;600;700;800&display=swap"
        }
      />
      <Provider store={store}>
        <Component {...pageProps} />
        <ToastContainer />
      </Provider>
    </>
  );
}

export default MyApp;
