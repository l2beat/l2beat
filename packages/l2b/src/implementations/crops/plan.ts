import type { CropAttestation, HexString } from '@l2beat/config'
import type { OnchainAttestation, Revocation } from './easClient'
import { type CropPayload, decodePayload, diffSet, setMatches } from './payload'

export type AttestPlanKind = 'unchanged' | 'new' | 'changed'

export interface AttestPlan {
  kind: AttestPlanKind
  /** Sorted. */
  projectIds: string[]
  /** The live attestation that already says exactly that, if there is one. */
  keeper: CropAttestation | undefined
  /** Against what the ledger currently covers. */
  added: string[]
  removed: string[]
  revoke: Revocation[]
  /** Absent when the keeper already says it. */
  payload: CropPayload | undefined
  reason: string
}

export interface PlanInput {
  /** Sorted. */
  projectIds: string[]
  ledger: CropAttestation[]
  /** By uid. */
  onchain: Map<string, OnchainAttestation>
  /** Anything attested under another schema is superseded. */
  schemaUid: HexString
  now: number
}

/**
 * One decision: is exactly one attestation live, under the current schema,
 * naming exactly the projects config names? Anything else is replaced, and
 * every other live uid is revoked in the same run - two live attestations
 * would leave a reader unable to tell which one speaks for us.
 */
export function planAttestation(input: PlanInput): AttestPlan {
  const live = input.ledger.flatMap((entry) => {
    const onchain = input.onchain.get(entry.uid)
    return onchain && onchain.revocationTime === 0 ? [{ entry, onchain }] : []
  })

  // The ledger is a cache; the chain decides.
  const keeper = live.find(
    ({ onchain }) =>
      isCurrentSchema(onchain.schema, input.schemaUid) &&
      setMatches(decodePayload(onchain.data).projectIds, input.projectIds),
  )

  const revoke: Revocation[] = live
    .filter((x) => x.entry.uid !== keeper?.entry.uid)
    .map((x) => ({ uid: x.entry.uid, schema: x.onchain.schema }))

  const { added, removed } = diffSet(input.projectIds, coveredIds(input.ledger))

  if (keeper && revoke.length === 0) {
    return {
      kind: 'unchanged',
      projectIds: input.projectIds,
      keeper: keeper.entry,
      added: [],
      removed: [],
      revoke: [],
      payload: undefined,
      reason: 'matches config',
    }
  }

  return {
    kind: live.length === 0 ? 'new' : 'changed',
    projectIds: input.projectIds,
    keeper: keeper?.entry,
    added,
    removed,
    revoke,
    payload: keeper
      ? undefined
      : {
          projectIds: input.projectIds,
          reviewedAt: input.now,
          revision: nextRevision(input.ledger),
        },
    reason: reasonFor(live.length, keeper !== undefined, added, removed),
  }
}

function isCurrentSchema(schema: string, schemaUid: string): boolean {
  return schema.toLowerCase() === schemaUid.toLowerCase()
}

function coveredIds(ledger: CropAttestation[]): string[] {
  return [...new Set(ledger.flatMap((x) => x.projectIds))].sort()
}

function nextRevision(ledger: CropAttestation[]): number {
  return Math.max(0, ...ledger.map((x) => x.revision)) + 1
}

function reasonFor(
  liveCount: number,
  hasKeeper: boolean,
  added: string[],
  removed: string[],
): string {
  if (liveCount === 0) {
    return 'nothing attested yet'
  }
  if (hasKeeper) {
    return 'set is current, but older attestations are still live'
  }
  const changes = [
    ...added.map((id) => `+${id}`),
    ...removed.map((id) => `-${id}`),
  ]
  return changes.length > 0
    ? changes.join(' ')
    : 'attested under a superseded schema'
}
