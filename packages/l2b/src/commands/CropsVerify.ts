import { CROP_ATTESTATIONS } from '@l2beat/config/build/crops/attestations'
import {
  ATTESTATION_SCHEMA_UID,
  getAttestationUrl,
} from '@l2beat/config/build/crops/eas'
import chalk from 'chalk'
import { command } from 'cmd-ts'
import type { Hex } from 'viem'
import { networkOption, rpcUrlOption } from '../implementations/crops/args'
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
import { defaultRpcUrl } from '../implementations/crops/rpc'
import { assertSchemaUid } from '../implementations/crops/schema'

/**
 * Read-only. Proves that the committed ledger, the config and the chain still
 * agree, and exits non-zero when they do not so it can gate CI.
 */
export const CropsVerify = command({
  name: 'crops-verify',
  description:
    'Checks the committed crop attestation against EAS and against the set of projects with crop evaluations in config.',
  args: {
    network: networkOption,
    rpcUrl: rpcUrlOption,
  },
  handler: async (args) => {
    assertSchemaUid()

    const network = args.network
    const ledger = CROP_ATTESTATIONS[network.name]
    if (!ledger || ledger.live.length === 0) {
      console.log(chalk.dim(`Nothing attested on ${network.name} yet.`))
      return
    }

    const reader = createReader(args.rpcUrl ?? defaultRpcUrl(network))
    const projectIds = await getAttestedProjectIds()
    const problems: string[] = []

    for (const record of ledger.live) {
      const label = `rev ${record.revision} (${record.uid})`
      const onchain = await getAttestation(reader, network, record.uid as Hex)
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
      if (
        onchain.schema.toLowerCase() !== ATTESTATION_SCHEMA_UID.toLowerCase()
      ) {
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

    // More than one live attestation is not a drift, but a reader cannot tell
    // which one speaks for us, so it has to be reported.
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
