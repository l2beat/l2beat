import type { Project } from './types'

export interface ProjectDiff {
  id: string
  type: 'added' | 'removed' | 'modified'
  fields: FieldDiff[]
}

export interface FieldDiff {
  field: string
  before: string | undefined
  after: string | undefined
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
        fields: Object.entries(after).map(([key, value]) => ({
          field: key,
          before: undefined,
          after: stringify(value),
        })),
      })
      afterIndex++
    } else if (!after) {
      result.push({
        id: before.id,
        type: 'removed',
        fields: Object.entries(before).map(([key, value]) => ({
          field: key,
          before: stringify(value),
          after: undefined,
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
    const valueBefore = stringify(before[field])
    const valueAfter = stringify(after[field])
    if (valueBefore !== valueAfter) {
      result.push({
        field,
        before: valueBefore,
        after: valueAfter,
      })
    }
  }
  return result
}

function stringify(value: unknown) {
  return typeof value === 'string' ? value : JSON.stringify(value, null, 2)
}
