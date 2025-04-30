import { stripQueryParams } from 'rewrite/src/utils/stripQueryParams'
import type { Manifest } from '~/utils/Manifest'
import { getBaseUrl } from '~/utils/get-base-url'

export function getOpengraph(
  manifest: Manifest,
  { url, image }: { url: string; image?: string },
) {
  const baseUrl = getBaseUrl()
  return {
    url: baseUrl + stripQueryParams(url),
    image: image ? baseUrl + manifest.getUrl(image) : undefined,
  }
}
