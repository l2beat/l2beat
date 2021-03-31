import '../styles/globals.scss'

import Head from 'next/head'

function MyApp({ Component, pageProps }: { Component: React.ComponentProps<any>; pageProps: any }) {
  return (
    <>
      <Head>
        <title>L2Beat</title>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap" rel="stylesheet" />

        <script async src="https://www.googletagmanager.com/gtag/js?id=G-WNXQPBZQ4Y"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-WNXQPBZQ4Y');`,
          }}
        ></script>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
