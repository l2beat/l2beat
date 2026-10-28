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
        ids.map((id) => getSections(projectsById.get(id))),
      )
      if (sections.size !== 1 || sections.has('')) {
        problems.push(`${group.id}: versions are not all in the same sections`)
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

/** Sections with project pages. A page links to its siblings' pages in the
 *  same section, so every version needs the same ones. */
function getSections(project: BaseProject | undefined) {
  return [
    project?.scalingInfo && 'scaling',
    project?.interopConfig && 'interop',
    project?.zkCatalogInfo && 'zkCatalog',
    project?.privacyInfo && 'privacy',
    project?.defiInfo && 'defi',
  ]
    .filter(Boolean)
    .join(',')
}
