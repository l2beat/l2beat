import { externalLinks } from '~/consts/externalLinks'
import { toProductionUrl } from '~/consts/productionOrigin'

/** L2BEAT as the author or publisher embedded in other blocks. */
export const L2BEAT_ORGANIZATION = {
  '@type': 'Organization' as const,
  '@id': toProductionUrl('/#organization'),
  name: 'L2BEAT',
  url: toProductionUrl(''),
  logo: toProductionUrl('/logo.png'),
}

export function getOrganizationStructuredData() {
  return {
    ...L2BEAT_ORGANIZATION,
    sameAs: [
      externalLinks.x,
      externalLinks.github,
      externalLinks.linkedin,
      externalLinks.youTube,
      externalLinks.medium,
    ],
  }
}
