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
      <link rel="stylesheet" href={manifest.getUrl('/index.css')} />

      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />

      <OpengraphMeta {...metadata} />
      <TwitterMeta {...metadata} />
      {env.DEPLOYMENT_ENV === 'production' && (
        <>
          <script
            defer
            data-domain="l2beat.com"
            data-api="/plausible/event"
            src="/plausible/script.js"
          />
          <script
            dangerouslySetInnerHTML={{
              __html:
                'window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }',
            }}
          />
        </>
      )}
    </>
  )
}

function OpengraphMeta({ openGraph: opengraph, title, description }: Metadata) {
  return (
    <>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {opengraph && <meta property="og:url" content={opengraph.url} />}
      <meta property="og:site_name" content="L2BEAT" />
      {<meta property="og:type" content={opengraph.type} />}
      {opengraph?.image && (
        <>
          <meta property="og:image" content={opengraph.image} />
          <meta property="og:image:width" content={size.width.toString()} />
          <meta property="og:image:height" content={size.height.toString()} />
          <meta property="og:image:type" content="image/png" />
        </>
      )}
    </>
  )
}

function TwitterMeta({ title, description, openGraph: opengraph }: Metadata) {
  return (
    <>
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {opengraph?.image && (
        <>
          <meta name="twitter:image" content={opengraph.image} />
          <meta name="twitter:image:type" content="image/png" />
          <meta name="twitter:image:width" content={size.width.toString()} />
          <meta name="twitter:image:height" content={size.height.toString()} />
        </>
      )}
    </>
  )
}
