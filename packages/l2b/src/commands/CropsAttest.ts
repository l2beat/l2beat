import type { AttestationNetworkConfig } from '@l2beat/config'
import { ATTESTATION_SCHEMA, CROP_ATTESTATIONS } from '@l2beat/config'
import chalk from 'chalk'
import { command } from 'cmd-ts'
import { keyInYN } from 'readline-sync'
import { assertAnonymous } from '../implementations/crops/anonymity'
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
  isSchemaRegistered,
  type NewAttestation,
  ZERO_UID,
} from '../implementations/crops/easClient'
import { executePlan } from '../implementations/crops/execute'
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
    assertSchemaUid()

    const network = args.network
    const rpcUrl = args.rpcUrl ?? defaultRpcUrl(network)
    const reader = createReader(rpcUrl)
    // Before any RPC work, so a missing key fails first.
    const signer = args.execute ? createSigner(rpcUrl) : undefined
    const ledger = CROP_ATTESTATIONS[network.name]
    const attester = signer?.account?.address ?? ledger?.attester

    const projectIds = await getAttestedProjectIds()
    const onchain = await loadOnchainState(
      reader,
      network,
      ledger?.live ?? [],
      { scan: args.scan, attester, fromBlock: ledger?.firstBlock },
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

    const attestations = toAttestations(plan, network)
    if (!signer?.account) {
      console.log(
        chalk.dim(
          `\nDry run. Pass --execute to revoke ${plan.revoke.length} and attest ${attestations.length}.`,
        ),
      )
      return
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

    const next = await executePlan({
      reader,
      signer,
      attester: signer.account.address,
      network,
      plan,
      attestations,
      ledger,
    })
    writeLedger({ ...CROP_ATTESTATIONS, [network.name]: next })
    console.log(
      chalk.green('\nwrote'),
      getLedgerPath(),
      chalk.dim('- rebuild config and commit it.'),
    )
  },
})

/** The payload as EAS takes it, once the anonymity guard has passed. */
function toAttestations(
  plan: AttestPlan,
  network: AttestationNetworkConfig,
): NewAttestation[] {
  if (!plan.payload) {
    return []
  }
  assertAnonymous(network, 'The attestation schema', ATTESTATION_SCHEMA)
  assertAnonymous(
    network,
    'The attested set',
    plan.payload.projectIds.join(' '),
  )
  return [
    {
      // Chains it to the one it replaces, so the history is walkable onchain.
      refUID: plan.revoke[0]?.uid ?? ZERO_UID,
      data: encodePayload(plan.payload),
    },
  ]
}

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
