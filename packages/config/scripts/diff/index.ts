import { readFileSync, writeFileSync } from 'fs'
import { Database } from 'sqlite3'
import { diffAll } from './diff'
import { diffsToHtml } from './html'
import { diffsToText } from './text'
import type { Project } from './types'

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})

async function main() {
  const args = process.argv.slice(2)
  if (args.length !== 2) {
    throw new Error('Usage: index.ts <output.html> <output.txt>')
  }
  const [htmlPath, textPath] = args

  const dbBefore = new Database('/tmp/compare/main/db.sqlite')
  const dbAfter = new Database('/tmp/compare/pr/db.sqlite')

  const commitBefore = readFileSync('/tmp/compare/main/commit', 'utf-8').trim()
  const commitAfter = readFileSync('/tmp/compare/pr/commit', 'utf-8').trim()

  const projectsBefore = (await query(dbBefore, 'SELECT * FROM projects'))
    .map(parseProject)
    .sort((a, b) => a.id.localeCompare(b.id))
  const projectsAfter = (await query(dbAfter, 'SELECT * FROM projects'))
    .map(parseProject)
    .sort((a, b) => a.id.localeCompare(b.id))

  const diffs = diffAll(projectsBefore, projectsAfter)

  if (diffs.length === 0) {
    writeFileSync(htmlPath, 'No changes detected')
    writeFileSync(textPath, 'No changes detected')
    return
  }

  writeFileSync(htmlPath, diffsToHtml({ diffs, commitBefore, commitAfter }))
  writeFileSync(
    textPath,
    diffsToText({ projectsBefore, projectsAfter, commitBefore, commitAfter }),
  )
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
