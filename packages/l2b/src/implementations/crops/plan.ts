import type { CropAttestation, CropAttestationLedger } from '@l2beat/config'
import type { Hex } from 'viem'
import {
  type CropPayload,
  decodePayload,
  isCurrentSchema,
  type OnchainAttestation,
} from './eas'

/** A live ledger entry to revoke, under the schema the chain says it was attested with. */
export interface Revocation {
  entry: CropAttestation
  schema: Hex
}

/**
 * One decision: is exactly one attestation live, under the current schema,
 * by our attester, naming exactly the projects config names? That one is
 * the keeper. Every other live uid is revoked, and a new attestation is
 * issued only when there is no keeper. Each variant carries exactly what
 * executing it needs.
 */
export type AttestPlan =
  | { kind: 'unchanged'; keeper: CropAttestation }
  | { kind: 'prune'; keeper: CropAttestation; revoke: Revocation[] }
  | {
      kind: 'attest'
      revoke: Revocation[]
      payload: CropPayload
      added: string[]
      removed: string[]
      reason: string
    }

export interface PlanInput {
  /** Sorted. */
  projectIds: string[]
  ledger: CropAttestationLedger
  /** By uid. */
  onchain: Map<Hex, OnchainAttestation>
  now: number
}

export function planAttestation(input: PlanInput): AttestPlan {
  const entries = input.ledger.live
  // The ledger is a cache; the chain decides what is live and what it says.
  const live = entries.flatMap((entry) => {
    const onchain = input.onchain.get(entry.uid)
    return onchain && onchain.revocationTime === 0 ? [{ entry, onchain }] : []
  })
  const keeper = live.find(
    ({ onchain }) =>
      isCurrentSchema(onchain.schema) &&
      isSameAddress(onchain.attester, input.ledger.attester) &&
      setMatches(decodePayload(onchain.data).projectIds, input.projectIds),
  )
  const revoke: Revocation[] = live
    .filter((x) => x !== keeper)
    .map((x) => ({ entry: x.entry, schema: x.onchain.schema }))

  if (keeper) {
    return revoke.length === 0
      ? { kind: 'unchanged', keeper: keeper.entry }
      : { kind: 'prune', keeper: keeper.entry, revoke }
  }

  const covered = live.flatMap(({ onchain }) =>
    isCurrentSchema(onchain.schema)
      ? decodePayload(onchain.data).projectIds
      : [],
  )
  const { added, removed } = diffSet(input.projectIds, covered)
  const changes = [
    ...added.map((id) => `+${id}`),
    ...removed.map((id) => `-${id}`),
  ]
  return {
    kind: 'attest',
    revoke,
    payload: {
      projectIds: [...input.projectIds].sort(),
      reviewedAt: input.now,
      revision: nextRevision(entries),
    },
    added,
    removed,
    reason:
      live.length === 0
        ? 'nothing is live onchain'
        : changes.length > 0
          ? changes.join(' ')
          : 'attested under a superseded schema or by another attester',
  }
}

/** One line per plan, for the header of crops-attest and the verdict of crops-verify. */
export function describePlan(plan: AttestPlan): string {
  switch (plan.kind) {
    case 'unchanged':
      return `revision ${plan.keeper.revision} matches config`
    case 'prune':
      return `revision ${plan.keeper.revision} matches config, but ${plan.revoke.length} older attestation(s) are still live`
    case 'attest':
      return `revision ${plan.payload.revision} needed: ${plan.reason}`
  }
}

/**
 * Where the committed ledger disagrees with the chain it caches. crops-attest
 * plans from the chain and rewrites the ledger, so it never minds; crops-verify
 * fails, because the API serves the ledger.
 */
export function findLedgerDrift(
  ledger: CropAttestationLedger,
  onchain: Map<Hex, OnchainAttestation>,
): string[] {
  const problems: string[] = []
  for (const entry of ledger.live) {
    const label = `rev ${entry.revision} (${entry.uid})`
    const found = onchain.get(entry.uid)
    if (!found) {
      problems.push(`${label}: does not exist onchain`)
      continue
    }
    if (found.revocationTime !== 0) {
      problems.push(`${label}: is revoked onchain but live in the ledger`)
      continue
    }
    if (!isSameAddress(found.attester, ledger.attester)) {
      problems.push(
        `${label}: attested by ${found.attester}, the ledger says ${ledger.attester}`,
      )
    }
    if (!isSameAddress(found.schema, entry.schema)) {
      problems.push(
        `${label}: attested under schema ${found.schema}, the ledger says ${entry.schema}`,
      )
    } else if (isCurrentSchema(found.schema)) {
      const named = decodePayload(found.data).projectIds
      if (!setMatches(named, entry.projectIds)) {
        problems.push(
          `${label}: names ${named.length} projects onchain, the ledger says ${entry.projectIds.length}`,
        )
      }
    }
  }
  return problems
}

export function setMatches(a: string[], b: string[]): boolean {
  if (a.length !== b.length) {
    return false
  }
  const sortedB = [...b].sort()
  return [...a].sort().every((id, i) => id === sortedB[i])
}

export function diffSet(
  wanted: string[],
  current: string[],
): { added: string[]; removed: string[] } {
  return {
    added: wanted.filter((x) => !current.includes(x)),
    removed: current.filter((x) => !wanted.includes(x)),
  }
}

/** Hex from the chain is lowercase; config keeps checksums. */
function isSameAddress(a: string, b: string | undefined): boolean {
  return b !== undefined && a.toLowerCase() === b.toLowerCase()
}

function nextRevision(entries: CropAttestation[]): number {
  return Math.max(0, ...entries.map((x) => x.revision)) + 1
}
