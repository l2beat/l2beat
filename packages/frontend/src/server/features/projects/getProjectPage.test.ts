import { INTEROP_CHAINS } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { ps } from '~/server/projects'
import { getChainProjectSlug } from '../chains/getChainProjects'
import {
  getProjectPageKind,
  getProjectPageSections,
  PROJECT_PAGE_SECTION_FIELDS,
} from './getProjectPage'

describe(getProjectPageKind.name, () => {
  it('merges the supported combinations into one base page', () => {
    expect(getProjectPageKind(['zkCatalog', 'privacy'])).toEqual('privacy')
    expect(getProjectPageKind(['layer2s', 'privacy'])).toEqual('layer2s')
    expect(getProjectPageKind(['interop', 'chain'])).toEqual('interop')
    expect(getProjectPageKind(['zkCatalog'])).toEqual('zkCatalog')
  })

  it('has no page without sections', () => {
    expect(getProjectPageKind([])).toEqual(undefined)
  })

  it('throws for a combination no page is designed for', () => {
    expect(() => getProjectPageKind(['layer2s', 'zkCatalog'])).toThrow(
      'Unsupported project page sections',
    )
  })

  // Every chain in any deployment and every flag on, so a project that gains
  // a section nobody designed a page for fails here before it 500s in prod.
  it('supports every project and chain page', async () => {
    const projects = await ps.getProjects({
      optional: [...PROJECT_PAGE_SECTION_FIELDS],
    })
    const l2Ids = new Set(
      projects.filter((p) => p.scalingInfo).map((p) => p.id),
    )
    const chainSlugs = new Set(
      INTEROP_CHAINS.flatMap(
        (chain) => getChainProjectSlug(chain, l2Ids) ?? [],
      ),
    )

    const unsupported: string[] = []
    for (const project of projects) {
      const sections = getProjectPageSections(project, {
        hasChainPage: chainSlugs.has(project.slug),
        defiEnabled: true,
      })
      try {
        getProjectPageKind(sections)
      } catch {
        unsupported.push(`${project.slug}: ${sections.join('+')}`)
      }
    }
    expect(unsupported).toEqual([])
  })

  it('gives Ethereum its own page', () => {
    expect(
      getProjectPageSections(
        {
          id: ProjectId.ETHEREUM,
          scalingInfo: undefined,
          interopConfig: undefined,
          zkCatalogInfo: undefined,
          privacyInfo: undefined,
          defiInfo: undefined,
        },
        { hasChainPage: false, defiEnabled: true },
      ),
    ).toEqual(['ethereum'])
  })
})
