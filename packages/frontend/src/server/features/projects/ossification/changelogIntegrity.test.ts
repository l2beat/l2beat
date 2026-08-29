import {
  buildDiscoveryChangelog,
  createDiffHistoryEntryIdFactory,
  DiffHistoryParser,
  serializeDiscoveryChangelog,
} from '@l2beat/shared'
import { expect } from 'earl'
import { existsSync, readdirSync, readFileSync } from 'fs'
import path from 'path'

const PROJECTS_ROOT = path.join(process.cwd(), '../config/src/projects')

/**
 * The committed changelog.json files are the runtime's only source of watched
 * change history — a stale or hand-edited projection would silently skew
 * scores. These tests pin them to the committed diffHistory.md, and pin every
 * committed criticalEvents updateId to an existing update, so CI fails
 * instead.
 */
describe('ossification changelog integrity', () => {
  const projects = collectOptedInProjects()

  it('covers every opted-in project', () => {
    expect(projects.length).toBeGreaterThan(0)
  })

  for (const project of projects) {
    it(`${project}: changelog.json matches diffHistory.md`, () => {
      const diffHistoryPath = path.join(
        PROJECTS_ROOT,
        project,
        'diffHistory.md',
      )
      const changelogPath = path.join(PROJECTS_ROOT, project, 'changelog.json')
      expect(existsSync(changelogPath)).toEqual(true)
      const expected = serializeDiscoveryChangelog(
        buildDiscoveryChangelog(
          existsSync(diffHistoryPath)
            ? readFileSync(diffHistoryPath, 'utf-8')
            : '',
        ),
      )
      expect(readFileSync(changelogPath, 'utf-8')).toEqual(expected)
    })
  }

  it('every criticalEvents updateId resolves to a discovery update', () => {
    const parser = new DiffHistoryParser()
    const knownIds = new Set<string>()
    for (const project of readdirSync(PROJECTS_ROOT)) {
      const diffHistoryPath = path.join(
        PROJECTS_ROOT,
        project,
        'diffHistory.md',
      )
      if (!existsSync(diffHistoryPath)) continue
      const idFor = createDiffHistoryEntryIdFactory()
      for (const entry of parser.parse(
        readFileSync(diffHistoryPath, 'utf-8'),
      )) {
        knownIds.add(idFor(entry.date, entry.current))
      }
    }

    const unresolved: string[] = []
    for (const project of readdirSync(PROJECTS_ROOT)) {
      const ossificationPath = path.join(
        PROJECTS_ROOT,
        project,
        'ossification.json',
      )
      if (!existsSync(ossificationPath)) continue
      const ossification = JSON.parse(
        readFileSync(ossificationPath, 'utf-8'),
      ) as { criticalEvents?: { updateId?: string; source?: string }[] }
      for (const event of ossification.criticalEvents ?? []) {
        if (event.updateId !== undefined && !knownIds.has(event.updateId)) {
          unresolved.push(`${project}: ${event.updateId} (${event.source})`)
        }
      }
    }
    expect(unresolved).toEqual([])
  })
})

function collectOptedInProjects(): string[] {
  const projects = new Set<string>()
  for (const project of readdirSync(PROJECTS_ROOT)) {
    const ossificationPath = path.join(
      PROJECTS_ROOT,
      project,
      'ossification.json',
    )
    if (!existsSync(ossificationPath)) continue
    projects.add(project)
    const ossification = JSON.parse(
      readFileSync(ossificationPath, 'utf-8'),
    ) as {
      includeProjects?: string[]
    }
    for (const included of ossification.includeProjects ?? []) {
      projects.add(included)
    }
  }
  return [...projects].sort()
}
