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
import type { BaseProject, ProjectScalingInfo } from './types'

describe(ProjectDatabase.name, () => {
  let db: ProjectDatabase
  const TEMP_PATH = '/tmp/projectdb.sqlite'
  before(() => {
    try {
      unlinkSync(TEMP_PATH)
    } catch {}

    db = new ProjectDatabase(TEMP_PATH)
    db.init()
  })
  after(() => {
    unlinkSync(TEMP_PATH)
  })

  it('can add and query a project', () => {
    const project: BaseProject = {
      id: ProjectId('example'),
      slug: 'xmpl',
      name: 'Example',
      shortName: undefined,
      addedAt: 0,
    }

    db.saveProject(project)

    const result = db.getProject({
      id: 'example',
      select: [],
      whereNotNull: [],
      whereNull: [],
    })

    expect(result).toEqual(project)
  })

  it('complex query', () => {
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

    db.saveProject(projectA)
    db.saveProject(projectB)
    db.saveProject(projectC)

    const result = db.getProjects({
      select: ['scalingInfo'],
      whereNotNull: ['scalingInfo'],
      whereNull: [],
    })

    expect(result).toEqual([projectB])
  })

  it('can add and retrieve a token', () => {
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

    db.saveToken(token)
    expect(db.getToken(token.id)).toEqual(token)
    expect(db.getTokens()).toEqual([token])
  })

  it('rolls back a failed transaction', () => {
    const project: BaseProject = {
      id: ProjectId('rolled-back'),
      slug: 'rolled-back',
      name: 'Rolled back',
      shortName: undefined,
      addedAt: 0,
    }

    expect(() =>
      db.transaction(() => {
        db.saveProject(project)
        throw new Error('test error')
      }),
    ).toThrow('test error')

    const result = db.getProject({
      id: project.id,
      select: [],
      whereNotNull: [],
      whereNull: [],
    })
    expect(result).toEqual(undefined)
  })
})
