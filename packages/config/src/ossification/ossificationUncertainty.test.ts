import { getDiscoveryPaths } from '@l2beat/discovery'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { existsSync, readdirSync } from 'fs'
import { join } from 'path'
import { loadOssificationInput, readPatch } from './getOssification'
import { getUncertainNewestChange } from './measureOssification'

/** The newest change sets the project clock and with it the whole score. A
 *  change we only know to have happened between two discovery runs must not
 *  quietly stand there: the review either dates it with a reviewed event or
 *  accepts the interval in ossification.json. */
describe('ossification newest change', () => {
  it('is dated onchain, reviewed, or accepted for every project', function () {
    this.timeout(120_000)
    const root = getDiscoveryPaths().discovery
    const now = UnixTime.now()
    const problems: string[] = []
    for (const project of readdirSync(root)) {
      const projectPath = join(root, project)
      if (!existsSync(join(projectPath, 'discovered.json'))) continue
      const input = loadOssificationInput(project, now)
      if (input === undefined) continue
      const uncertain = getUncertainNewestChange(input)
      if (uncertain === undefined) continue
      const patch = readPatch(join(projectPath, 'ossification.json'))
      if (
        uncertain.updateId !== undefined &&
        patch.acceptedIntervals.includes(uncertain.updateId)
      ) {
        continue
      }
      problems.push(
        `${project}: the newest change (${uncertain.type}, update ${uncertain.updateId ?? 'unknown'}) is only known to lie between ${uncertain.earliest ?? 'unknown'} and ${uncertain.timestamp}. Add a reviewed event with the exact time, or list the update in acceptedIntervals.`,
      )
    }
    expect(problems).toEqual([])
  })
})
