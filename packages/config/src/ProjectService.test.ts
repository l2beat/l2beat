import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { unlinkSync } from 'fs'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { ProjectDatabase } from './ProjectDatabase'
import { ProjectService } from './ProjectService'
import type { BaseProject, ProjectScalingInfo } from './types'

describe(ProjectService.name, () => {
  const projects: BaseProject[] = [
    {
      id: ProjectId('foo'),
      slug: 'foochain',
      name: 'Foo Chain',
      shortName: undefined,
      addedAt: 0,
      scalingInfo: {} as ProjectScalingInfo,
      archivedAt: UnixTime(1112470620),
    },
    {
      id: ProjectId('bar'),
      slug: 'barnetwork',
      name: 'Bar Network',
      shortName: 'Bar',
      addedAt: 0,
      scalingInfo: {} as ProjectScalingInfo,
    },
  ]

  let db: ProjectDatabase
  const TEMP_PATH = '/tmp/projectdb-service.sqlite'
  beforeAll(async () => {
    try {
      unlinkSync(TEMP_PATH)
    } catch {}

    db = new ProjectDatabase(TEMP_PATH)
    await db.init()
    for (const project of projects) {
      await db.saveProject(project)
    }
  })
  afterAll(() => {
    unlinkSync(TEMP_PATH)
  })

  it('selects a single project by id', async () => {
    const ps = new ProjectService(TEMP_PATH)
    const result = await ps.getProject({
      id: ProjectId('foo'),
    })
    expect(result).toEqual({
      id: ProjectId('foo'),
      slug: 'foochain',
      name: 'Foo Chain',
      shortName: undefined,
      addedAt: 0,
    })
  })

  it('returns undefined for non-existent project', async () => {
    const ps = new ProjectService(TEMP_PATH)
    const result = await ps.getProject({
      id: ProjectId('baz'),
    })
    expect(result).toBe(undefined)
  })

  it('returns selected items', async () => {
    const ps = new ProjectService(TEMP_PATH)
    const result = await ps.getProject({
      id: ProjectId('foo'),
      select: ['scalingInfo'],
      optional: ['archivedAt'],
    })
    expect(result).toEqual({
      id: ProjectId('foo'),
      slug: 'foochain',
      name: 'Foo Chain',
      shortName: undefined,
      addedAt: 0,
      scalingInfo: {} as ProjectScalingInfo,
      archivedAt: UnixTime(1112470620),
    })
  })

  it('returns multiple projects', async () => {
    const ps = new ProjectService(TEMP_PATH)
    const result = await ps.getProjects({
      select: ['scalingInfo'],
      optional: ['archivedAt'],
    })
    expect(result).toEqual([
      {
        id: ProjectId('foo'),
        slug: 'foochain',
        name: 'Foo Chain',
        shortName: undefined,
        addedAt: 0,
        scalingInfo: {} as ProjectScalingInfo,
        archivedAt: UnixTime(1112470620),
      },
      {
        id: ProjectId('bar'),
        slug: 'barnetwork',
        name: 'Bar Network',
        shortName: 'Bar',
        addedAt: 0,
        scalingInfo: {} as ProjectScalingInfo,
        archivedAt: undefined,
      },
    ])
  })
})
