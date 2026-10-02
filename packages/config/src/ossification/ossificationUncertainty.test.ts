import { getDiscoveryPaths } from '@l2beat/discovery'
import { getUncertainNewestChange } from '@l2beat/shared'
import { expect } from 'earl'
import { existsSync, readdirSync } from 'fs'
import { join } from 'path'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { readPatch } from './loadOssificationHistory'

/** The newest change sets the project clock and with it the whole score. A
 *  change we only know to have happened between two discovery runs must not
 *  quietly stand there: the review either dates it with a reviewed event or
 *  accepts the interval in ossification.json. */
describe('ossification newest change', () => {
  it('is dated onchain, reviewed, or accepted for every project', function () {
    this.timeout(120_000)
    const root = getDiscoveryPaths().discovery
    const problems: string[] = []
    for (const project of readdirSync(root)) {
      const projectPath = join(root, project)
      if (!existsSync(join(projectPath, 'discovered.json'))) continue
      const discovery = new ProjectDiscovery(project)
      const history = discovery.getOssificationHistory()
      if (history === undefined) continue
      const uncertain = getUncertainNewestChange(history)
      if (uncertain === undefined) continue
      const acceptedIntervals = discovery.configReader
        .readDiscoveryWithReferences(project)
        .flatMap(
          ({ name }) =>
            readPatch(join(root, name, 'ossification.json')).acceptedIntervals,
        )
      if (
        uncertain.updateId !== undefined &&
        acceptedIntervals.includes(uncertain.updateId)
      ) {
        continue
      }
      problems.push(
        `${project}: the newest change (${uncertain.type}, update ${uncertain.updateId ?? 'unknown'}) is only known to lie between ${uncertain.earliest ?? 'unknown'} and ${uncertain.timestamp}. Add a reviewed event with the exact time, or list the update in acceptedIntervals of the discovery whose diffHistory.md has it.`,
      )
    }
    expect(problems).toEqual([])
  })
})
