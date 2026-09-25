import { expect } from 'earl'
import { getCollectionEntry } from '~/content/getCollection'
import { getFaqData } from '~/pages/faq/getFaqData'
import { getGlossaryData } from '~/pages/glossary/getGlossaryData'
import { getL2ProjectMetadata } from '~/pages/layer2s/project/getL2ProjectData'
import { getGovernancePublicationData } from '~/pages/publications/governance/getGovernancePublicationData'
import { ps } from '~/server/projects'
import { identityManifest as manifest } from '~/test/identityManifest'

// The builders are tested on their own; these check each page loader hands
// its block to the head. They call the real loaders with real content and
// projects, then read the types back out of the metadata the head renders.
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

  it('governance publication page emits an Article', async () => {
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
  })

  it('scaling project page emits a Dataset linking its JSON APIs', async () => {
    const project = await ps.getProject({
      slug: 'arbitrum',
      select: ['display'],
      optional: ['discoveryInfo', 'tvsConfig', 'activityConfig'],
    })
    if (!project) throw new Error('arbitrum is missing')

    const metadata = getL2ProjectMetadata(
      manifest,
      project,
      '/layer2s/projects/arbitrum',
    )

    expect(getTypes(metadata)).toEqual(['BreadcrumbList', 'Dataset'])
    const [, dataset] = metadata.structuredData
    expect(dataset).toEqual(
      expect.subset({
        distribution: [
          expect.subset({
            contentUrl: 'https://l2beat.com/api/scaling/tvs/arbitrum',
          }),
          expect.subset({
            contentUrl: 'https://l2beat.com/api/scaling/activity/arbitrum',
          }),
        ],
      }),
    )
  })
})

function getTypes(metadata: {
  structuredData: { '@type': string }[]
}): string[] {
  return metadata.structuredData.map((data) => data['@type'])
}
