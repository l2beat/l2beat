import type {
  CropAttestation,
  CropAttestationLedger,
  RevokedCropAttestation,
} from '@l2beat/config'
import { type Address, getAddress, type Hex } from 'viem'
import { decodePayload, isCurrentSchema, type OnchainAttestation } from './eas'
import { withAttested, withRevoked } from './ledger'

export interface RecordInput {
  /** Header already rewritten for the network being recorded. */
  ledger: CropAttestationLedger
  txHash: Hex
  block: number
  /** Read back from the chain for every uid the transaction's Attested events name. */
  attested: OnchainAttestation[]
  /** Likewise for its Revoked events. */
  revoked: OnchainAttestation[]
}

export interface RecordResult {
  ledger: CropAttestationLedger
  /** Only what this call added, so the command can report it. */
  attested: CropAttestation[]
  revoked: RevokedCropAttestation[]
  /** Uids the ledger already knew, ignored so a rerun changes nothing. */
  skipped: Hex[]
}

/**
 * The ledger this transaction leaves behind. Everything is taken from the
 * chain rather than from a plan, so a transaction the Safe reordered, split
 * or batched with something else still records correctly, and a second run
 * over the same hash is a no-op.
 */
export function recordTransaction(input: RecordInput): RecordResult {
  const skipped: Hex[] = []
  const liveUids = new Set(input.ledger.live.map((x) => x.uid))
  const revokedUids = new Set(input.ledger.revoked.map((x) => x.uid))

  const revoked: RevokedCropAttestation[] = []
  for (const onchain of input.revoked) {
    if (revokedUids.has(onchain.uid)) {
      skipped.push(onchain.uid)
      continue
    }
    const known = input.ledger.live.find((x) => x.uid === onchain.uid)
    revoked.push({
      uid: onchain.uid,
      schema: onchain.schema,
      revision: known?.revision ?? payloadOf(onchain).revision,
      projectIds: known?.projectIds ?? payloadOf(onchain).projectIds,
      revokedTxHash: input.txHash,
      revokedBlock: input.block,
    })
  }

  const attested: CropAttestation[] = []
  for (const onchain of input.attested) {
    if (liveUids.has(onchain.uid)) {
      skipped.push(onchain.uid)
      continue
    }
    if (!isCurrentSchema(onchain.schema)) {
      throw new Error(
        `${onchain.uid} was attested under schema ${onchain.schema}, not the one this build knows. Check out the commit that attested it, or add the entry by hand.`,
      )
    }
    const payload = decodePayload(onchain.data)
    attested.push({
      uid: onchain.uid,
      schema: onchain.schema,
      revision: payload.revision,
      reviewedAt: payload.reviewedAt,
      projectIds: payload.projectIds,
      txHash: input.txHash,
      block: input.block,
    })
  }

  let ledger = withRevoked(input.ledger, revoked)
  for (const entry of attested) {
    ledger = withAttested(ledger, entry)
  }
  return {
    ledger: { ...ledger, attester: attesterOf(input) },
    attested,
    revoked,
    skipped,
  }
}

/**
 * Who EAS recorded, not who we expected. A transaction that attested says so
 * directly; one that only revoked leaves the committed attester alone, since
 * revoking says nothing about who attests next.
 */
function attesterOf(input: RecordInput): Address {
  const attesters = new Set(input.attested.map((x) => x.attester.toLowerCase()))
  if (attesters.size > 1) {
    throw new Error(
      `The transaction attested from ${attesters.size} different addresses: ${[...attesters].join(', ')}. The ledger holds one attester.`,
    )
  }
  const [attester] = input.attested
  // The chain returns lowercase; the committed ledger keeps checksums.
  return attester ? getAddress(attester.attester) : input.ledger.attester
}

/** A revocation of something the ledger never recorded still needs its payload. */
function payloadOf(onchain: OnchainAttestation) {
  if (!isCurrentSchema(onchain.schema)) {
    throw new Error(
      `${onchain.uid} is not in the ledger and was attested under schema ${onchain.schema}, which this build cannot decode. Add the revoked entry by hand.`,
    )
  }
  return decodePayload(onchain.data)
}
