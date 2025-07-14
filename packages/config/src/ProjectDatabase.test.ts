import {
  AssetId,
  ChainId,
  CoingeckoId,
  type LegacyToken,
  ProjectId,
} from '@l2beat/shared-pure'
import { expect } from 'earl'
import { unlinkSync } from 'fs'
import { ProjectDatabase } from './ProjectDatabase'
import type { BaseProject } from './types'

describe(ProjectDatabase.name, () => {
  let db: ProjectDatabase
  const TEMP_PATH = '/tmp/projectdb.sqlite'
  before(async () => {
    try {
      unlinkSync(TEMP_PATH)
    } catch {}

    db = new ProjectDatabase(TEMP_PATH)
    await db.init()
  })
  after(() => {
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

    expect(result).toEqual(project)
  })

  it('complex query', async () => {
    const projectA: BaseProject = {
      id: ProjectId('a'),
      slug: 'a',
      name: 'a',
      shortName: undefined,
      addedAt: 0,
      isBridge: true,
    }
    const projectB: BaseProject = {
      id: ProjectId('b'),
      slug: 'b',
      name: 'b',
      shortName: undefined,
      addedAt: 0,
      isBridge: true,
      isScaling: true,
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
      select: ['isBridge', 'isScaling'],
      whereNotNull: ['isBridge'],
      whereNull: [],
    })

    expect(result).toEqual([{ ...projectA, isScaling: undefined }, projectB])
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
    expect(await db.getToken(token.id)).toEqual(token)
    expect(await db.getTokens()).toEqual([token])
  })
})
