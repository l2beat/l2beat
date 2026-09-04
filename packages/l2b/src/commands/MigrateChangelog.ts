import { ConfigReader, getDiscoveryPaths } from '@l2beat/discovery'
import { serializeDiscoveryChangelog } from '@l2beat/shared'
import { command, positional, restPositionals, string } from 'cmd-ts'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { changelogFromDiffHistory } from '../implementations/discovery/changelog/migrateChangelog'

export const MigrateChangelog = command({
  name: 'migrate-changelog',
  description:
    'Builds changelog.json from the existing diffHistory.md of a project. Run once when a project opts into the ossification factor; from then on every discovery run records new entries directly.',
  version: '1.0.0',
  args: {
    project: positional({ type: string, displayName: 'project' }),
    projects: restPositionals({ type: string, displayName: 'project' }),
  },
  handler: (args) => {
    const configReader = new ConfigReader(getDiscoveryPaths().discovery)
    for (const project of [args.project, ...args.projects]) {
      const folder = configReader.getProjectPath(project)
      const diffHistoryPath = path.join(folder, 'diffHistory.md')
      if (!existsSync(diffHistoryPath)) {
        throw new Error(`${project}: no diffHistory.md to migrate`)
      }
      const changelog = changelogFromDiffHistory(
        readFileSync(diffHistoryPath, 'utf-8'),
      )
      writeFileSync(
        path.join(folder, 'changelog.json'),
        serializeDiscoveryChangelog(changelog),
      )
      console.log(`${project}: ${changelog.entries.length} entries`)
    }
  },
})
