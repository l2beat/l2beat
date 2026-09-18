import { CROP_ATTESTATIONS } from '@l2beat/config'
import chalk from 'chalk'
import { command } from 'cmd-ts'
import type { Address, Hex, PublicClient } from 'viem'
import {
  createReader,
  getAttestation,
  getAttestationUrl,
  type OnchainAttestation,
  readAttestedUids,
  readRevoked,
} from '../implementations/crops/eas'
import {
  ATTESTATION_NETWORKS,
  ATTESTATION_RPC_URL,
  type AttestationNetworkConfig,
} from '../implementations/crops/easConfig'
import {
  findUncommittedLedger,
  getLedgerPath,
  ledgerFor,
  writeLedger,
} from '../implementations/crops/ledger'
import { recordTransaction } from '../implementations/crops/record'
import { resolveSafe } from '../implementations/crops/safeTx'
import {
  attestationNetwork,
  attestationSafe,
  attestationTxHash,
  optionalRpcUrl,
} from './args'

export const CropsRecord = command({
  name: 'crops-record',
  description:
    'Takes the hash of a transaction the Safe has already executed, finds the attestation uids it created or revoked, fetches each attestation from EAS, prints what it says and writes it into the ledger. Safe to rerun on the same hash.',
  args: {
    network: attestationNetwork,
    tx: attestationTxHash,
    safe: attestationSafe,
    rpcUrl: optionalRpcUrl,
  },
  handler: async (args) => {
    const network = ATTESTATION_NETWORKS[args.network]
    const uncommitted = findUncommittedLedger()
    if (uncommitted) {
      console.log(chalk.yellow(uncommitted))
    }
    const reader = createReader(network, args.rpcUrl ?? ATTESTATION_RPC_URL)

    const receipt = await reader.getTransactionReceipt({ hash: args.tx })
    if (receipt.status !== 'success') {
      throw new Error(`${args.tx} reverted; there is nothing to record.`)
    }
    const logs = [...receipt.logs]
    const attestedUids = readAttestedUids(network, logs)
    const revokedUids = readRevoked(network, logs).map((x) => x.uid)
    if (attestedUids.length === 0 && revokedUids.length === 0) {
      throw new Error(
        `${args.tx} emitted no EAS Attested or Revoked event from ${network.eas}. Check the hash and the network.`,
      )
    }

    const attested = await readBack(reader, network, attestedUids)
    const revoked = await readBack(reader, network, revokedUids)
    assertAttester(attested, resolveSafeOrUndefined(network, args.safe))

    // The header is rewritten from this build's constants, as crops-attest
    // does, so the file always describes the network it records.
    const committed = ledgerFor(
      network,
      CROP_ATTESTATIONS.attester,
      CROP_ATTESTATIONS,
    )
    const result = recordTransaction({
      ledger: committed,
      txHash: args.tx,
      block: Number(receipt.blockNumber),
      attested,
      revoked,
    })
    writeLedger(result.ledger)

    console.log(chalk.bold(`\n${args.tx} on ${network.name}`))
    console.log(
      `block ${receipt.blockNumber}, attester ${result.ledger.attester}`,
    )

    for (const entry of result.revoked) {
      console.log(chalk.yellow(`\nrevoked  ${entry.uid}`))
      console.log(chalk.dim(`  revision ${entry.revision}`))
    }
    // What EAS actually holds under the new uid, read back rather than echoed
    // from the plan: this is the point of recording from a hash.
    for (const entry of result.attested) {
      console.log(chalk.green(`\nattested ${entry.uid}`))
      console.log(`  revision   ${entry.revision}`)
      console.log(
        `  reviewedAt ${entry.reviewedAt} (${new Date(entry.reviewedAt * 1000).toISOString()})`,
      )
      console.log(`  projects   ${entry.projectIds.length}`)
      for (const id of entry.projectIds) {
        console.log(chalk.dim(`    ${id}`))
      }
      console.log(`  ${getAttestationUrl(network, entry.uid)}`)
    }
    for (const uid of result.skipped) {
      console.log(chalk.dim(`\nalready recorded ${uid}`))
    }
    // JSON.stringify is not biome's formatting, so the file it writes is
    // reformatted on the way in rather than looking like a spurious change.
    console.log(chalk.green('\nwrote'), getLedgerPath())
    console.log(chalk.dim('\nThen, from the repo root:'))
    console.log(chalk.dim('  pnpm --filter @l2beat/config format:fix'))
    console.log(chalk.dim('  pnpm build:dependencies:l2b'))
    console.log(chalk.dim(`  l2b crops-verify --network ${network.name}`))
    console.log(chalk.dim('  git commit the ledger'))
  },
})

/**
 * The events carry only uids; everything the ledger stores lives on the
 * attestation itself, so each uid is read back.
 */
async function readBack(
  reader: PublicClient,
  network: AttestationNetworkConfig,
  uids: Hex[],
): Promise<OnchainAttestation[]> {
  const found: OnchainAttestation[] = []
  for (const uid of uids) {
    const attestation = await getAttestation(reader, network, uid)
    if (!attestation) {
      throw new Error(`EAS does not know ${uid}, which the receipt names.`)
    }
    found.push(attestation)
  }
  return found
}

/** Catches recording somebody else's transaction, when a Safe is known. */
function assertAttester(
  attested: OnchainAttestation[],
  safe: Address | undefined,
): void {
  if (!safe) {
    return
  }
  const wrong = attested.filter(
    (x) => x.attester.toLowerCase() !== safe.toLowerCase(),
  )
  if (wrong.length > 0) {
    throw new Error(
      `${wrong[0]?.uid} was attested by ${wrong[0]?.attester}, not by ${safe}. Pass the right --safe, or drop it to record whatever the chain says.`,
    )
  }
}

function resolveSafeOrUndefined(
  network: AttestationNetworkConfig,
  flag: Address | undefined,
): Address | undefined {
  try {
    return resolveSafe(network, flag)
  } catch {
    return undefined
  }
}
