import { readFileSync } from 'fs'
import { SNAPSHOT_DOMAINS } from './registry'
import type { Snapshot } from './types'

const REGENERATE_HINT =
  "If this change is intentional, run 'pnpm snapshots:generate' in packages/config and commit the updated snapshot - the snapshot diff is the explicit sign-off."

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
                `\n${domain.wipeWarning}\n${REGENERATE_HINT}`,
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
              `${domain.name} identities not present in the snapshot for ${projectId}:\n` +
                unknown.map((e) => `- ${e.id} (${e.label})`).join('\n') +
                `\n${REGENERATE_HINT}`,
            )
          }
        })
      }
    })

    describe('no duplicate identities', () => {
      // Duplicate ids mean two configs hash to the same backend
      // configuration id - the indexer cannot tell them apart.
      it('within a project', () => {
        const errors: string[] = []
        for (const [projectId, identities] of Object.entries(current)) {
          const seen = new Map<string, string>()
          for (const identity of identities) {
            const first = seen.get(identity.id)
            if (first !== undefined) {
              errors.push(
                `- ${projectId}: ${identity.id} (${first} / ${identity.label})`,
              )
            } else {
              seen.set(identity.id, identity.label)
            }
          }
        }
        if (errors.length > 0) {
          throw new Error(
            `${domain.name} has duplicate identities within a project:\n${errors.join('\n')}`,
          )
        }
      })

      it('across projects', () => {
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
          .filter(
            ([, owners]) => new Set(owners.map((o) => o.projectId)).size > 1,
          )
          .map(
            ([id, owners]) =>
              `- ${id}: ${owners.map((o) => `${o.projectId} (${o.label})`).join(', ')}`,
          )
        if (errors.length > 0) {
          throw new Error(
            `${domain.name} has identities shared by multiple projects:\n${errors.join('\n')}`,
          )
        }
      })
    })
  })
}
