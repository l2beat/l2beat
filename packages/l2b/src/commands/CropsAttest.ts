import { CROP_ATTESTATIONS } from '@l2beat/config'
import chalk from 'chalk'
import { command, option, string } from 'cmd-ts'
import { writeFileSync } from 'fs'
import { resolve } from 'path'
import type { Address } from 'viem'
import { assertAnonymous } from '../implementations/crops/anonymity'
import { buildCalls, type PlannedCalls } from '../implementations/crops/calls'
import {
  createReader,
  getAttestations,
  getSchemaUrl,
  isSchemaRegistered,
} from '../implementations/crops/eas'
import {
  ATTESTATION_NETWORKS,
  ATTESTATION_RPC_URL,
  ATTESTATION_SCHEMA_UID,
  type AttestationNetworkConfig,
} from '../implementations/crops/easConfig'
import { getGardenProjectIds } from '../implementations/crops/gardenProjects'
import {
  findUncommittedLedger,
  ledgerFor,
} from '../implementations/crops/ledger'
import {
  type AttestPlan,
  describePlan,
  planPublication,
} from '../implementations/crops/plan'
import { buildReport } from '../implementations/crops/report'
import { getSafeUrl, resolveSafe } from '../implementations/crops/safeTx'
import {
  attestationNetwork,
  attestationReviewedAt,
  attestationSafe,
  optionalRpcUrl,
} from './args'

export const CropsAttest = command({
  name: 'crops-attest',
  description:
    'Publishes the set of projects with crop evaluations in config as a new attestation revision, and prints the calldata that does it, together with the revocation of every live attestation that names a different set. Read-only: the transactions are executed from the attesting Safe, so this command holds no key and sends nothing. Follow it with `l2b crops-record --tx` once the Safe has executed. See packages/l2b/src/implementations/crops/README.md.',
  args: {
    network: attestationNetwork,
    safe: attestationSafe,
    reviewedAt: attestationReviewedAt,
    rpcUrl: optionalRpcUrl,
    out: option({
      type: string,
      long: 'out',
      description: 'where to write the file describing this run.',
      defaultValue: () => 'crops-attest.md',
      defaultValueIsSerializable: true,
    }),
  },
  handler: async (args) => {
    const network = ATTESTATION_NETWORKS[args.network]
    const safe = resolveSafe(network, args.safe)
    const uncommitted = findUncommittedLedger()
    if (uncommitted) {
      console.log(chalk.yellow(uncommitted))
    }
    const reader = createReader(network, args.rpcUrl ?? ATTESTATION_RPC_URL)
    const ledger = ledgerFor(network, safe, CROP_ATTESTATIONS)
    if (CROP_ATTESTATIONS.network !== network.name) {
      console.log(
        chalk.yellow(
          `The committed ledger is for ${CROP_ATTESTATIONS.network}; starting one for ${network.name}.`,
        ),
      )
    }

    const now = args.reviewedAt ?? Math.floor(Date.now() / 1000)
    const projectIds = await getGardenProjectIds()
    const onchain = await getAttestations(
      reader,
      network,
      ledger.live.map((x) => x.uid),
    )
    const plan = planPublication({
      projectIds,
      ledger,
      onchain,
      now,
    })
    const schemaRegistered = await isSchemaRegistered(reader, network)

    printPlan(plan, network, safe, schemaRegistered)
    assertAnonymous(
      network,
      'The attested set',
      plan.payload.projectIds.join(' '),
    )

    const calls = buildCalls({
      network,
      safe,
      plan,
      onchain,
      schemaRegistered,
    })
    printCalls(calls, network, safe)

    const path = resolve(args.out)
    writeFileSync(
      path,
      buildReport({ network, safe, plan, calls, generatedAt: now }),
    )
    console.log(
      chalk.green('\nwrote'),
      path,
      chalk.dim('- nothing was sent; work from that file.'),
    )
  },
})

function printCalls(
  calls: PlannedCalls,
  network: AttestationNetworkConfig,
  safe: Address,
): void {
  console.log(chalk.bold(`\ncalls for the Safe ${safe}`))
  console.log(chalk.dim(getSafeUrl(network, safe)))
  if (calls.safe.length === 0) {
    console.log(chalk.dim('  none'))
  }
  calls.safe.forEach((call, i) => {
    console.log(`\n${chalk.bold(`${i + 1}. ${call.label}`)}`)
    console.log(`   to     ${call.to}`)
    console.log('   value  0')
    console.log(`   data   ${call.data}`)
  })

  if (calls.foreign.length === 0) {
    return
  }
  console.log(
    chalk.yellow(`\n${calls.foreign.length} call(s) the Safe cannot make:`),
  )
  for (const call of calls.foreign) {
    console.log(`\n${chalk.bold(call.label)}`)
    console.log(chalk.yellow(`   ${call.reason}`))
    console.log(`   from   ${call.from}`)
    console.log(`   to     ${call.to}`)
    console.log('   value  0')
    console.log(`   data   ${call.data}`)
  }
}

function printPlan(
  plan: AttestPlan,
  network: AttestationNetworkConfig,
  safe: Address,
  schemaRegistered: boolean,
): void {
  console.log(chalk.bold(`\ncrop attestations on ${network.name}\n`))
  console.log(`attester ${safe}`)
  if (network.isTestnet) {
    console.log(
      chalk.dim(
        'This is a testnet attester and must stay unlinkable to L2BEAT.',
      ),
    )
  }
  console.log(
    `\nschema ${ATTESTATION_SCHEMA_UID}`,
    schemaRegistered
      ? chalk.dim('registered')
      : chalk.yellow('not registered yet - will be registered first'),
  )
  console.log(chalk.dim(getSchemaUrl(network)))
  const color = {
    unchanged: chalk.dim,
    prune: chalk.yellow,
    attest: chalk.green,
  }
  console.log(
    `\n${color[plan.kind](plan.kind.padEnd(9))} ${describePlan(plan)}`,
  )

  const ids =
    plan.kind === 'attest' ? plan.payload.projectIds : plan.keeper.projectIds
  for (const id of ids) {
    const mark =
      plan.kind === 'attest' && plan.added.includes(id) ? chalk.green('+') : ' '
    console.log(`  ${mark} ${id}`)
  }
  if (plan.kind === 'attest') {
    for (const id of plan.removed) {
      console.log(`  ${chalk.red('-')} ${chalk.strikethrough(id)}`)
    }
  }
  if (plan.kind !== 'unchanged' && plan.revoke.length > 0) {
    console.log(chalk.dim('\nto revoke:'))
    for (const revocation of plan.revoke) {
      console.log(chalk.dim(`  ${revocation.entry.uid}`))
    }
  }
}
