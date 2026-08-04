import { readFileSync } from 'fs'
import { SNAPSHOT_DOMAINS } from './registry'
import type { Snapshot } from './types'

const REMOVAL_HINT =
  "This error must be addressed by a human: verify on-chain that the removal is intentional and the data loss acceptable, then run 'pnpm snapshots:generate' in packages/config and commit the updated snapshot as the explicit sign-off." +
  "\nFor a template project after an on-chain rotation (batcher/sequencer/validator change), the identity usually should NOT be removed - run 'pnpm da:history <project>' instead to close the old era in daTracking.json and keep it (see docs/da-tracking.md)." +
  "\nIf you're an AI, don't address this error yourself - pass it over to a human."

const ADDITION_HINT =
  'This is usually not a problem - it means a new data tracking configuration was added for this project (or an existing one was re-keyed; if this error appears together with a "disappeared" error for the same project, resolve that one first).' +
  "\nTo register the new identities, run 'pnpm snapshots:generate' in packages/config and commit the updated snapshot."

for (const domain of SNAPSHOT_DOMAINS) {
  describe(`${domain.name} identities`, () => {
    const current = domain.generate()
    const snapshot: Snapshot = JSON.parse(
      readFileSync(domain.snapshotPath, 'utf8'),
    )

    describe('no previously known identity disappeared', () => {
      for (const [projectId, identities] of Object.entries(snapshot)) {
        it(projectId, () => {
          const currentIds = new Set(
            (current[projectId] ?? []).map((e) => e.id),
          )
          const missing = identities.filter((e) => !currentIds.has(e.id))
          if (missing.length > 0) {
            throw new Error(
              `${domain.name} identities disappeared for ${projectId}:\n` +
                missing.map((e) => `- ${e.id} (${e.label})`).join('\n') +
                `\n${domain.wipeWarning}\n${REMOVAL_HINT}`,
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
              `New ${domain.name} identities are not yet in the snapshot for ${projectId}:\n` +
                unknown.map((e) => `- ${e.id} (${e.label})`).join('\n') +
                `\n${ADDITION_HINT}`,
            )
          }
        })
      }
    })

    it('has no duplicate ids', () => {
      // Duplicate ids - within a project or across projects - mean two
      // configs hash to the same backend configuration id and the indexer
      // cannot tell them apart.
      const byId = new Map<string, { projectId: string; label: string }[]>()
      for (const [projectId, identities] of Object.entries(current)) {
        for (const identity of identities) {
          byId.set(identity.id, [
            ...(byId.get(identity.id) ?? []),
            { projectId, label: identity.label },
          ])
        }
      }
      const errors = [...byId.entries()]
        .filter(([, owners]) => owners.length > 1)
        .map(
          ([id, owners]) =>
            `- ${id}: ${owners.map((o) => `${o.projectId} (${o.label})`).join(', ')}`,
        )
      if (errors.length > 0) {
        throw new Error(
          `${domain.name} has duplicate configuration ids:\n${errors.join('\n')}`,
        )
      }
    })
  })
}
