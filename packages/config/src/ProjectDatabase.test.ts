import {
  AssetId,
  ChainId,
  CoingeckoId,
  type LegacyToken,
  ProjectId,
} from '@l2beat/shared-pure'
import { unlinkSync } from 'fs'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { ProjectDatabase } from './ProjectDatabase'
import type { BaseProject, ProjectScalingInfo } from './types'

describe(ProjectDatabase.name, () => {
  let db: ProjectDatabase
  const TEMP_PATH = '/tmp/projectdb.sqlite'
  beforeAll(async () => {
    try {
      unlinkSync(TEMP_PATH)
    } catch {}

    db = new ProjectDatabase(TEMP_PATH)
    await db.init()
  })
  afterAll(() => {
    unlinkSync(TEMP_PATH)
  })

  it('can add and query a project', async () => {
    const project: BaseProject = {
      id: ProjectId('example'),
      slug: 'xmpl',
      name: 'Example',
      shortName: undefined,
      addedAt: 0,
    }

    await db.saveProject(project)

    const result = await db.getProject({
      id: 'example',
      select: [],
      whereNotNull: [],
      whereNull: [],
    })

    expect(result).toStrictEqual(project)
  })

  it('complex query', async () => {
    const projectA: BaseProject = {
      id: ProjectId('a'),
      slug: 'a',
      name: 'a',
      shortName: undefined,
      addedAt: 0,
    }
    const projectB: BaseProject = {
      id: ProjectId('b'),
      slug: 'b',
      name: 'b',
      shortName: undefined,
      addedAt: 0,
      scalingInfo: {} as ProjectScalingInfo,
    }
    const projectC: BaseProject = {
      id: ProjectId('c'),
      slug: 'c',
      name: 'c',
      shortName: undefined,
      addedAt: 0,
    }

    await db.saveProject(projectA)
    await db.saveProject(projectB)
    await db.saveProject(projectC)

    const result = await db.getProjects({
      select: ['scalingInfo'],
      whereNotNull: ['scalingInfo'],
      whereNull: [],
    })

    expect(result).toStrictEqual([projectB])
  })

  it('can add and retrieve a token', async () => {
    const token: LegacyToken = {
      id: AssetId('foo'),
      name: 'Foo',
      coingeckoId: CoingeckoId('foo'),
      symbol: 'FOO',
      decimals: 18,
      sinceTimestamp: 0,
      category: 'ether',
      chainId: ChainId(1),
      chainName: 'ethereum',
      source: 'canonical',
      supply: 'totalSupply',
    }

    await db.saveToken(token)
    expect(await db.getToken(token.id)).toStrictEqual(token)
    expect(await db.getTokens()).toStrictEqual([token])
  })

  it('rolls back a failed transaction', async () => {
    const project: BaseProject = {
      id: ProjectId('rolled-back'),
      slug: 'rolled-back',
      name: 'Rolled back',
      shortName: undefined,
      addedAt: 0,
    }

    await expect(
      db.transaction(async () => {
        await db.saveProject(project)
        throw new Error('test error')
      }),
    ).rejects.toThrow('test error')

    const result = await db.getProject({
      id: project.id,
      select: [],
      whereNotNull: [],
      whereNull: [],
    })
    expect(result).toStrictEqual(undefined)
  })
})
