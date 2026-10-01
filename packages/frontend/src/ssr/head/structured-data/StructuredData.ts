/**
 * A schema.org JSON-LD block, rendered as one `<script>` in the page head.
 * Head adds the `@context`, so builders only describe the thing itself.
 */
export interface StructuredData {
  '@type': string
  [property: string]: unknown
}

/**
 * What getMetadata resolved for the page, handed to the page's builders so
 * the JSON-LD names the same URL, description and image as the meta tags.
 */
export interface StructuredDataPage {
  /** The canonical, production URL. */
  url: string
  description: string
  image: string
}
