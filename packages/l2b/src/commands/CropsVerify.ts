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
  getCropSubjects,
  payloadMatches,
  toPayload,
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
    'Checks every committed crop attestation against EAS and against the evaluations in config.',
  args: {
    network: networkOption,
    rpcUrl: rpcUrlOption,
  },
  handler: async (args) => {
    assertSchemaUid()

    const network = args.network
    const ledger = CROP_ATTESTATIONS[network.name]
    if (!ledger) {
      console.log(chalk.dim(`Nothing attested on ${network.name} yet.`))
      return
    }

    const reader = createReader(args.rpcUrl ?? defaultRpcUrl(network))
    const subjects = await getCropSubjects()
    const problems: string[] = []

    for (const record of ledger.live) {
      const subject = subjects.find((x) => x.projectId === record.projectId)
      if (!subject) {
        problems.push(
          `${record.projectId}: attested but no longer declares crops - revoke it with \`l2b crops-attest --execute\``,
        )
        continue
      }

      const onchain = await getAttestation(reader, network, record.uid as Hex)
      if (!onchain) {
        problems.push(`${record.projectId}: uid ${record.uid} does not exist`)
        continue
      }
      if (onchain.revocationTime !== 0) {
        problems.push(`${record.projectId}: uid ${record.uid} is revoked`)
        continue
      }
      if (
        onchain.schema.toLowerCase() !== ATTESTATION_SCHEMA_UID.toLowerCase()
      ) {
        problems.push(`${record.projectId}: wrong schema ${onchain.schema}`)
        continue
      }
      if (onchain.attester.toLowerCase() !== ledger.attester.toLowerCase()) {
        problems.push(
          `${record.projectId}: attested by ${onchain.attester}, expected ${ledger.attester}`,
        )
        continue
      }
      if (
        record.evaluationHash.toLowerCase() !==
        subject.evaluationHash.toLowerCase()
      ) {
        problems.push(
          `${record.projectId}: config evaluation changed - ledger hash ${record.evaluationHash}, config hash ${subject.evaluationHash}`,
        )
        continue
      }

      const current = decodePayload(onchain.data)
      const wanted = toPayload(subject, current.reviewedAt, current.revision)
      if (!payloadMatches(current, wanted)) {
        problems.push(`${record.projectId}: onchain ratings differ from config`)
        continue
      }

      console.log(
        chalk.green('ok      '),
        record.projectId.padEnd(16),
        `rev=${record.revision}`,
        chalk.dim(getAttestationUrl(network, record.uid)),
      )
    }

    // Reviewed but never attested is a gap worth reporting, not a failure.
    for (const subject of subjects) {
      if (!ledger.live.some((x) => x.projectId === subject.projectId)) {
        console.log(
          chalk.yellow('missing '),
          subject.projectId.padEnd(16),
          'declares crops but has no attestation',
        )
      }
    }

    if (problems.length > 0) {
      console.log(chalk.red(`\n${problems.length} problem(s):`))
      for (const problem of problems) {
        console.log(chalk.red(`  ${problem}`))
      }
      process.exitCode = 1
      return
    }
    console.log(chalk.green('\nAll committed attestations verify.'))
  },
})
