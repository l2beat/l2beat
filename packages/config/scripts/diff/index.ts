import { readFileSync, writeFileSync } from 'fs'
import { Database } from 'sqlite3'
import { diffAll } from './diff'
import { diffsToHtml } from './html'
import type { Project } from './types'

main()

async function main() {
  const args = process.argv.slice(2)
  if (args.length !== 1) {
    throw new Error('Invalid argument count')
  }
  const outputPath = args[0]

  const dbBefore = new Database('/tmp/compare/main/db.sqlite')
  const dbAfter = new Database('/tmp/compare/pr/db.sqlite')

  const commitBefore = readFileSync('/tmp/compare/main/commit', 'utf-8').trim()
  const commitAfter = readFileSync('/tmp/compare/pr/commit', 'utf-8').trim()

  const projectBefore = (await query(dbBefore, 'SELECT * FROM projects'))
    .map(parseProject)
    .sort((a, b) => a.id.localeCompare(b.id))
  const projectsAfter = (await query(dbAfter, 'SELECT * FROM projects'))
    .map(parseProject)
    .sort((a, b) => a.id.localeCompare(b.id))

  const diffs = diffAll(projectBefore, projectsAfter)

  if (diffs.length === 0) {
    writeFileSync(outputPath, 'No changes detected')
    return
  }

  const html = diffsToHtml({ diffs, commitBefore, commitAfter })
  writeFileSync(outputPath, html)
}

function query(
  db: Database,
  query: string,
  values?: unknown[],
): Promise<unknown[]> {
  return new Promise<unknown[]>((resolve, reject) => {
    db.all(query, values, (err: Error | null, rows: unknown[]) => {
      if (err) reject(err)
      resolve(rows)
    })
  })
}

function parseProject(project: unknown) {
  if (typeof project !== 'object' || project === null) {
    throw new Error('Invalid project')
  }
  for (const key in project) {
    const value = Reflect.get(project, key)
    if (typeof value === 'string') {
      try {
        Reflect.set(project, key, JSON.parse(value))
      } catch {
        Reflect.set(project, key, value)
      }
    }
  }
  return project as Project
}
