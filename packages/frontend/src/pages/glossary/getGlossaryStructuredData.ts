import type { CollectionEntry } from '~/content/getCollection'
import type { StructuredDataPage } from '~/ssr/head/structured-data/StructuredData'

export function getGlossaryStructuredData(
  page: StructuredDataPage,
  entries: CollectionEntry<'glossary'>[],
) {
  return {
    '@type': 'DefinedTermSet',
    '@id': page.url,
    name: 'ETHBEAT Glossary',
    url: page.url,
    hasDefinedTerm: entries.map((entry) => ({
      '@type': 'DefinedTerm',
      name: entry.data.term,
      ...(entry.data.match && { alternateName: entry.data.match }),
      description: entry.data.definition,
      url: `${page.url}#${entry.id}`,
      inDefinedTermSet: page.url,
    })),
  }
}
