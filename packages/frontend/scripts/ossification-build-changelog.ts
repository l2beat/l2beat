/**
 * Generates changelog.json — the machine-readable projection of a project's
 * diffHistory.md watched changes — for every project opted into the
 * ossification factor (ossification.json present), plus its includeProjects.
 *
 * l2b regenerates the file on every discovery run once it exists (see
 * updateDiffHistory.ts); this script seeds it for new opt-ins and, with
 * --check, verifies in CI that the committed projection matches the committed
 * markdown byte for byte.
 *
 * Usage:
 *   pnpm tsx scripts/ossification-build-changelog.ts [projectId ...]
 *   pnpm tsx scripts/ossification-build-changelog.ts --check
 */
import {
  buildDiscoveryChangelog,
  serializeDiscoveryChangelog,
} from '@l2beat/shared'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'

const PROJECTS_ROOT = path.resolve(__dirname, '../../config/src/projects')

function main() {
  const args = process.argv.slice(2)
  const check = args.includes('--check')
  const explicit = args.filter((arg) => arg !== '--check')
  const projects = explicit.length > 0 ? explicit : collectOptedInProjects()

  let failures = 0
  for (const project of projects.sort()) {
    const diffHistoryPath = path.join(PROJECTS_ROOT, project, 'diffHistory.md')
    const changelogPath = path.join(PROJECTS_ROOT, project, 'changelog.json')
    if (!existsSync(diffHistoryPath)) {
      console.error(`${project}: no diffHistory.md`)
      failures++
      continue
    }
    const serialized = serializeDiscoveryChangelog(
      buildDiscoveryChangelog(readFileSync(diffHistoryPath, 'utf-8')),
    )

    if (check) {
      const committed = existsSync(changelogPath)
        ? readFileSync(changelogPath, 'utf-8')
        : undefined
      if (committed === serialized) {
        console.log(`${project}: current`)
      } else {
        console.error(
          `${project}: changelog.json ${
            committed === undefined ? 'is missing' : 'does not match'
          } — run scripts/ossification-build-changelog.ts`,
        )
        failures++
      }
      continue
    }

    writeFileSync(changelogPath, serialized)
    const entryCount = JSON.parse(serialized).entries.length
    console.log(`${project}: wrote ${entryCount} entries`)
  }

  if (failures > 0) {
    process.exit(1)
  }
}

/** Every project with an ossification.json, plus its includeProjects — the
 *  exact set whose discovery history the runtime consumes. */
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
  return [...projects]
}

main()
