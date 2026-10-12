import { expect } from 'earl'
import { getCollectionEntry } from '~/content/getCollection'
import { getFaqData } from '~/pages/faq/getFaqData'
import { getGlossaryData } from '~/pages/glossary/getGlossaryData'
import { getGovernancePublicationData } from '~/pages/publications/governance/getGovernancePublicationData'
import { identityManifest as manifest } from '~/test/identityManifest'

// The builders are tested on their own; these check each page loader hands
// its block to the head. They call the real loaders with real content, then
// read the blocks back out of the metadata the head renders.
describe('page structured data', () => {
  it('FAQ page emits a FAQPage', async () => {
    const data = await getFaqData(manifest, '/faq')

    expect(getTypes(data.head.metadata)).toEqual(['BreadcrumbList', 'FAQPage'])
  })

  it('glossary page emits a DefinedTermSet', async () => {
    const data = await getGlossaryData(manifest, '/glossary')

    expect(getTypes(data.head.metadata)).toEqual([
      'BreadcrumbList',
      'DefinedTermSet',
    ])
  })

  it('governance publication page emits an Article of the real post', async () => {
    const post = getCollectionEntry(
      'governance-publications',
      'governance-review-1',
    )
    if (!post) throw new Error('governance-review-1 is missing')

    const data = await getGovernancePublicationData(
      manifest,
      post,
      '/publications/governance-review-1',
    )

    expect(getTypes(data.head.metadata)).toEqual(['BreadcrumbList', 'Article'])
    expect(data.head.metadata.structuredData[1]).toEqual(
      expect.subset({
        url: 'https://l2beat.com/publications/governance-review-1',
        headline: 'Governance Review #01',
        description:
          'L2BEAT provides weekly updates on governance in concise articles.',
        image:
          'https://l2beat.com/meta-images/publications/governance-review-1.png',
        datePublished: '2024-01-19',
        author: {
          '@type': 'Person',
          name: 'Anastassis Oikonomopoulos',
          jobTitle: 'Governance Representative',
        },
      }),
    )
  })
})

function getTypes(metadata: {
  structuredData: { '@type': string }[]
}): string[] {
  return metadata.structuredData.map((data) => data['@type'])
}
