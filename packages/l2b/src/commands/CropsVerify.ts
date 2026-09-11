import {
  ATTESTATION_NETWORKS,
  CROP_ATTESTATIONS,
  getAttestationUrl,
  isCurrentSchema,
} from '@l2beat/config'
import chalk from 'chalk'
import { command } from 'cmd-ts'
import {
  createReader,
  getAttestation,
} from '../implementations/crops/easClient'
import {
  decodePayload,
  diffSet,
  getAttestedProjectIds,
  setMatches,
} from '../implementations/crops/payload'
import { attestationNetwork, optionalRpcUrl } from './args'

/** Read-only. Exits non-zero when ledger, config and chain disagree, so it can gate CI. */
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
    const ledger = CROP_ATTESTATIONS[network.name]
    if (!ledger || ledger.live.length === 0) {
      console.log(chalk.dim(`Nothing attested on ${network.name} yet.`))
      return
    }

    const reader = createReader(network, args.rpcUrl)
    const projectIds = await getAttestedProjectIds()
    const problems: string[] = []

    for (const record of ledger.live) {
      const label = `rev ${record.revision} (${record.uid})`
      const onchain = await getAttestation(reader, network, record.uid)
      if (!onchain) {
        problems.push(`${label}: does not exist`)
        continue
      }
      if (onchain.revocationTime !== 0) {
        problems.push(`${label}: is revoked`)
        continue
      }
      if (onchain.attester.toLowerCase() !== ledger.attester.toLowerCase()) {
        problems.push(
          `${label}: attested by ${onchain.attester}, expected ${ledger.attester}`,
        )
        continue
      }
      if (!isCurrentSchema(onchain.schema)) {
        problems.push(
          `${label}: attested under superseded schema ${onchain.schema} - revoke it with \`l2b crops-attest --execute\``,
        )
        continue
      }

      const current = decodePayload(onchain.data)
      if (!setMatches(current.projectIds, record.projectIds)) {
        problems.push(
          `${label}: ledger says ${record.projectIds.length} projects, chain says ${current.projectIds.length}`,
        )
        continue
      }
      if (!setMatches(current.projectIds, projectIds)) {
        const { added, removed } = diffSet(projectIds, current.projectIds)
        problems.push(
          `${label}: the attested set differs from config - ${[
            ...added.map((id) => `+${id}`),
            ...removed.map((id) => `-${id}`),
          ].join(' ')}`,
        )
        continue
      }

      console.log(
        chalk.green('ok      '),
        `rev=${record.revision}`,
        `${current.projectIds.length} projects`,
        chalk.dim(getAttestationUrl(network, record.uid)),
      )
      for (const id of current.projectIds) {
        console.log(chalk.dim(`           ${id}`))
      }
    }

    if (ledger.live.length > 1) {
      problems.push(
        `${ledger.live.length} attestations are live at once - run \`l2b crops-attest --execute\` to revoke the extras`,
      )
    }

    if (problems.length > 0) {
      console.log(chalk.red(`\n${problems.length} problem(s):`))
      for (const problem of problems) {
        console.log(chalk.red(`  ${problem}`))
      }
      process.exitCode = 1
      return
    }
    console.log(chalk.green('\nThe committed attestation verifies.'))
  },
})
