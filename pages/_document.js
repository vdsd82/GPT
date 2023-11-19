// pages/_document.js
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
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
          <meta property="og:url" content="https://www.findgptpro.com" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="FindGPTPro.com" />
          <meta
            property="og:description"
            content="Explore our curated collection of third-party GPT models, offering diverse AI solutions. From creative writing aids to sophisticated data analysis tools, find the perfect GPT to elevate your project or business with advanced machine learning capabilities. Dive into the world of GPTs and unlock new possibilities today!"
          />
          <meta
            property="og:image"
            content="https://www.findgptpro.com/ss/DefaultImage.png"
          />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@FindGPTPro" />
          <meta name="twitter:title" content="FindGPTPro.com" />
          <meta
            name="twitter:description"
            content="Explore our curated collection of third-party GPT models, offering diverse AI solutions. From creative writing aids to sophisticated data analysis tools, find the perfect GPT to elevate your project or business with advanced machine learning capabilities. Dive into the world of GPTs and unlock new possibilities today!"
          />
          <meta
            name="twitter:image"
            content="https://www.findgptpro.com/ss/DefaultImage.png"
          />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
