import type { Project, ProjectZkCatalogInfo } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { describe, expect, it } from 'vitest'
import { attachTrustedSetups } from './getPrivacyProjects'

describe(attachTrustedSetups.name, () => {
  const trustedSetups = [
    { id: 'ts', name: 'TS', risk: 'green' },
  ] as unknown as ProjectZkCatalogInfo['trustedSetups']
  const zkCatalogProject = {
    id: ProjectId('zk'),
    zkCatalogInfo: { trustedSetups },
  } as unknown as Project<'zkCatalogInfo'>

  function privacyProject(privacyInfo: object, zkCatalogInfo?: object) {
    return { id: ProjectId('p'), privacyInfo, zkCatalogInfo } as never
  }

  it('prefers own zkCatalogInfo', () => {
    const own = [
      { id: 'own' },
    ] as unknown as ProjectZkCatalogInfo['trustedSetups']
    const [result] = attachTrustedSetups(
      [
        privacyProject(
          { zkCatalogId: ProjectId('zk') },
          { trustedSetups: own },
        ),
      ],
      [zkCatalogProject],
    )
    expect(result?.trustedSetups).toStrictEqual(own)
  })

  it('borrows trusted setups from the linked zk catalog project', () => {
    const [result] = attachTrustedSetups(
      [privacyProject({ zkCatalogId: ProjectId('zk') })],
      [zkCatalogProject],
    )
    expect(result?.trustedSetups).toStrictEqual(trustedSetups)
  })

  it('returns no trusted setups when nothing is linked', () => {
    const [result] = attachTrustedSetups([privacyProject({})], [])
    expect(result?.trustedSetups).toStrictEqual([])
  })
})
