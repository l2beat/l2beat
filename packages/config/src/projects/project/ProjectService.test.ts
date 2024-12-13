import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { Project } from './Project'
import { ProjectService } from './ProjectService'

describe(ProjectService.name, () => {
  const projects: Project[] = [
    {
      id: ProjectId('foo'),
      slug: 'foochain',
      addedAt: UnixTime.ZERO,
      isLayer2: true,
      isArchived: true,
    },
    {
      id: ProjectId('bar'),
      slug: 'barnetwork',
      addedAt: UnixTime.ZERO,
      isLayer2: true,
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
      select: ['isLayer2'],
      optional: ['isLayer3', 'isArchived'],
    })
    expect(result).toEqual({
      id: ProjectId('foo'),
      slug: 'foochain',
      addedAt: UnixTime.ZERO,
      isLayer2: true,
      isLayer3: undefined,
      isArchived: true,
    })
  })

  it('returns multiple projects', async () => {
    const service = new ProjectService(getProjects)
    const result = await service.getProjects({
      select: ['isLayer2'],
      optional: ['isLayer3', 'isArchived'],
    })
    expect(result).toEqual([
      {
        id: ProjectId('foo'),
        slug: 'foochain',
        addedAt: UnixTime.ZERO,
        isLayer2: true,
        isLayer3: undefined,
        isArchived: true,
      },
      {
        id: ProjectId('bar'),
        slug: 'barnetwork',
        addedAt: UnixTime.ZERO,
        isLayer2: true,
        isLayer3: undefined,
        isArchived: undefined,
      },
    ])
  })
})
