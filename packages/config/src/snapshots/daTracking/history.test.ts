import { existsSync, readdirSync } from 'fs'
import { join } from 'path'
import { getProjects } from '../../processing/getProjects'
import {
  daTrackingHistoryPath,
  daTrackingIdentity,
  getDaTrackingResolutions,
  readDaTrackingHistoryFile,
} from '../../templates/daTrackingHistory'

const UPDATE_HINT =
  "Run 'pnpm da:history <project>' in packages/config and commit the updated " +
  'daTracking.json together with the discovery change (plus the regenerated ' +
  'snapshot). The file is machine-maintained - do not edit it by hand.'

describe('daTracking history files', () => {
  // Evaluating the projects fills the template resolution registry
  getProjects()
  const resolutions = getDaTrackingResolutions()

  describe('history matches the current template derivation', () => {
    for (const [projectName, resolution] of resolutions) {
      if (resolution.source !== 'history') continue
      it(projectName, () => {
        const file = readDaTrackingHistoryFile(projectName)
        if (!file) {
          throw new Error(
            `daTracking.json for ${projectName} disappeared mid-run`,
          )
        }
        const openIdentities = file.eras
          .filter((era) => era.untilBlock === undefined)
          .map(daTrackingIdentity)
          .sort()
        const derivedIdentities = (resolution.derived ?? [])
          .map(daTrackingIdentity)
          .sort()
        const equal =
          openIdentities.length === derivedIdentities.length &&
          openIdentities.every((id, i) => id === derivedIdentities[i])
        if (!equal) {
          throw new Error(
            `daTracking history for ${projectName} is out of date with discovery: ` +
              `open eras [${openIdentities.join(', ')}] vs template derivation ` +
              `[${derivedIdentities.join(', ')}] (a DA-relevant value rotated ` +
              'on-chain, or the project switched DA layers).\n' +
              UPDATE_HINT,
          )
        }
      })
    }
  })

  describe('every template-derived project has a history file', () => {
    for (const [projectName, resolution] of resolutions) {
      if (resolution.source !== 'derived') continue
      if ((resolution.derived ?? []).length === 0) continue
      it(projectName, () => {
        throw new Error(
          `${projectName} derives daTracking from discovery but has no ` +
            'committed daTracking.json - without it a rotation silently ' +
            `replaces the era and the backend wipes its data.\n${UPDATE_HINT}`,
        )
      })
    }
  })

  it('has no orphaned daTracking.json files', () => {
    const projectsDir = join(__dirname, '../../../src/projects')
    const orphans = readdirSync(projectsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .filter((name) => existsSync(daTrackingHistoryPath(name)))
      .filter((name) => resolutions.get(name)?.source !== 'history')
    if (orphans.length > 0) {
      throw new Error(
        `daTracking.json exists but is not read by any template for: ${orphans.join(', ')}. ` +
          'Either the project sets nonTemplateDaTracking (the override wins - delete the ' +
          'file or drop the override) or the project was renamed/removed (delete the file ' +
          'after making sure the eras were preserved where needed).',
      )
    }
  })
})
