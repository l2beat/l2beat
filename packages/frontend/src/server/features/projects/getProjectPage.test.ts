import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { ps } from '~/server/projects'
import {
  getProjectBreadcrumbs,
  PROJECT_PAGE_FIELDS,
  selectProjectPages,
} from './getProjectPage'

describe(selectProjectPages.name, () => {
  it('gives a project in two sections one page, its builder first', () => {
    const pages = selectProjectPages(
      [
        project('railgun', { privacyInfo: {}, zkCatalogInfo: {} }),
        project('payy', { scalingInfo: {}, privacyInfo: {} }),
        // An interop chain, so it has the chain section too.
        project('avalanche', { interopConfig: {} }),
        project('sp1', { zkCatalogInfo: {} }),
      ],
      { anyDeployment: true },
    )

    expect(
      Object.fromEntries(
        pages
          .filter((page) => page.project)
          .map((page) => [page.slug, page.sections]),
      ),
    ).toEqual({
      railgun: ['privacy', 'zkCatalog'],
      payy: ['layer2s', 'privacy'],
      avalanche: ['interop', 'chain'],
      sp1: ['zkCatalog'],
    })
  })

  it('shows the bridge of a scaling project on its scaling page', () => {
    const [page] = selectProjectPages([
      project('arbitrum', { scalingInfo: {}, interopConfig: {} }),
    ])

    expect(page?.sections).toEqual(['layer2s'])
  })

  it('gives a chain without a project a page of its own', () => {
    const pages = selectProjectPages([], { anyDeployment: true })

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

    it('throws when checking every deployment', () => {
      expect(() =>
        selectProjectPages(projects, { anyDeployment: true }),
      ).toThrow('Unsupported project page sections')
    })
  })

  // Every chain in any deployment and every flag on, so a project that gains
  // a section nobody designed a page for fails here before it 500s in prod.
  it('supports every project and chain page', async () => {
    const projects = await ps.getProjects({
      optional: [...PROJECT_PAGE_FIELDS],
    })

    expect(() =>
      selectProjectPages(projects, { anyDeployment: true }),
    ).not.toThrow()
  })
})

describe(getProjectBreadcrumbs.name, () => {
  it('lists the site sections of the page, its own first', () => {
    expect(
      getProjectBreadcrumbs({
        slug: 'railgun',
        kind: 'privacy',
        sections: ['privacy', 'zkCatalog'],
      }),
    ).toEqual(['privacy', 'zkCatalog'])
  })

  it('files chain pages under interop, once', () => {
    expect(
      getProjectBreadcrumbs({
        slug: 'avalanche',
        kind: 'interop',
        sections: ['interop', 'chain'],
      }),
    ).toEqual(['interop'])
  })

  it('has none for Ethereum, which no section lists', () => {
    expect(
      getProjectBreadcrumbs({
        slug: 'ethereum',
        kind: 'ethereum',
        sections: ['ethereum'],
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
