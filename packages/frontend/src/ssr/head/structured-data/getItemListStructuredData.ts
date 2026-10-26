import { toProductionUrl } from '~/consts/productionOrigin'
import type { StructuredDataPage } from './StructuredData'

/** The projects a summary page lists, in the order the page shows them. */
export function getItemListStructuredData(
  page: StructuredDataPage,
  list: { name: string; items: { name: string; path: string }[] },
) {
  return {
    '@type': 'ItemList',
    '@id': `${page.url}#list`,
    name: list.name,
    url: page.url,
    itemListElement: list.items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: toProductionUrl(item.path),
    })),
  }
}
