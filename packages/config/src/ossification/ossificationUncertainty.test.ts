import { ConfigReader, getDiscoveryPaths } from '@l2beat/discovery'
import { getUncertainNewestChange } from '@l2beat/shared'
import { expect } from 'earl'
import { join } from 'path'
import { getProjects } from '../processing/getProjects'
import { readPatch } from './loadOssificationHistory'

/** The newest change sets the project clock and with it the whole score. A
 *  change we only know to have happened between two discovery runs must not
 *  quietly stand there: the review either dates it with a reviewed event or
 *  accepts the interval in ossification.json. */
describe('ossification newest change', () => {
  it('is dated onchain, reviewed, or accepted for every project', () => {
    const root = getDiscoveryPaths().discovery
    const configReader = new ConfigReader(root)
    const problems: string[] = []
    for (const project of getProjects()) {
      const history = project.ossificationHistory
      if (history === undefined) continue
      const uncertain = getUncertainNewestChange(history)
      if (uncertain === undefined) continue
      const acceptedIntervals = configReader
        .readDiscoveryWithReferences(project.id)
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
        `${project.id}: the newest change (${uncertain.type}, update ${uncertain.updateId ?? 'unknown'}) is only known to lie between ${uncertain.earliest ?? 'unknown'} and ${uncertain.timestamp}. Add a reviewed event with the exact time, or list the update in acceptedIntervals of the discovery whose diffHistory.md has it.`,
      )
    }
    expect(problems).toEqual([])
  })
})
