import { externalLinks } from '~/consts/externalLinks'
import { toProductionUrl, withSchemaOrgContext } from './StructuredData'

/** L2BEAT as the author or publisher embedded in other blocks. */
export const L2BEAT_ORGANIZATION = {
  '@type': 'Organization',
  '@id': toProductionUrl('/#organization'),
  name: 'L2BEAT',
  url: toProductionUrl(''),
  // The unfingerprinted copy, so the URL stays stable across deploys.
  logo: toProductionUrl('/logo.png'),
}

export function getOrganizationStructuredData() {
  return withSchemaOrgContext({
    ...L2BEAT_ORGANIZATION,
    sameAs: [
      externalLinks.x,
      externalLinks.github,
      externalLinks.linkedin,
      externalLinks.youTube,
      externalLinks.medium,
    ],
  })
}
