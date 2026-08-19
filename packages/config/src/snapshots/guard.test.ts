import { readFileSync } from 'fs'
import {
  additionMessage,
  duplicateIdsMessage,
  gapMessage,
  rangeChangeMessage,
  removalMessage,
} from './messages'
import { findRangeChanges } from './ranges'
import { SNAPSHOT_DOMAINS } from './registry'
import type { Snapshot } from './types'

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
            throw new Error(removalMessage(domain, projectId, missing))
          }
        })
      }
    })

    describe('no previously known range changed', () => {
      // A moved range is as destructive as a removed id: the backend
      // re-syncs the configuration from its new 'since' and drops whatever
      // falls outside the new range. Ranges are usually discovery-driven, so
      // this catches drift nobody typed by hand.
      for (const [projectId, identities] of Object.entries(snapshot)) {
        it(projectId, () => {
          const changes = findRangeChanges(identities, current[projectId] ?? [])
          if (changes.length > 0) {
            throw new Error(rangeChangeMessage(domain, projectId, changes))
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
            throw new Error(additionMessage(domain, projectId, unknown))
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

    const findConfigViolations = domain.findConfigViolations
    if (findConfigViolations) {
      it('leaves no gap between consecutive ranges', () => {
        // Checked against the configs, not the snapshot file - a project
        // that stops being tracked and resumes later has a hole in its data
        // that regenerating the snapshot would not reveal.
        const violations = findConfigViolations()
        if (violations.length > 0) {
          throw new Error(gapMessage(domain, violations))
        }
      })
    }
  })
}
