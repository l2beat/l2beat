import { CROP_ATTESTATIONS } from '@l2beat/config'
import chalk from 'chalk'
import { command } from 'cmd-ts'
import {
  createReader,
  getAttestations,
  getAttestationUrl,
} from '../implementations/crops/eas'
import { ATTESTATION_NETWORKS } from '../implementations/crops/easConfig'
import {
  describePlan,
  findLedgerDrift,
  planAttestation,
} from '../implementations/crops/plan'
import { getReviewedProjectIds } from '../implementations/crops/reviewedProjects'
import { attestationNetwork, optionalRpcUrl } from './args'

/**
 * Read-only. Passes exactly when crops-attest would have nothing to do and
 * the committed ledger says what the chain says, so it can gate CI.
 */
export const CropsVerify = command({
  name: 'crops-verify',
  description:
    'Checks the committed crop attestation against EAS and against the set of projects with crop evaluations in config.',
  args: {
    network: attestationNetwork,
    rpcUrl: optionalRpcUrl,
  },
  handler: async (args) => {
    const network = ATTESTATION_NETWORKS[args.network]
    const ledger = CROP_ATTESTATIONS
    if (ledger.network !== network.name && ledger.live.length > 0) {
      console.log(
        chalk.red(
          `The committed ledger is for ${ledger.network}, not ${network.name}. Pass --network ${ledger.network}, or change the default in easConfig.ts and re-attest.`,
        ),
      )
      process.exitCode = 1
      return
    }
    if (ledger.live.length === 0) {
      console.log(chalk.dim(`Nothing attested on ${network.name} yet.`))
      return
    }

    const reader = createReader(network, args.rpcUrl)
    const projectIds = await getReviewedProjectIds()
    const onchain = await getAttestations(
      reader,
      network,
      ledger.live.map((x) => x.uid),
    )
    const plan = planAttestation({
      projectIds,
      ledger,
      onchain,
      now: Math.floor(Date.now() / 1000),
    })

    const problems = findLedgerDrift(ledger, onchain)
    if (plan.kind !== 'unchanged') {
      problems.push(`crops-attest would ${plan.kind}: ${describePlan(plan)}`)
    }
    if (plan.kind !== 'unchanged' || problems.length > 0) {
      console.log(chalk.red(`${problems.length} problem(s):`))
      for (const problem of problems) {
        console.log(chalk.red(`  ${problem}`))
      }
      process.exitCode = 1
      return
    }

    console.log(
      chalk.green('ok'),
      `rev=${plan.keeper.revision}`,
      `${plan.keeper.projectIds.length} projects`,
      chalk.dim(getAttestationUrl(network, plan.keeper.uid)),
    )
    for (const id of plan.keeper.projectIds) {
      console.log(chalk.dim(`   ${id}`))
    }
    console.log(chalk.green('\nThe committed attestation verifies.'))
  },
})
