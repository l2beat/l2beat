import '../styles/globals.scss'
import 'react-vis/dist/style.css'

import Head from 'next/head'
import { useRouter } from 'next/router'

const TITLE = 'L2Beat - Analytics about Layer 2 scaling solutions'
const DESCRIPTION =
  'L2Beat is a website containing always up-to-date analytics about Layer 2 scaling solutions for Ethereum.'
const ALT = 'Your insights into L2'
function MyApp({ Component, pageProps }: { Component: React.ComponentProps<any>; pageProps: any }) {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap" rel="stylesheet" />

        <meta property="og:title" content={pageProps.title || TITLE} />
        <meta property="og:description" content={pageProps.description || DESCRIPTION} />
        <meta property="og:image" content={`https://l2beat.com/og/${pageProps.project || 'overview'}.png`} />
        <meta property="og:url" content={`https://l2beat.com${router.asPath}`} />
        <meta name="twitter:card" content="summary_large_image" />

        <meta property="og:site_name" content={pageProps.title || TITLE} />
        <meta name="twitter:image:alt" content={pageProps.alt || ALT} />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
