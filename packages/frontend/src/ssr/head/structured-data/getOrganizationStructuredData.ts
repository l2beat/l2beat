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
    description:
      'L2BEAT is an independent, public goods research organization that analyzes and compares Ethereum layer 2 scaling solutions, data availability layers, bridges, and other ecosystem projects, focusing on their risks, security, and trust assumptions.',
    sameAs: [
      externalLinks.x,
      externalLinks.github,
      externalLinks.linkedin,
      externalLinks.youTube,
      externalLinks.medium,
    ],
  }
}
