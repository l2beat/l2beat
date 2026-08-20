import { readFileSync } from 'fs'
import groupBy from 'lodash/groupBy'
import {
  additionMessage,
  diffSnapshots,
  duplicateIdsMessage,
  rangeChangeMessage,
  removalMessage,
} from './compare'
import { SNAPSHOT_DOMAINS } from './registry'
import type { Snapshot } from './types'

for (const domain of SNAPSHOT_DOMAINS) {
  describe(`${domain.name} identities`, () => {
    const current = domain.generate()
    const snapshot: Snapshot = JSON.parse(
      readFileSync(domain.snapshotPath, 'utf8'),
    )
    const diff = diffSnapshots(snapshot, current)

    describe('no previously known identity disappeared', () => {
      const missing = groupBy(diff.missing, (e) => e.projectId)
      for (const projectId of Object.keys(snapshot)) {
        it(projectId, () => {
          if (missing[projectId]) {
            throw new Error(
              removalMessage(domain, projectId, missing[projectId]),
            )
          }
        })
      }
    })

    describe('no previously known range changed', () => {
      // A moved range is as destructive as a removed id: the backend trims or
      // re-indexes the configuration to the new range. Ranges are often
      // discovery-driven, so this catches drift nobody typed by hand.
      const changed = groupBy(diff.rangeChanges, (e) => e.projectId)
      for (const projectId of Object.keys(snapshot)) {
        it(projectId, () => {
          if (changed[projectId]) {
            throw new Error(
              rangeChangeMessage(domain, projectId, changed[projectId]),
            )
          }
        })
      }
    })

    describe('snapshot is up to date', () => {
      const added = groupBy(diff.added, (e) => e.projectId)
      for (const projectId of Object.keys(current)) {
        it(projectId, () => {
          if (added[projectId]) {
            throw new Error(
              additionMessage(domain, projectId, added[projectId]),
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
      const duplicates = [...byId.entries()]
        .filter(([, owners]) => owners.length > 1)
        .map(([id, owners]) => ({ id, owners }))
      if (duplicates.length > 0) {
        throw new Error(duplicateIdsMessage(domain, duplicates))
      }
    })
  })
}
