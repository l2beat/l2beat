import type { CropAttestation } from '@l2beat/config/build/crops/attestations'
import { ATTESTATION_SCHEMA_UID } from '@l2beat/config/build/crops/eas'
import type { Hex } from 'viem'
import type { OnchainAttestation, Revocation } from './easClient'
import { type CropPayload, decodePayload, diffSet, setMatches } from './payload'

export type AttestPlanKind = 'unchanged' | 'new' | 'changed'

export interface AttestPlan {
  kind: AttestPlanKind
  /** The set config says we stand behind, sorted. */
  projectIds: string[]
  /** The live attestation that already says exactly that, if there is one. */
  keeper: CropAttestation | undefined
  /** Ids gained and lost against what the ledger currently covers. */
  added: string[]
  removed: string[]
  /** Everything live onchain that this run should revoke. */
  revoke: Revocation[]
  /** The attestation to publish. Absent when the keeper already says it. */
  payload: CropPayload | undefined
  reason: string
}

export interface PlanInput {
  /** Project ids declaring crops in config, sorted. */
  projectIds: string[]
  /** What the committed ledger claims is live. */
  ledger: CropAttestation[]
  /** Onchain state for every uid in the ledger, by uid. */
  onchain: Map<string, OnchainAttestation>
  /** Timestamp stamped on a new attestation. */
  now: number
}

/**
 * The whole set is one attestation, so there is one decision to make rather
 * than one per project: is exactly one attestation live, under the current
 * schema, naming exactly the projects config names?
 *
 * Anything else is replaced, and every other live uid we know about is revoked
 * in the same run. Two live attestations would leave a reader no way to tell
 * which one speaks for us, which is worse than a brief gap with none.
 */
export function planAttestation(input: PlanInput): AttestPlan {
  const live = input.ledger.flatMap((entry) => {
    const onchain = input.onchain.get(entry.uid)
    return onchain && onchain.revocationTime === 0 ? [{ entry, onchain }] : []
  })

  // The ledger is a cache; the chain decides. Reading the set back out means a
  // hand-edited ledger cannot make us skip a publish we actually owe.
  const keeper = live.find(
    ({ onchain }) =>
      isCurrentSchema(onchain.schema) &&
      setMatches(decodePayload(onchain.data).projectIds, input.projectIds),
  )

  const revoke: Revocation[] = live
    .filter((x) => x.entry.uid !== keeper?.entry.uid)
    .map((x) => ({ uid: x.entry.uid as Hex, schema: x.onchain.schema }))

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

function isCurrentSchema(schema: string): boolean {
  return schema.toLowerCase() === ATTESTATION_SCHEMA_UID.toLowerCase()
}

/** What the ledger says we cover today, across however many attestations. */
function coveredIds(ledger: CropAttestation[]): string[] {
  return [...new Set(ledger.flatMap((x) => x.projectIds))].sort()
}

/** Monotonic across revocations, so a revision is never reused. */
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
