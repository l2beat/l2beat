import type {
  CropAttestation,
  CropAttestationLedger,
  RevokedCropAttestation,
} from '@l2beat/config'
import chalk from 'chalk'
import type { Address, PublicClient, WalletClient } from 'viem'
import {
  type EasTarget,
  getAttestationUrl,
  multiAttest,
  multiRevoke,
  type NewAttestation,
  readAttestedUids,
} from './easClient'
import type { AttestPlan } from './plan'

export interface ExecuteInput {
  reader: PublicClient
  signer: WalletClient
  attester: Address
  target: EasTarget
  plan: AttestPlan
  /** Encoded from `plan.payload`; empty when the keeper already says it. */
  attestations: NewAttestation[]
  ledger: CropAttestationLedger | undefined
}

/** Sends the plan and returns the ledger as it stands afterwards. */
export async function executePlan(
  input: ExecuteInput,
): Promise<CropAttestationLedger> {
  const { plan, ledger } = input
  const revoked: RevokedCropAttestation[] = [...(ledger?.revoked ?? [])]
  const live: CropAttestation[] = plan.keeper ? [plan.keeper] : []

  // Revoke first: a brief gap with no live attestation beats two of them.
  if (plan.revoke.length > 0) {
    revoked.push(...(await revoke(input)))
  }
  if (plan.payload) {
    live.push(await attest(input, plan.payload))
  }

  const firstBlock = Math.min(
    ...live.map((x) => x.block),
    ledger?.firstBlock ?? Number.POSITIVE_INFINITY,
  )
  return {
    network: input.target.network.name,
    attester: input.attester,
    firstBlock: Number.isFinite(firstBlock) ? firstBlock : 0,
    live,
    revoked,
  }
}

async function revoke(input: ExecuteInput): Promise<RevokedCropAttestation[]> {
  const { reader, signer, target, plan, ledger } = input
  const txHash = await multiRevoke(signer, target, plan.revoke)
  const receipt = await reader.waitForTransactionReceipt({ hash: txHash })
  console.log(
    chalk.green('revoked'),
    txHash,
    chalk.dim(`${plan.revoke.length} uid(s)`),
  )
  return plan.revoke.map((revocation) => {
    const entry = ledger?.live.find((x) => x.uid === revocation.uid)
    return {
      uid: revocation.uid,
      schema: revocation.schema,
      revision: entry?.revision ?? 0,
      projectIds: entry?.projectIds ?? [],
      revokedTxHash: txHash,
      revokedBlock: Number(receipt.blockNumber),
    }
  })
}

async function attest(
  input: ExecuteInput,
  payload: NonNullable<AttestPlan['payload']>,
): Promise<CropAttestation> {
  const { reader, signer, target, attestations } = input
  const txHash = await multiAttest(signer, target, attestations)
  const receipt = await reader.waitForTransactionReceipt({ hash: txHash })
  const uids = readAttestedUids([...receipt.logs])
  const uid = uids[0]
  if (uids.length !== 1 || !uid) {
    throw new Error(
      `Expected 1 Attested event, got ${uids.length}. Ledger not written - rerun with --scan to reconcile.`,
    )
  }
  console.log(chalk.green('attested'), txHash)
  console.log(`  ${getAttestationUrl(target.network, uid)}`)
  return {
    uid,
    schema: target.schema.uid,
    revision: payload.revision,
    reviewedAt: payload.reviewedAt,
    projectIds: payload.projectIds,
    txHash,
    block: Number(receipt.blockNumber),
  }
}
