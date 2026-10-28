import { expect } from 'earl'
import { getProjects } from '../processing/getProjects'
import type { BaseProject } from '../types'
import { versionGroups } from './versions'

describe('versionGroups', () => {
  const projects = getProjects()
  const projectsById = new Map(projects.map((p) => [p.id, p]))

  it('every group is valid', () => {
    const problems: string[] = []
    const seen = new Set<string>()
    for (const group of versionGroups) {
      const ids = group.versions.map((v) => v.project)
      if (ids.length < 2) {
        problems.push(`${group.id}: fewer than 2 versions`)
      }
      if (!ids.includes(group.latest)) {
        problems.push(`${group.id}: latest ${group.latest} is not a version`)
      }
      for (const id of ids) {
        if (seen.has(id)) {
          problems.push(`${group.id}: ${id} is listed more than once`)
        }
        seen.add(id)
        if (!projectsById.has(id)) {
          problems.push(`${group.id}: unknown project ${id}`)
        }
      }
      const sections = new Set(
        ids.map((id) => getSection(projectsById.get(id))),
      )
      if (sections.size !== 1 || sections.has(undefined)) {
        problems.push(`${group.id}: versions are not all scaling or interop`)
      }
    }
    expect(problems).toEqual([])
  })

  it('every version lists its group in order', () => {
    for (const group of versionGroups) {
      for (const version of group.versions) {
        const project = projectsById.get(version.project)
        expect(project?.versions?.group).toEqual({
          id: group.id,
          name: group.name,
        })
        expect(project?.versions?.label).toEqual(version.label)
        expect(
          project?.versions?.siblings.map((s) => [s.id, s.label, s.isLatest]),
        ).toEqual(
          group.versions.map((v) => [
            v.project,
            v.label,
            v.project === group.latest,
          ]),
        )
      }
    }
  })
})

function getSection(project: BaseProject | undefined) {
  if (project?.scalingInfo) return 'scaling'
  if (project?.interopConfig) return 'interop'
}
