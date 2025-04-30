import { type Manifest } from '../../../../src/utils/Manifest'
import { FontStyles } from './FontStyles'
import { fonts } from './fonts'

export interface HeadProps {
  manifest: Manifest
  title: string
  description: string
  opengraph: {
    url: string
    image?: string
  }
}

const size = {
  width: 1200,
  height: 630,
}

export function Head(props: HeadProps) {
  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <FontStyles fonts={fonts} manifest={props.manifest} />
      <link
        rel="icon"
        type="image/svg+xml"
        href={props.manifest.getUrl('/icon.svg')}
      />
      <link
        rel="apple-touch-icon"
        href={props.manifest.getUrl('/apple-icon.png')}
        type="image/png"
        sizes="180x180"
      />
      <link rel="stylesheet" href={props.manifest.getUrl('/index.css')} />

      <title>{props.title}</title>
      <meta name="description" content={props.description} />

      <OpengraphMeta {...props} />
      <TwitterMeta {...props} />
    </>
  )
}

function OpengraphMeta({ opengraph, title, description }: HeadProps) {
  return (
    <>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={opengraph.url} />
      <meta property="og:site_name" content="L2BEAT" />
      <meta property="og:type" content="website" />
      {opengraph.image && (
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

function TwitterMeta({ title, description, opengraph }: HeadProps) {
  return (
    <>
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {opengraph.image && (
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
