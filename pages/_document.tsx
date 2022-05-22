import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-R7YKD54WV4"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            
              gtag('config', 'G-R7YKD54WV4');
          `
        }} />
        <meta name="description" content="STEPN Calculator is used to calculate the mint cost according to live GST price for both solana and bsc chain." />
        <meta name="keywords" content="stepn, shoe, earning, stepn calculator, web3, crypto, gst, gmt, solana, bsc" />
        <meta property="og:title" content="STEPN Mint Calculator" />
        <meta property="og:description" content="STEPN Calculator is used to calculate the mint cost according to live GST price for both solana and bsc chain." />
        <meta property="og:image" content="https://stepn-mint-calculator.vercel.app/banner.png" />
        <meta property="og:url" content="https://stepn-mint-calculator.vercel.app/" />
        <meta name="twitter:title" content="STEPN Mint Calculator" />
        <meta name="twitter:description" content="STEPN Calculator is used to calculate the mint cost according to live GST price for both solana and bsc chain." />
        <meta property="twitter:url" content="https://stepn-mint-calculator.vercel.app/banner.png" />
        <meta name="twitter:card" content="stepn, shoe, earning, stepn calculator, web3, crypto, gst, gmt, solana, bsc" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@300;400;700&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}