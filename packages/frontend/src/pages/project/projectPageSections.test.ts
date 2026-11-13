import { InMemoryCache } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { env } from '~/env'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import { manifest } from '~/utils/Manifest'
import { createProjectRouter } from './ProjectRouter'

// Method: build the real pages of the projects that are in two sections, on
// mock data, and read the sections each page lists. Which projects those are
// comes from the real project database.
describe('sections of a project in two site sections', function () {
  this.timeout(20_000)

  const original = { mock: env.MOCK, interopChains: env.INTEROP_CHAINS }

  before(() => {
    env.MOCK = true
    env.INTEROP_CHAINS = ['ethereum', 'arbitrum', 'avalanche']
  })

  after(() => {
    env.MOCK = original.mock
    env.INTEROP_CHAINS = original.interopChains
  })

  it('lists the privacy sections on the page of a scaling project', async () => {
    const sections = await getSections('payy')
    const ids = sections.map((section) => section.props.id)

    expect(ids).toInclude(
      'privacy-adversaries',
      'trusted-setups',
      'risk-analysis',
    )
    // One value section: the privacy page's is the same TVS config.
    expect(ids).not.toInclude('privacy-tvl')
    expect(aliasIdsOf(sections, 'tvs')).toEqual(['privacy-tvl'])
    expect(ids.indexOf('privacy-adversaries')).toBeGreaterThan(
      ids.indexOf('risk-summary'),
    )
    expectUnique(ids)
  })

  it('adds the privacy risks to the scaling risk summary', async () => {
    const sections = await getSections('payy')
    const riskSummary = sections.find(
      (section) => section.type === 'RiskSummarySection',
    )

    expect(
      riskSummary?.props.riskGroups.map((group) => group.name) ?? [],
    ).toInclude('Privacy can be lost if')
  })

  it('lists the ZK Catalog sections on the page of a privacy protocol', async () => {
    const sections = await getSections('tornado-cash')
    const ids = sections.map((section) => section.props.id)

    expect(ids).toInclude('privacy-adversaries', 'verifiers')
    // The catalog's trusted setups, which name the verifiers of each.
    expect(
      sections.find((section) => section.props.id === 'trusted-setups')?.props
        .title,
    ).toEqual('Trusted Setups')
    // One value section: the catalog's is the same value.
    expect(ids).not.toInclude('tvs')
    expect(aliasIdsOf(sections, 'privacy-tvl')).toEqual(['tvs'])
    expectUnique(ids)
  })

  // The page swaps the protocol's own volume section for them, and the
  // markdown keeps it: top chains and routes read fine as lists.
  it('hands the flows of the chain to the page of a protocol that is a chain', async () => {
    const props = await getProps('avalanche')

    expect(props.chainFlows.props.id).toEqual('interop-flows')
    expect(props.chainFlows.props.aliasIds).toEqual(['interop-volume'])
  })
})

async function getSections(slug: string): Promise<ProjectDetailsSection[]> {
  const props = await getProps(slug)
  return (props.projectEntry ?? props.entry).sections
}

async function getProps(slug: string) {
  const router = createProjectRouter(
    manifest,
    async (data) => JSON.stringify(data.ssr.props),
    new InMemoryCache({ enabled: false }),
  )
  const response = await fetchFromRouter(router, `/projects/${slug}`, {
    headers: { Accept: 'text/html' },
  })
  expect(response.status).toEqual(200)
  return response.json()
}

function aliasIdsOf(sections: ProjectDetailsSection[], id: string) {
  const section = sections.find((section) => section.props.id === id)
  return (section?.props as { aliasIds?: string[] } | undefined)?.aliasIds
}

function expectUnique(ids: string[]) {
  expect(ids).toEqual([...new Set(ids)])
}
