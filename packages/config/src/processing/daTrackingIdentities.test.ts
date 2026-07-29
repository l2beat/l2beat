import { readFileSync } from 'fs'
import {
  type DaTrackingIdentitiesSnapshot,
  generateDaTrackingIdentities,
  getDaTrackingSnapshotPath,
} from './daTrackingIdentities'
import { getProjects } from './getProjects'

const REGENERATE_HINT =
  "If this change is intentional, run 'pnpm da-tracking:snapshot' in packages/config and commit the updated daTrackingIdentities.json - the snapshot diff is the explicit sign-off."

describe('DA tracking identities', () => {
  const current = generateDaTrackingIdentities(getProjects())
  const snapshot: DaTrackingIdentitiesSnapshot = JSON.parse(
    readFileSync(getDaTrackingSnapshotPath(), 'utf8'),
  )

  describe('no previously known identity disappeared', () => {
    for (const [projectId, identities] of Object.entries(snapshot)) {
      it(projectId, () => {
        const currentIds = new Set((current[projectId] ?? []).map((e) => e.id))
        const missing = identities.filter((e) => !currentIds.has(e.id))
        if (missing.length > 0) {
          throw new Error(
            `DA tracking identities disappeared for ${projectId}:\n` +
              missing.map((e) => `- ${e.id} (${e.label})`).join('\n') +
              '\nOn deploy the backend WILL WIPE all DA data indexed under these configurations (ManagedMultiIndexer deletes configurations whose id disappears).\n' +
              REGENERATE_HINT,
          )
        }
      })
    }
  })

  describe('snapshot is up to date', () => {
    for (const [projectId, identities] of Object.entries(current)) {
      it(projectId, () => {
        const snapshotIds = new Set(
          (snapshot[projectId] ?? []).map((e) => e.id),
        )
        const unknown = identities.filter((e) => !snapshotIds.has(e.id))
        if (unknown.length > 0) {
          throw new Error(
            `DA tracking identities not present in the snapshot for ${projectId}:\n` +
              unknown.map((e) => `- ${e.id} (${e.label})`).join('\n') +
              `\n${REGENERATE_HINT}`,
          )
        }
      })
    }
  })
})
