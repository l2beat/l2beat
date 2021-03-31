import '../styles/globals.scss'

import Head from 'next/head'

function MyApp({ Component, pageProps }: { Component: React.ComponentProps<any>; pageProps: any }) {
  return (
    <>
      <Head>
        <title>L2Beat</title>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
