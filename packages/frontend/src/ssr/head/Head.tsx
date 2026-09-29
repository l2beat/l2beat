import { env } from '~/env'
import type { Manifest } from '~/utils/Manifest'
import { FontStyles } from './FontStyles'
import { fonts } from './fonts'
import type { Metadata } from './getMetadata'

export interface HeadProps {
  manifest: Manifest
  metadata: Metadata
}

const size = {
  width: 1200,
  height: 630,
}

export function Head({ manifest, metadata }: HeadProps) {
  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <FontStyles fonts={fonts} manifest={manifest} />
      {/*
        icon.svg is the only declared favicon on purpose. Its "L2" lettering is dark,
        so it has a prefers-color-scheme rule that flips it to white on a dark tab
        strip - the raster icons cannot do that. Chrome picks any raster rel="icon"
        over an SVG one regardless of order or sizes, so declaring favicon.ico or
        favicon-32x32.png here brings back the invisible lettering. Browsers without
        SVG favicon support fall back to /favicon.ico via the root convention, and
        both raster files are still served from static/.
      */}
      <link
        rel="icon"
        type="image/svg+xml"
        href={manifest.getUrl('/icon.svg')}
      />
      <link
        rel="apple-touch-icon"
        href={manifest.getUrl('/apple-icon.png')}
        type="image/png"
        sizes="180x180"
      />

      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <link rel="canonical" href={metadata.canonicalUrl} />
      {(metadata.excludeFromSearchEngines ||
        env.DEPLOYMENT_ENV !== 'production') && (
        <meta name="robots" content="noindex" />
      )}

      <OpengraphMeta {...metadata} />
      <TwitterMeta {...metadata} />
      {env.CLIENT_SIDE_OPENPANEL_CLIENT_ID && (
        <>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.op=window.op||function(){var n=[];return new Proxy(function(){arguments.length&&n.push([].slice.call(arguments))},{get:function(t,r){return"q"===r?n:function(){n.push([r].concat([].slice.call(arguments)))}} ,has:function(t,r){return"q"===r}}) }();
                  window.op('init', {
                    clientId: '${env.CLIENT_SIDE_OPENPANEL_CLIENT_ID}',
                    apiUrl: 'https://opapi.l2beat.com',
                    trackScreenViews: true,
                    trackOutgoingLinks: true,
                    trackAttributes: true,
                  });`,
            }}
          />
          <script src="https://analytics.l2beat.com/op1.js" defer async />
        </>
      )}
    </>
  )
}

function OpengraphMeta({
  openGraph: opengraph,
  title,
  description,
  url,
}: Metadata) {
  return (
    <>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="L2BEAT" />
      {<meta property="og:type" content={opengraph.type} />}
      <meta property="og:image" content={opengraph.image} />
      <meta property="og:image:width" content={size.width.toString()} />
      <meta property="og:image:height" content={size.height.toString()} />
      <meta property="og:image:type" content="image/png" />
    </>
  )
}

function TwitterMeta({ title, description, openGraph: opengraph }: Metadata) {
  return (
    <>
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={opengraph.image} />
      <meta name="twitter:image:type" content="image/png" />
      <meta name="twitter:image:width" content={size.width.toString()} />
      <meta name="twitter:image:height" content={size.height.toString()} />
    </>
  )
}
