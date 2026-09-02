import {
  createDiffHistoryEntryIdFactory,
  DiffHistoryParser,
  type DiscoveryChangelog,
} from '@l2beat/shared'
import { expect } from 'earl'
import { existsSync, readdirSync, readFileSync } from 'fs'
import path from 'path'

const PROJECTS_ROOT = path.join(process.cwd(), '../config/src/projects')

/**
 * changelog.json is the runtime's only source of watched change history. l2b
 * writes it alongside diffHistory.md, so the two share entry identity; these
 * tests pin that contract for every opted-in project — every entry in the
 * changelog is a real diffHistory entry, every diffHistory entry with watched
 * changes is in the changelog — and pin every criticalEvents updateId to an
 * entry it can act on.
 */
describe('ossification changelog integrity', () => {
  const projects = collectOptedInProjects()
  const parser = new DiffHistoryParser()

  it('covers every opted-in project', () => {
    expect(projects.length).toBeGreaterThan(0)
  })

  for (const project of projects) {
    it(`${project}: changelog.json mirrors the diffHistory.md entries`, () => {
      const changelog = readChangelog(project)
      expect(changelog?.formatVersion).toEqual(1)
      const ids = (changelog?.entries ?? []).map((entry) => entry.id)
      expect(new Set(ids).size).toEqual(ids.length)

      const diffHistoryPath = path.join(
        PROJECTS_ROOT,
        project,
        'diffHistory.md',
      )
      const idFor = createDiffHistoryEntryIdFactory()
      const expected: string[] = []
      for (const entry of parser.parse(
        existsSync(diffHistoryPath)
          ? readFileSync(diffHistoryPath, 'utf-8')
          : '',
      )) {
        const id = idFor(entry.date, entry.current)
        const hasWatchedChanges = entry.sections.some(
          (section) =>
            section.kind === 'watched-changes' && section.body.length > 0,
        )
        if (hasWatchedChanges) expected.push(id)
      }
      expect(ids).toEqual(expected)
    })
  }

  it('every criticalEvents updateId resolves to a changelog entry', () => {
    const unresolved: string[] = []
    for (const project of readdirSync(PROJECTS_ROOT)) {
      const ossification = readOssification(project)
      if (!ossification) continue
      const knownIds = new Set<string>()
      for (const id of [project, ...(ossification.includeProjects ?? [])]) {
        for (const entry of readChangelog(id)?.entries ?? []) {
          knownIds.add(entry.id)
        }
      }
      for (const event of ossification.criticalEvents ?? []) {
        if (event.updateId !== undefined && !knownIds.has(event.updateId)) {
          unresolved.push(`${project}: ${event.updateId} (${event.source})`)
        }
      }
    }
    expect(unresolved).toEqual([])
  })
})

interface OssificationJson {
  includeProjects?: string[]
  criticalEvents?: { updateId?: string; source?: string }[]
}

function readOssification(project: string): OssificationJson | undefined {
  const file = path.join(PROJECTS_ROOT, project, 'ossification.json')
  if (!existsSync(file)) return undefined
  return JSON.parse(readFileSync(file, 'utf-8')) as OssificationJson
}

function readChangelog(project: string): DiscoveryChangelog | undefined {
  const file = path.join(PROJECTS_ROOT, project, 'changelog.json')
  if (!existsSync(file)) return undefined
  return JSON.parse(readFileSync(file, 'utf-8')) as DiscoveryChangelog
}

function collectOptedInProjects(): string[] {
  const projects = new Set<string>()
  for (const project of readdirSync(PROJECTS_ROOT)) {
    const ossification = readOssification(project)
    if (!ossification) continue
    projects.add(project)
    for (const included of ossification.includeProjects ?? []) {
      projects.add(included)
    }
  }
  return [...projects].sort()
}
