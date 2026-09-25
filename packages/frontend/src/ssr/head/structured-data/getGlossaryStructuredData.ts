import type { CollectionEntry } from '~/content/getCollection'
import { toProductionUrl, withSchemaOrgContext } from './StructuredData'

export function getGlossaryStructuredData(
  entries: CollectionEntry<'glossary'>[],
) {
  const glossaryUrl = toProductionUrl('/glossary')
  return withSchemaOrgContext({
    '@type': 'DefinedTermSet',
    '@id': glossaryUrl,
    name: 'L2BEAT Glossary',
    url: glossaryUrl,
    hasDefinedTerm: entries.map((entry) => ({
      '@type': 'DefinedTerm',
      name: entry.data.term,
      ...(entry.data.match && { alternateName: entry.data.match }),
      description: entry.data.definition,
      url: `${glossaryUrl}#${entry.id}`,
      inDefinedTermSet: glossaryUrl,
    })),
  })
}
