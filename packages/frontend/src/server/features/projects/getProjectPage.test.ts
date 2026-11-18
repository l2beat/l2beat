import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { env } from '~/env'
import { ps } from '~/server/projects'
import {
  EVERY_DEPLOYMENT,
  findUnsupportedProjectPages,
  getProjectBreadcrumbs,
  PROJECT_PAGE_FIELDS,
  selectProjectPages,
} from './getProjectPage'

describe(selectProjectPages.name, () => {
  it('gives a project in two sections the page designed for both', () => {
    const pages = selectProjectPages(
      [
        project('railgun', { privacyInfo: {}, zkCatalogInfo: {} }),
        project('payy', { scalingInfo: {}, privacyInfo: {} }),
        // An interop chain, so it has the chain section too.
        project('avalanche', { interopConfig: {} }),
        project('sp1', { zkCatalogInfo: {} }),
      ],
      EVERY_DEPLOYMENT,
    )

    expect(
      Object.fromEntries(
        pages
          .filter((page) => page.project)
          .map((page) => [page.slug, [page.kind, page.sections.join('+')]]),
      ),
    ).toEqual({
      railgun: ['privacyZkCatalog', 'privacy+zkCatalog'],
      payy: ['layer2sPrivacy', 'layer2s+privacy'],
      avalanche: ['interopChain', 'interop+chain'],
      sp1: ['zkCatalog', 'zkCatalog'],
    })
  })

  it('shows the bridge of a scaling project on its scaling page', () => {
    const [page] = selectProjectPages([
      project('arbitrum', { scalingInfo: {}, interopConfig: {} }),
    ])

    expect(page?.sections).toEqual(['layer2s'])
  })

  it('gives a chain without a project a page of its own', () => {
    const pages = selectProjectPages([], EVERY_DEPLOYMENT)

    const solana = pages.find((page) => page.slug === 'solana')

    expect(solana?.sections).toEqual(['chain'])
    expect(solana?.project).toEqual(undefined)
  })

  it('gives Ethereum its own page', () => {
    const [page] = selectProjectPages([
      { ...project('ethereum', {}), id: ProjectId.ETHEREUM },
    ])

    expect(page?.sections).toEqual(['ethereum'])
  })

  // Other DeFi projects keep their page but are in no list.
  it('lists a DeFi project only when its category has a page of its own', () => {
    const originalDefiEnabled = env.CLIENT_SIDE_DEFI_ENABLED
    env.CLIENT_SIDE_DEFI_ENABLED = true
    try {
      const pages = selectProjectPages([
        project('lido', { defiInfo: { category: 'Liquid Staking' } }),
        project('aave', { defiInfo: { category: 'Lending' } }),
      ])

      expect(
        pages.map((page) => [page.slug, page.sections, page.listed]),
      ).toEqual([
        ['lido', ['defi'], ['defi']],
        ['aave', ['defi'], []],
      ])
    } finally {
      env.CLIENT_SIDE_DEFI_ENABLED = originalDefiEnabled
    }
  })

  it('has no page for a project without sections', () => {
    const pages = selectProjectPages([project('celestia', {})])

    expect(pages.filter((page) => page.slug === 'celestia')).toEqual([])
  })

  describe('for a combination no page is designed for', () => {
    const projects = [project('both', { scalingInfo: {}, zkCatalogInfo: {} })]

    it('leaves the project out in a deployment, so the lists stay up', () => {
      const pages = selectProjectPages(projects)

      expect(pages.filter((page) => page.slug === 'both')).toEqual([])
    })

    it('names the project and its sections', () => {
      expect([
        ...findUnsupportedProjectPages(projects, EVERY_DEPLOYMENT),
      ]).toEqual([['both', ['layer2s', 'zkCatalog']]])
    })
  })

  // Every chain in any deployment and every flag on, so a project that gains
  // a section nobody designed a page for fails here before it 500s in prod.
  it('supports every project and chain page', async () => {
    const projects = await ps.getProjects({
      optional: [...PROJECT_PAGE_FIELDS],
    })

    expect([
      ...findUnsupportedProjectPages(projects, EVERY_DEPLOYMENT),
    ]).toEqual([])
  })
})

describe(getProjectBreadcrumbs.name, () => {
  it('lists the site sections of the page, its own first', () => {
    expect(
      getProjectBreadcrumbs({
        slug: 'railgun',
        kind: 'privacyZkCatalog',
        sections: ['privacy', 'zkCatalog'],
        listed: ['privacy', 'zkCatalog'],
      }),
    ).toEqual(['privacy', 'zkCatalog'])
  })

  it('files chain pages under interop, once', () => {
    expect(
      getProjectBreadcrumbs({
        slug: 'avalanche',
        kind: 'interopChain',
        sections: ['interop', 'chain'],
        listed: ['interop', 'chain'],
      }),
    ).toEqual(['interop'])
  })

  it('shows DeFi on the page of a project no DeFi list shows', () => {
    const originalDefiEnabled = env.CLIENT_SIDE_DEFI_ENABLED
    env.CLIENT_SIDE_DEFI_ENABLED = true
    try {
      expect(
        getProjectBreadcrumbs({
          slug: 'aave',
          kind: 'defi',
          sections: ['defi'],
          listed: [],
        }),
      ).toEqual(['defi'])
    } finally {
      env.CLIENT_SIDE_DEFI_ENABLED = originalDefiEnabled
    }
  })

  it('has none for Ethereum, which no section lists', () => {
    expect(
      getProjectBreadcrumbs({
        slug: 'ethereum',
        kind: 'ethereum',
        sections: ['ethereum'],
        listed: ['ethereum'],
      }),
    ).toEqual([])
  })
})

function project(
  slug: string,
  sections: Partial<Record<(typeof PROJECT_PAGE_FIELDS)[number], object>>,
) {
  return {
    id: ProjectId(slug),
    slug,
    scalingInfo: undefined,
    interopConfig: undefined,
    zkCatalogInfo: undefined,
    privacyInfo: undefined,
    defiInfo: undefined,
    ossificationHistory: undefined,
    ...sections,
  } as Parameters<typeof selectProjectPages>[0][number]
}
