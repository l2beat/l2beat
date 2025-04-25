import { type Change, diffLines } from 'diff'
import type { Project } from './types'

export interface ProjectDiff {
  id: string
  type: 'added' | 'removed' | 'modified'
  fields: FieldDiff[]
  added: number
  removed: number
}

export interface FieldDiff {
  field: string
  diff: LineChange[]
  added: number
  removed: number
}

export interface LineChange {
  type: 'full' | 'ctx' | 'added' | 'removed'
  value: string
}

export function diffAll(
  projectsBefore: Project[],
  projectsAfter: Project[],
): ProjectDiff[] {
  const beforeMap = new Map(projectsBefore.map((p) => [p.id, p]))
  const afterMap = new Map(projectsAfter.map((p) => [p.id, p]))

  const results: ProjectDiff[] = []

  for (const [id, before] of beforeMap) {
    const after = afterMap.get(id)
    if (!after) {
      results.push(addedOrRemoved(before, 'removed'))
    } else {
      const diff = diffProjects(before, after)
      if (diff.length > 0) {
        const added = diff.reduce((sum, a) => sum + a.added, 0)
        const removed = diff.reduce((sum, a) => sum + a.removed, 0)
        results.push({
          id: before.id,
          type: 'modified',
          fields: diff,
          added,
          removed,
        })
      }
    }
  }

  for (const [id, after] of afterMap) {
    const before = beforeMap.get(id)
    if (!before) {
      results.push(addedOrRemoved(after, 'added'))
    }
  }

  return results.sort((a, b) => a.id.localeCompare(b.id))
}

function addedOrRemoved(
  project: Project,
  type: 'added' | 'removed',
): ProjectDiff {
  const fields = Object.entries(project).map(([key, value]) => {
    const lines = JSON.stringify(toCanonicalJson(value), null, 2).split('\n')
    return {
      field: key,
      diff: lines.map((value) => ({ type, value })),
      added: type === 'added' ? lines.length : 0,
      removed: type === 'removed' ? lines.length : 0,
    }
  })
  const added = fields.reduce((sum, a) => sum + a.added, 0)
  const removed = fields.reduce((sum, a) => sum + a.removed, 0)
  return { id: project.id, type, fields, added, removed }
}

function diffProjects(before: Project, after: Project): FieldDiff[] {
  const result: FieldDiff[] = []
  const allFields = new Set([...Object.keys(before), ...Object.keys(after)])
  for (const field of allFields) {
    const output = diffLines(
      JSON.stringify(toCanonicalJson(before[field]), null, 2),
      JSON.stringify(toCanonicalJson(after[field]), null, 2),
    )
    if (output.some((x) => x.added || x.removed)) {
      const diff = processDiffOutput(output, 5)
      const added = diff.reduce(
        (count, a) => count + (a.type === 'added' ? 1 : 0),
        0,
      )
      const removed = diff.reduce(
        (count, a) => count + (a.type === 'removed' ? 1 : 0),
        0,
      )
      result.push({ field, diff, added, removed })
    }
  }
  return result
}

function processDiffOutput(
  changes: Change[],
  contextSize: number,
): LineChange[] {
  const result: LineChange[] = []
  for (const [_i, change] of changes.entries()) {
    const lines = change.value.split('\n')
    if (change.value.endsWith('\n')) {
      lines.pop()
    }
    if (change.added) {
      result.push(
        ...lines.map((value): LineChange => ({ type: 'added', value })),
      )
    } else if (change.removed) {
      result.push(
        ...lines.map((value): LineChange => ({ type: 'removed', value })),
      )
    } else {
      result.push(
        ...lines.map(
          (value, i): LineChange => ({
            type:
              i > contextSize && i < lines.length - contextSize
                ? 'full'
                : 'ctx',
            value,
          }),
        ),
      )
    }
  }
  return result
}

function toCanonicalJson(value: unknown) {
  if (value === undefined) {
    return null
  }
  if (typeof value !== 'object' || value === null) {
    return value
  }
  if (Array.isArray(value)) {
    return value
  }
  return Object.fromEntries(
    Object.entries(value).sort(([a], [b]) => a.localeCompare(b)),
  )
}
