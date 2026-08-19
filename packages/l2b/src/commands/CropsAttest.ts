import type {
  CropAttestation,
  CropAttestationLedger,
  RevokedCropAttestation,
} from '@l2beat/config/build/crops/attestations'
import { CROP_ATTESTATIONS } from '@l2beat/config/build/crops/attestations'
import {
  ATTESTATION_SCHEMA_UID,
  getAttestationUrl,
} from '@l2beat/config/build/crops/eas'
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
import {
  encodePayload,
  getAttestedProjectIds,
} from '../implementations/crops/payload'
import { type AttestPlan, planAttestation } from '../implementations/crops/plan'
import { defaultRpcUrl } from '../implementations/crops/rpc'
import { assertSchemaUid } from '../implementations/crops/schema'
import { loadOnchainState } from '../implementations/crops/state'

export const CropsAttest = command({
  name: 'crops-attest',
  description:
    'Diffs the set of projects with crop evaluations in config against the set attested onchain, and publishes the difference. Dry run unless --execute is passed; the attester key comes from L2B_CROPS_PRIVATE_KEY, never a flag.',
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

    const projectIds = await getAttestedProjectIds()
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

    const plan = planAttestation({
      projectIds,
      ledger: ledger?.live ?? [],
      onchain,
      now: Math.floor(Date.now() / 1000),
    })

    printPlan(plan, network.name)

    if (plan.kind === 'unchanged') {
      console.log(chalk.green('\nNothing to publish.'))
      return
    }

    const attestations = plan.payload
      ? [
          {
            // Chains this attestation to the one it replaces, so the history is
            // walkable onchain without our ledger.
            refUID: (plan.revoke[0]?.uid as Hex | undefined) ?? ZERO_UID,
            data: encodePayload(plan.payload),
          },
        ]
      : []

    if (!args.execute) {
      console.log(
        chalk.dim(
          `\nDry run. Pass --execute to revoke ${plan.revoke.length} and attest ${attestations.length}.`,
        ),
      )
      return
    }

    if (!signer?.account) {
      throw new Error('No signer account available.')
    }
    if (
      attestations.length > 0 &&
      !(await isSchemaRegistered(reader, network))
    ) {
      throw new Error(
        `The schema is not registered on ${network.name}. Run \`l2b crops-schema --execute\` first.`,
      )
    }

    const gas = await estimateGas(reader, network, signer.account.address, {
      attestations,
      revoke: plan.revoke,
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
    const live: CropAttestation[] = plan.keeper ? [plan.keeper] : []

    // Revoke before attesting: the invariant that matters is never having two
    // live attestations for the set. A brief gap with none is fine.
    if (plan.revoke.length > 0) {
      const txHash = await multiRevoke(signer, network, plan.revoke)
      const receipt = await reader.waitForTransactionReceipt({ hash: txHash })
      console.log(
        chalk.green('revoked'),
        txHash,
        chalk.dim(`${plan.revoke.length} uid(s)`),
      )
      for (const revocation of plan.revoke) {
        const entry = ledger?.live.find((x) => x.uid === revocation.uid)
        revoked.push({
          uid: revocation.uid,
          schema: revocation.schema,
          revision: entry?.revision ?? 0,
          projectIds: entry?.projectIds ?? [],
          revokedTxHash: txHash,
          revokedBlock: Number(receipt.blockNumber),
        })
      }
    }

    if (plan.payload) {
      const txHash = await multiAttest(signer, network, attestations)
      const receipt = await reader.waitForTransactionReceipt({ hash: txHash })
      const uids = readAttestedUids([...receipt.logs])
      const uid = uids[0]
      if (uids.length !== 1 || !uid) {
        throw new Error(
          `Expected 1 Attested event, got ${uids.length}. Ledger not written - rerun with --scan to reconcile.`,
        )
      }
      console.log(chalk.green('attested'), txHash)
      console.log(`  ${getAttestationUrl(network, uid)}`)
      live.push({
        uid,
        schema: ATTESTATION_SCHEMA_UID,
        revision: plan.payload.revision,
        reviewedAt: plan.payload.reviewedAt,
        projectIds: plan.payload.projectIds,
        txHash,
        block: Number(receipt.blockNumber),
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
      chalk.dim('- run `pnpm format:fix`, rebuild config and commit it.'),
    )
  },
})

function printPlan(plan: AttestPlan, network: string): void {
  const color = {
    new: chalk.green,
    changed: chalk.yellow,
    unchanged: chalk.dim,
  }
  console.log(chalk.bold(`\ncrop attestations on ${network}\n`))
  console.log(
    `${color[plan.kind](plan.kind.padEnd(9))} ${plan.projectIds.length} project(s)  ${chalk.dim(plan.reason)}`,
  )
  for (const id of plan.projectIds) {
    const mark = plan.added.includes(id) ? chalk.green('+') : ' '
    console.log(`  ${mark} ${id}`)
  }
  for (const id of plan.removed) {
    console.log(`  ${chalk.red('-')} ${chalk.strikethrough(id)}`)
  }
  if (plan.revoke.length > 0) {
    console.log(chalk.dim('\nto revoke:'))
    for (const revocation of plan.revoke) {
      console.log(chalk.dim(`  ${revocation.uid}`))
    }
  }
}
