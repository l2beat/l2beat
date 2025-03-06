import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { BaseProject } from './types'
import { ProjectService } from './ProjectService'

describe(ProjectService.name, () => {
  const projects: BaseProject[] = [
    {
      id: ProjectId('foo'),
      slug: 'foochain',
      name: 'Foo Chain',
      shortName: undefined,
      addedAt: 0,
      isScaling: true,
      isArchived: true,
    },
    {
      id: ProjectId('bar'),
      slug: 'barnetwork',
      name: 'Bar Network',
      shortName: 'Bar',
      addedAt: 0,
      isScaling: true,
    },
  ]
  const getProjects = () => projects

  it('selects a single project by id', async () => {
    const ps = new ProjectService(getProjects)
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
    const ps = new ProjectService(getProjects)
    const result = await ps.getProject({
      id: ProjectId('baz'),
    })
    expect(result).toEqual(undefined)
  })

  it('returns selected items', async () => {
    const ps = new ProjectService(getProjects)
    const result = await ps.getProject({
      id: ProjectId('foo'),
      select: ['isScaling'],
      optional: ['isBridge', 'isArchived'],
    })
    expect(result).toEqual({
      id: ProjectId('foo'),
      slug: 'foochain',
      name: 'Foo Chain',
      shortName: undefined,
      addedAt: 0,
      isScaling: true,
      isBridge: undefined,
      isArchived: true,
    })
  })

  it('returns multiple projects', async () => {
    const ps = new ProjectService(getProjects)
    const result = await ps.getProjects({
      select: ['isScaling'],
      optional: ['isBridge', 'isArchived'],
    })
    expect(result).toEqual([
      {
        id: ProjectId('foo'),
        slug: 'foochain',
        name: 'Foo Chain',
        shortName: undefined,
        addedAt: 0,
        isScaling: true,
        isBridge: undefined,
        isArchived: true,
      },
      {
        id: ProjectId('bar'),
        slug: 'barnetwork',
        name: 'Bar Network',
        shortName: 'Bar',
        addedAt: 0,
        isScaling: true,
        isBridge: undefined,
        isArchived: undefined,
      },
    ])
  })
})
