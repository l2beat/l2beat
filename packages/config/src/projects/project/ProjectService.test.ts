import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { BaseProject } from './BaseProject'
import { ProjectService } from './ProjectService'

describe(ProjectService.name, () => {
  const projects: BaseProject[] = [
    {
      id: ProjectId('foo'),
      slug: 'foochain',
      name: 'Foo Chain',
      shortName: undefined,
      addedAt: UnixTime.ZERO,
      isScaling: true,
      isArchived: true,
    },
    {
      id: ProjectId('bar'),
      slug: 'barnetwork',
      name: 'Bar Network',
      shortName: 'Bar',
      addedAt: UnixTime.ZERO,
      isScaling: true,
    },
  ]
  const getProjects = () => projects

  it('selects a single project by id', async () => {
    const service = new ProjectService(getProjects)
    const result = await service.getProject({
      id: ProjectId('foo'),
    })
    expect(result).toEqual({
      id: ProjectId('foo'),
      slug: 'foochain',
      name: 'Foo Chain',
      shortName: undefined,
      addedAt: UnixTime.ZERO,
    })
  })

  it('returns undefined for non-existent project', async () => {
    const service = new ProjectService(getProjects)
    const result = await service.getProject({
      id: ProjectId('baz'),
    })
    expect(result).toEqual(undefined)
  })

  it('returns selected items', async () => {
    const service = new ProjectService(getProjects)
    const result = await service.getProject({
      id: ProjectId('foo'),
      select: ['isScaling'],
      optional: ['isBridge', 'isArchived'],
    })
    expect(result).toEqual({
      id: ProjectId('foo'),
      slug: 'foochain',
      name: 'Foo Chain',
      shortName: undefined,
      addedAt: UnixTime.ZERO,
      isScaling: true,
      isBridge: undefined,
      isArchived: true,
    })
  })

  it('returns multiple projects', async () => {
    const service = new ProjectService(getProjects)
    const result = await service.getProjects({
      select: ['isScaling'],
      optional: ['isBridge', 'isArchived'],
    })
    expect(result).toEqual([
      {
        id: ProjectId('foo'),
        slug: 'foochain',
        name: 'Foo Chain',
        shortName: undefined,
        addedAt: UnixTime.ZERO,
        isScaling: true,
        isBridge: undefined,
        isArchived: true,
      },
      {
        id: ProjectId('bar'),
        slug: 'barnetwork',
        name: 'Bar Network',
        shortName: 'Bar',
        addedAt: UnixTime.ZERO,
        isScaling: true,
        isBridge: undefined,
        isArchived: undefined,
      },
    ])
  })
})
