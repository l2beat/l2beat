import { L2BEAT_ORGANIZATION } from './getOrganizationStructuredData'
import type { StructuredDataPage } from './StructuredData'

/**
 * A page about one project. `about` is a plain Thing: the specific types that
 * would fit, like SoftwareApplication, make Google expect ratings and offers.
 */
export function getWebPageStructuredData(
  page: StructuredDataPage,
  webPage: { name: string; about: string },
) {
  return {
    '@type': 'WebPage',
    '@id': page.url,
    url: page.url,
    name: webPage.name,
    description: page.description,
    about: { '@type': 'Thing', name: webPage.about },
    publisher: L2BEAT_ORGANIZATION,
  }
}
