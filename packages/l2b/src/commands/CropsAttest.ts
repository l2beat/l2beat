import type {
  CropAttestation,
  CropAttestationLedger,
  RevokedCropAttestation,
} from '@l2beat/config/build/crops/attestations'
import { CROP_ATTESTATIONS } from '@l2beat/config/build/crops/attestations'
import { getAttestationUrl } from '@l2beat/config/build/crops/eas'
import chalk from 'chalk'
import { command } from 'cmd-ts'
import { keyInYN } from 'readline-sync'
import type { Address, Hex } from 'viem'
import {
  executeFlag,
  networkOption,
  rpcUrlOption,
  scanFlag,
} from '../implementations/crops/args'
import type { CropDiffEntry } from '../implementations/crops/diff'
import { diffAttestations } from '../implementations/crops/diff'
import {
  createReader,
  createSigner,
  estimateGas,
  hasAttesterKey,
  isSchemaRegistered,
  multiAttest,
  multiRevoke,
  readAttestedUids,
  ZERO_UID,
} from '../implementations/crops/easClient'
import { getLedgerPath, writeLedger } from '../implementations/crops/ledger'
import type { CropPayload } from '../implementations/crops/payload'
import {
  describePayload,
  encodePayload,
  getCropSubjects,
} from '../implementations/crops/payload'
import { defaultRpcUrl } from '../implementations/crops/rpc'
import { assertSchemaUid } from '../implementations/crops/schema'
import { loadOnchainState } from '../implementations/crops/state'

export const CropsAttest = command({
  name: 'crops-attest',
  description:
    'Diffs the crop evaluations in config against the attestations onchain, and publishes the difference. Dry run unless --execute is passed; the attester key comes from L2B_CROPS_PRIVATE_KEY, never a flag.',
  args: {
    network: networkOption,
    rpcUrl: rpcUrlOption,
    scan: scanFlag,
    execute: executeFlag,
  },
  handler: async (args) => {
    if (args.execute && !hasAttesterKey()) {
      console.log(
        chalk.red(
          'L2B_CROPS_PRIVATE_KEY is not set. Export the attester key in the shell you run this from - it is deliberately not a command line flag, so it never lands in shell history.',
        ),
      )
      process.exitCode = 1
      return
    }

    assertSchemaUid()

    const network = args.network
    const rpcUrl = args.rpcUrl ?? defaultRpcUrl(network)
    const reader = createReader(rpcUrl)
    const ledger = CROP_ATTESTATIONS[network.name]
    const signer = args.execute ? createSigner(rpcUrl) : undefined
    // A scan needs an attester to filter logs by; the committed ledger records
    // one, and otherwise the signer we are about to publish with supplies it.
    const attester = signer?.account?.address ?? ledger?.attester

    const subjects = await getCropSubjects()
    const onchain = await loadOnchainState(
      reader,
      network,
      ledger?.live ?? [],
      {
        scan: args.scan,
        attester: attester as Address | undefined,
        fromBlock: ledger?.firstBlock,
      },
    )

    const diff = diffAttestations({
      subjects,
      ledger: ledger?.live ?? [],
      onchain,
      now: Math.floor(Date.now() / 1000),
    })

    printDiff(diff, network.name)

    const toAttest = diff.filter(
      (x): x is CropDiffEntry & { payload: CropPayload } =>
        x.payload !== undefined,
    )
    const toRevoke = diff
      .map((x) => x.revoke)
      .filter((x): x is Hex => x !== undefined)

    if (toAttest.length === 0 && toRevoke.length === 0) {
      console.log(chalk.green('\nNothing to publish.'))
      return
    }

    const attestations = toAttest.map((entry) => ({
      // Chains this attestation to the one it replaces, so the history is
      // walkable onchain without our ledger.
      refUID: (entry.ledger?.uid as Hex | undefined) ?? ZERO_UID,
      data: encodePayload(entry.payload),
    }))

    if (!args.execute) {
      console.log(
        chalk.dim(
          `\nDry run. Pass --execute to revoke ${toRevoke.length} and attest ${attestations.length}.`,
        ),
      )
      return
    }

    if (!signer?.account) {
      throw new Error('No signer account available.')
    }
    if (!(await isSchemaRegistered(reader, network))) {
      throw new Error(
        `The schema is not registered on ${network.name}. Run \`l2b crops-schema --execute\` first.`,
      )
    }

    const gas = await estimateGas(reader, network, signer.account.address, {
      attestations,
      revoke: toRevoke,
    })
    console.log(
      `\nattester ${signer.account.address} on ${network.name}, estimated gas ${gas}`,
    )
    if (network.isTestnet) {
      console.log(
        chalk.dim(
          'This is a testnet attester and must stay unlinkable to L2BEAT: a throwaway EOA funded from a faucet.',
        ),
      )
    }
    if (!keyInYN(`Publish on ${network.name}?`)) {
      return
    }

    const revoked: RevokedCropAttestation[] = [...(ledger?.revoked ?? [])]

    // Revoke before attesting: the invariant that matters is never having two
    // live attestations for the same project. A brief gap with none is fine.
    if (toRevoke.length > 0) {
      const txHash = await multiRevoke(signer, network, toRevoke)
      const receipt = await reader.waitForTransactionReceipt({ hash: txHash })
      console.log(chalk.green('revoked'), txHash)
      for (const entry of diff) {
        if (entry.revoke && entry.ledger) {
          revoked.push({
            projectId: entry.projectId,
            uid: entry.ledger.uid,
            revision: entry.ledger.revision,
            revokedTxHash: txHash,
            revokedBlock: Number(receipt.blockNumber),
          })
        }
      }
    }

    const live: CropAttestation[] = (ledger?.live ?? []).filter(
      (existing) =>
        !diff.some(
          (entry) =>
            entry.projectId === existing.projectId &&
            entry.kind !== 'unchanged',
        ),
    )

    if (attestations.length > 0) {
      const txHash = await multiAttest(signer, network, attestations)
      const receipt = await reader.waitForTransactionReceipt({ hash: txHash })
      const uids = readAttestedUids([...receipt.logs])
      if (uids.length !== attestations.length) {
        throw new Error(
          `Expected ${attestations.length} Attested events, got ${uids.length}. Ledger not written - rerun with --scan to reconcile.`,
        )
      }
      console.log(chalk.green('attested'), txHash)
      toAttest.forEach((entry, i) => {
        const uid = uids[i]
        const payload = entry.payload
        if (!uid) {
          throw new Error(`Missing uid for ${entry.projectId}`)
        }
        live.push({
          projectId: entry.projectId,
          uid,
          revision: payload.revision,
          reviewedAt: payload.reviewedAt,
          evaluationHash: payload.evaluationHash,
          txHash,
          block: Number(receipt.blockNumber),
        })
        console.log(`  ${entry.projectId} ${getAttestationUrl(network, uid)}`)
      })
    }

    const firstBlock = Math.min(
      ...live.map((x) => x.block),
      ledger?.firstBlock ?? Number.POSITIVE_INFINITY,
    )
    const next: CropAttestationLedger = {
      network: network.name,
      attester: signer.account.address,
      firstBlock: Number.isFinite(firstBlock) ? firstBlock : 0,
      live,
      revoked,
    }
    writeLedger({ ...CROP_ATTESTATIONS, [network.name]: next })
    console.log(
      chalk.green('\nwrote'),
      getLedgerPath(),
      chalk.dim('- run `pnpm format:fix` and commit it.'),
    )
  },
})

function printDiff(diff: CropDiffEntry[], network: string): void {
  const color = {
    new: chalk.green,
    changed: chalk.yellow,
    unchanged: chalk.dim,
    orphaned: chalk.red,
  }
  console.log(chalk.bold(`\ncrop attestations on ${network}\n`))
  for (const entry of diff) {
    const label = color[entry.kind](entry.kind.padEnd(9))
    const detail = entry.payload
      ? `${describePayload(entry.payload)} rev=${entry.payload.revision}`
      : entry.reason
    console.log(`${label} ${entry.projectId.padEnd(16)} ${detail}`)
  }
}
