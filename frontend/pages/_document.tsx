import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <body>
          <Main />
          <NextScript />
          {/* Empty script tag as chrome bug fix, see https://stackoverflow.com/a/42969608/943337 */}
          <script> </script>
        </body>
      </Html>
    )
  }
}
