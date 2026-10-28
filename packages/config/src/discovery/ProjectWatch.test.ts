import { expect } from 'earl'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { ProjectWatch } from './ProjectWatch'

describe(ProjectWatch.name, () => {
  let projects: string

  before(() => {
    projects = mkdtempSync(join(tmpdir(), 'project-watch-'))
    mkdirSync(join(projects, 'near'))
    mkdirSync(join(projects, 'empty'))
    writeFileSync(
      join(projects, 'near', 'watched.json'),
      JSON.stringify({
        timestamp: 1,
        values: { pauseManagers: ['a.near', 'b.near'] },
      }),
    )
  })

  after(() => rmSync(projects, { recursive: true, force: true }))

  it('returns a committed watched value', () => {
    const watch = new ProjectWatch('near', projects)
    expect(watch.getValue<string[]>('pauseManagers').length).toEqual(2)
  })

  it('throws for a missing key or a project without watched.json', () => {
    const watch = new ProjectWatch('near', projects)
    expect(() => watch.getValue('missing')).toThrow('Watched value not found')
    expect(() => new ProjectWatch('empty', projects)).toThrow(
      'Project has no watched.json',
    )
  })
})
