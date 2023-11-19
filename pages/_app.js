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
