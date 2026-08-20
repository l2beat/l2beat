import { compareProject, duplicateIdsMessage } from './compare'
import { SNAPSHOT_DOMAINS } from './registry'
import { readSnapshot } from './types'

for (const domain of SNAPSHOT_DOMAINS) {
  describe(`${domain.name} identities`, () => {
    const current = domain.generate()
    const snapshot = readSnapshot(domain)

    describe('match the committed snapshot', () => {
      // One verdict per project: disappearances (the backend wipes their
      // data), range moves (the backend re-syncs them) and additions are
      // reported together, so a rotation reads as one event.
      const projectIds = [
        ...new Set([...Object.keys(snapshot), ...Object.keys(current)]),
      ].sort()
      for (const projectId of projectIds) {
        it(projectId, () => {
          const message = compareProject(
            domain,
            projectId,
            snapshot[projectId] ?? [],
            current[projectId] ?? [],
          )
          if (message) {
            throw new Error(message)
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
      const duplicates = [...byId.entries()]
        .filter(([, owners]) => owners.length > 1)
        .map(([id, owners]) => ({ id, owners }))
      if (duplicates.length > 0) {
        throw new Error(duplicateIdsMessage(domain, duplicates))
      }
    })
  })
}
