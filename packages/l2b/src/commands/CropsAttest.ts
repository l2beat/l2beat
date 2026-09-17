import type {
  CropAttestation,
  CropAttestationLedger,
  RevokedCropAttestation,
} from '@l2beat/config'
import { CROP_ATTESTATIONS } from '@l2beat/config'
import chalk from 'chalk'
import { command } from 'cmd-ts'
import { keyInYN } from 'readline-sync'
import { zeroHash } from 'viem'
import { assertAnonymous } from '../implementations/crops/anonymity'
import {
  createReader,
  createSigner,
  encodePayload,
  getAttestations,
  getAttestationUrl,
  getSchemaUrl,
  isSchemaRegistered,
  multiAttest,
  multiRevoke,
  readAttestedUids,
  registerSchema,
  type Signer,
} from '../implementations/crops/eas'
import {
  ATTESTATION_NETWORKS,
  ATTESTATION_SCHEMA_UID,
  type AttestationNetworkConfig,
} from '../implementations/crops/easConfig'
import {
  assertLedgerCommitted,
  getLedgerPath,
  ledgerFor,
  withAttested,
  withRevoked,
  writeLedger,
} from '../implementations/crops/ledger'
import {
  type AttestPlan,
  describePlan,
  planAttestation,
  type Revocation,
} from '../implementations/crops/plan'
import { getReviewedProjectIds } from '../implementations/crops/reviewedProjects'
import { attestationNetwork, optionalRpcUrl } from './args'
import { readAttesterKey } from './cropsKey'

export const CropsAttest = command({
  name: 'crops-attest',
  description:
    'Diffs the set of projects with crop evaluations in config against the set attested onchain, and publishes the difference. A dry run unless L2B_CROPS_PRIVATE_KEY is set, and even then nothing is sent before you confirm. Registers the schema first when the network does not have it yet.',
  args: {
    network: attestationNetwork,
    rpcUrl: optionalRpcUrl,
  },
  handler: async (args) => {
    const network = ATTESTATION_NETWORKS[args.network]
    assertLedgerCommitted()
    const privateKey = readAttesterKey()
    const reader = createReader(network, args.rpcUrl)
    // Until the key is known the header carries the committed attester; the
    // signer replaces it before anything is written.
    const ledger = ledgerFor(
      network,
      CROP_ATTESTATIONS.attester,
      CROP_ATTESTATIONS,
    )
    if (CROP_ATTESTATIONS.network !== network.name) {
      console.log(
        chalk.yellow(
          `The committed ledger is for ${CROP_ATTESTATIONS.network}; starting one for ${network.name}.`,
        ),
      )
    }

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
    const schemaRegistered = await isSchemaRegistered(reader, network)

    printPlan(plan, network, schemaRegistered)
    if (plan.kind === 'unchanged') {
      console.log(chalk.green('\nNothing to publish.'))
      return
    }
    if (!privateKey) {
      console.log(chalk.dim('\nDry run. Set L2B_CROPS_PRIVATE_KEY to publish.'))
      return
    }

    const signer = createSigner(network, privateKey, args.rpcUrl)
    if (plan.kind === 'attest') {
      assertAnonymous(
        network,
        'The attested set',
        plan.payload.projectIds.join(' '),
      )
    }
    console.log(`\nattester ${signer.account.address} on ${network.name}`)
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

    // The ledger is written after every transaction, so a run that dies
    // halfway leaves a file that matches the chain and a rerun picks up.
    let next = { ...ledger, attester: signer.account.address }
    const save = (updated: CropAttestationLedger) => {
      next = updated
      writeLedger(next)
    }

    if (plan.kind === 'attest' && !schemaRegistered) {
      const txHash = await registerSchema(signer, network)
      await signer.waitForTransactionReceipt({ hash: txHash })
      console.log(chalk.green('registered'), txHash)
    }
    if (plan.revoke.length > 0) {
      save(withRevoked(next, await revoke(signer, network, plan.revoke)))
    }
    if (plan.kind === 'attest') {
      save(withAttested(next, await attest(signer, network, plan)))
    }
    console.log(
      chalk.green('\nwrote'),
      getLedgerPath(),
      chalk.dim('- rebuild config and commit it.'),
    )
  },
})

async function revoke(
  signer: Signer,
  network: AttestationNetworkConfig,
  revocations: Revocation[],
): Promise<RevokedCropAttestation[]> {
  const txHash = await multiRevoke(
    signer,
    network,
    revocations.map((x) => ({ uid: x.entry.uid, schema: x.schema })),
  )
  const receipt = await signer.waitForTransactionReceipt({ hash: txHash })
  console.log(
    chalk.green('revoked'),
    txHash,
    chalk.dim(`${revocations.length} uid(s)`),
  )
  return revocations.map(({ entry, schema }) => ({
    uid: entry.uid,
    schema,
    revision: entry.revision,
    projectIds: entry.projectIds,
    revokedTxHash: txHash,
    revokedBlock: Number(receipt.blockNumber),
  }))
}

async function attest(
  signer: Signer,
  network: AttestationNetworkConfig,
  plan: Extract<AttestPlan, { kind: 'attest' }>,
): Promise<CropAttestation> {
  const txHash = await multiAttest(signer, network, [
    {
      // Chains it to the one it replaces, so the history is walkable onchain.
      refUID: plan.revoke[0]?.entry.uid ?? zeroHash,
      data: encodePayload(plan.payload),
    },
  ])
  const receipt = await signer.waitForTransactionReceipt({ hash: txHash })
  const [uid, ...extra] = readAttestedUids([...receipt.logs])
  if (!uid || extra.length > 0) {
    throw new Error(
      `Expected 1 Attested event in ${txHash}, got ${extra.length + (uid ? 1 : 0)}. The ledger does not list this attestation; add it by hand from the receipt before rerunning.`,
    )
  }
  console.log(chalk.green('attested'), txHash)
  console.log(`  ${getAttestationUrl(network, uid)}`)
  return {
    uid,
    schema: ATTESTATION_SCHEMA_UID,
    revision: plan.payload.revision,
    reviewedAt: plan.payload.reviewedAt,
    projectIds: plan.payload.projectIds,
    txHash,
    block: Number(receipt.blockNumber),
  }
}

function printPlan(
  plan: AttestPlan,
  network: AttestationNetworkConfig,
  schemaRegistered: boolean,
): void {
  console.log(chalk.bold(`\ncrop attestations on ${network.name}\n`))
  console.log(
    `schema ${ATTESTATION_SCHEMA_UID}`,
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
