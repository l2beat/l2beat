import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export function getRedirectData(
  manifest: Manifest,
  redirectUrl: string,
  originalUrl: string,
  og?: {
    image?: string
    title?: string
    description?: string
  },
): RenderData {
  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        openGraph: {
          url: originalUrl,
          image: og?.image,
        },
        title: og?.title,
        description: og?.description,
      }),
    },
    ssr: {
      page: 'RedirectPage',
      props: {
        redirectUrl,
      },
    },
  }
}
