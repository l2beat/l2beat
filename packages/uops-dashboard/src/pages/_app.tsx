import Layout from '@/components/layout'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Script from 'next/script'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID && (
        <>
          <Script>
            {`
          window.op = window.op || function () { var n = []; return new Proxy(function () { arguments.length && n.push([].slice.call(arguments)) }, { get: function (t, r) { return "q" === r ? n : function () { n.push([r].concat([].slice.call(arguments))) } }, has: function (t, r) { return "q" === r } }) }();
          window.op('init', {
            clientId: '${process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID}',
            trackScreenViews: true,
            trackOutgoingLinks: true,
            trackAttributes: true,
            apiUrl: 'https://opapi.l2beat.com',
          });
        `}
          </Script>
          <Script src="https://analytics.l2beat.com/op1.js" defer async />
        </>
      )}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
