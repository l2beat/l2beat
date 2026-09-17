import { type Address, getAddress, type Hex, zeroAddress } from 'viem'
import {
  type Revocation as EasRevocation,
  encodeMultiAttest,
  encodeMultiRevoke,
  encodePayload,
  encodeRegisterSchema,
  type OnchainAttestation,
} from './eas'
import {
  ATTESTATION_SCHEMA,
  ATTESTATION_SCHEMA_RESOLVER,
  ATTESTATION_SCHEMA_REVOCABLE,
  ATTESTATION_SCHEMA_UID,
  type AttestationNetworkConfig,
} from './easConfig'
import type { AttestPlan, Revocation } from './plan'
import type { ForeignCall, SafeCall } from './safeTx'

export interface PlannedCalls {
  /** In the order the Safe must execute them. */
  safe: SafeCall[]
  /** Calls the Safe is not allowed to make; see ForeignCall. */
  foreign: ForeignCall[]
}

export interface BuildCallsInput {
  network: AttestationNetworkConfig
  safe: Address
  plan: AttestPlan
  /** By uid, as read from the chain: says who may revoke each live uid. */
  onchain: Map<Hex, OnchainAttestation>
  schemaRegistered: boolean
}

/**
 * The plan as transactions. Nothing here touches a key or a node: the result
 * is calldata to paste into the Safe UI, plus whatever the Safe is not the
 * one to send.
 */
export function buildCalls(input: BuildCallsInput): PlannedCalls {
  const { network, safe, plan } = input
  if (plan.kind === 'unchanged') {
    return { safe: [], foreign: [] }
  }

  const safeCalls: SafeCall[] = []
  if (plan.kind === 'attest' && !input.schemaRegistered) {
    safeCalls.push({
      label: 'register the schema',
      to: network.schemaRegistry,
      data: encodeRegisterSchema(),
      details: [
        `schema: ${ATTESTATION_SCHEMA}`,
        `resolver: ${ATTESTATION_SCHEMA_RESOLVER}`,
        `revocable: ${ATTESTATION_SCHEMA_REVOCABLE}`,
      ],
    })
  }

  const { mine, theirs } = splitRevocations(plan.revoke, input.onchain, safe)
  if (mine.length > 0) {
    safeCalls.push({
      label: `revoke ${mine.length} attestation(s)`,
      to: network.eas,
      data: encodeMultiRevoke(toEasRevocations(mine)),
      details: describeRevocations(mine),
    })
  }

  if (plan.kind === 'attest') {
    safeCalls.push({
      label: `attest revision ${plan.payload.revision} (${plan.payload.projectIds.length} projects)`,
      to: network.eas,
      // Chains it to the one it supersedes, so the history is walkable onchain.
      data: encodeMultiAttest([
        { refUID: plan.replaces, data: encodePayload(plan.payload) },
      ]),
      details: [
        `schema: ${ATTESTATION_SCHEMA_UID}`,
        `recipient: ${zeroAddress} (the subject is a protocol, not an account)`,
        'expirationTime: 0 (never expires)',
        'revocable: true',
        `refUID: ${plan.replaces}`,
        'value: 0',
        `projectIds (${plan.payload.projectIds.length}): ${plan.payload.projectIds.join(', ')}`,
        `reviewedAt: ${plan.payload.reviewedAt} (${new Date(plan.payload.reviewedAt * 1000).toISOString()})`,
        `revision: ${plan.payload.revision}`,
      ],
    })
  }

  const foreign: ForeignCall[] = [...theirs].map(([attester, revocations]) => ({
    label: `revoke ${revocations.length} attestation(s) made by ${attester}`,
    from: attester,
    to: network.eas,
    data: encodeMultiRevoke(toEasRevocations(revocations)),
    details: describeRevocations(revocations),
    reason: `EAS accepts a revocation only from the attester that made it, and these were made by ${attester}, not by the Safe.`,
  }))

  return { safe: safeCalls, foreign }
}

/**
 * Which revocations the Safe may send. A uid the chain does not know about is
 * not revocable by anyone, and the planner only ever proposes uids it just
 * read as live, so it cannot appear here.
 */
function splitRevocations(
  revocations: Revocation[],
  onchain: Map<Hex, OnchainAttestation>,
  safe: Address,
): { mine: Revocation[]; theirs: Map<Address, Revocation[]> } {
  const mine: Revocation[] = []
  const theirs = new Map<Address, Revocation[]>()
  for (const revocation of revocations) {
    const attester = onchain.get(revocation.entry.uid)?.attester
    if (attester === undefined || isSameAddress(attester, safe)) {
      mine.push(revocation)
      continue
    }
    // The chain returns lowercase; this address is displayed and pasted into
    // a wallet, so it is checksummed first.
    const key = getAddress(attester)
    theirs.set(key, [...(theirs.get(key) ?? []), revocation])
  }
  return { mine, theirs }
}

function describeRevocations(revocations: Revocation[]): string[] {
  return revocations.map(
    ({ entry, schema }) =>
      `uid ${entry.uid} (revision ${entry.revision}, schema ${schema})`,
  )
}

function toEasRevocations(revocations: Revocation[]): EasRevocation[] {
  return revocations.map((x) => ({ uid: x.entry.uid, schema: x.schema }))
}

function isSameAddress(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase()
}
