import { type Change, diffJson } from 'diff'
import type { Project } from './types'

export interface ProjectDiff {
  id: string
  type: 'added' | 'removed' | 'modified'
  fields: FieldDiff[]
}

export interface FieldDiff {
  field: string
  diff: Change[]
}

export function diffAll(
  projectsBefore: Project[],
  projectsAfter: Project[],
): ProjectDiff[] {
  const result: ProjectDiff[] = []

  let beforeIndex = 0
  let afterIndex = 0
  while (
    beforeIndex < projectsBefore.length ||
    afterIndex < projectsAfter.length
  ) {
    const before = projectsBefore[beforeIndex]
    const after = projectsAfter[afterIndex]

    if (!before) {
      result.push({
        id: after.id,
        type: 'added',
        fields: Object.entries(after).map(([key, _value]) => ({
          field: key,
          diff: [], // TODO
        })),
      })
      afterIndex++
    } else if (!after) {
      result.push({
        id: before.id,
        type: 'removed',
        fields: Object.entries(after).map(([key, _value]) => ({
          field: key,
          diff: [], // TODO
        })),
      })
      beforeIndex++
    } else {
      const diff = diffProjects(before, after)
      if (diff.length > 0) {
        result.push({ id: before.id, type: 'modified', fields: diff })
      }
      afterIndex++
      beforeIndex++
    }

    if (!before) {
      after.id
    }
  }

  return result
}

function diffProjects(before: Project, after: Project): FieldDiff[] {
  const result: FieldDiff[] = []
  for (const field in before) {
    const output = diffJson(
      before[field] as string | object,
      after[field] as string | object,
    )
    if (output.some((x) => x.added || x.removed)) {
      result.push({
        field,
        diff: output,
      })
    }
  }
  return result
}
