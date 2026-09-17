import type { CropAttestation, CropAttestationLedger } from '@l2beat/config'
import { type Hex, zeroHash } from 'viem'
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

/** Publishing the current set as a new revision, and retiring whatever says something else. */
export interface AttestAction {
  kind: 'attest'
  revoke: Revocation[]
  payload: CropPayload
  /** What the new attestation chains to through refUID; zero when nothing is live. */
  replaces: Hex
  added: string[]
  removed: string[]
  reason: string
}

/**
 * Two questions, one shape. `planAttestation` asks whether the chain already
 * agrees with config - exactly one attestation live, under the current schema,
 * by our attester, naming exactly the projects config names - which is what
 * crops-verify gates on. `planPublication` asks what to send, and always
 * answers with an attestation.
 */
export type AttestPlan =
  | { kind: 'unchanged'; keeper: CropAttestation }
  | { kind: 'prune'; keeper: CropAttestation; revoke: Revocation[] }
  | AttestAction

export interface PlanInput {
  /** Sorted. */
  projectIds: string[]
  ledger: CropAttestationLedger
  /** By uid. */
  onchain: Map<Hex, OnchainAttestation>
  now: number
}

/** A live ledger entry together with what the chain currently says about it. */
interface LiveAttestation {
  entry: CropAttestation
  onchain: OnchainAttestation
}

/**
 * What to send. Every run publishes the current set as a new revision, so a
 * run always produces calldata. Only attestations that say something else are
 * revoked: one that already names exactly this set is left where it is.
 */
export function planPublication(input: PlanInput): AttestAction {
  const live = liveNow(input)
  const revoke = live
    .filter((x) => !saysTheSame(x.onchain, input.projectIds))
    .map(toRevocation)
  return attestAction(
    live,
    revoke,
    input,
    'the live set already matches config',
  )
}

/** Whether the chain already agrees with config, and what it would take to get there. */
export function planAttestation(input: PlanInput): AttestPlan {
  const live = liveNow(input)
  const keeper = live.find(
    (x) =>
      saysTheSame(x.onchain, input.projectIds) &&
      isSameAddress(x.onchain.attester, input.ledger.attester),
  )
  const revoke = live.filter((x) => x !== keeper).map(toRevocation)

  if (keeper) {
    return revoke.length === 0
      ? { kind: 'unchanged', keeper: keeper.entry }
      : { kind: 'prune', keeper: keeper.entry, revoke }
  }
  return attestAction(
    live,
    revoke,
    input,
    'attested under a superseded schema or by another attester',
  )
}

/** The ledger is a cache; the chain decides what is live and what it says. */
function liveNow(input: PlanInput): LiveAttestation[] {
  return input.ledger.live.flatMap((entry) => {
    const onchain = input.onchain.get(entry.uid)
    return onchain && onchain.revocationTime === 0 ? [{ entry, onchain }] : []
  })
}

/** Same data: the current schema, naming exactly the projects config names. */
function saysTheSame(
  onchain: OnchainAttestation,
  projectIds: string[],
): boolean {
  return (
    isCurrentSchema(onchain.schema) &&
    setMatches(decodePayload(onchain.data).projectIds, projectIds)
  )
}

function toRevocation({ entry, onchain }: LiveAttestation): Revocation {
  return { entry, schema: onchain.schema }
}

/**
 * `sameSet` is the reason to report when config and the chain name the same
 * projects, which means something other than the set is behind the run.
 */
function attestAction(
  live: LiveAttestation[],
  revoke: Revocation[],
  input: PlanInput,
  sameSet: string,
): AttestAction {
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
    replaces: newestUid(live),
    payload: {
      projectIds: [...input.projectIds].sort(),
      reviewedAt: input.now,
      revision: nextRevision(input.ledger.live),
    },
    added,
    removed,
    reason:
      live.length === 0
        ? 'nothing is live onchain'
        : changes.length > 0
          ? changes.join(' ')
          : sameSet,
  }
}

/**
 * The attestation the new one supersedes, revoked or not, so the history stays
 * walkable onchain even on a run that revokes nothing.
 */
function newestUid(live: LiveAttestation[]): Hex {
  const latest = live.reduce<LiveAttestation | undefined>(
    (best, x) =>
      best === undefined || x.entry.revision > best.entry.revision ? x : best,
    undefined,
  )
  return latest?.entry.uid ?? zeroHash
}

/** One line per plan, for the header of crops-attest and the verdict of crops-verify. */
export function describePlan(plan: AttestPlan): string {
  switch (plan.kind) {
    case 'unchanged':
      return `revision ${plan.keeper.revision} matches config`
    case 'prune':
      return `revision ${plan.keeper.revision} matches config, but ${plan.revoke.length} older attestation(s) are still live`
    case 'attest':
      return `revision ${plan.payload.revision} (${plan.reason})`
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
