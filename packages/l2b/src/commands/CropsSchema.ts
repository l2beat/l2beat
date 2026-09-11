import {
  ATTESTATION_NETWORKS,
  ATTESTATION_SCHEMA,
  ATTESTATION_SCHEMA_RESOLVER,
  ATTESTATION_SCHEMA_REVOCABLE,
  ATTESTATION_SCHEMA_UID,
  getSchemaUrl,
} from '@l2beat/config'
import chalk from 'chalk'
import { boolean, command, flag } from 'cmd-ts'
import { keyInYN } from 'readline-sync'
import { assertAnonymous } from '../implementations/crops/anonymity'
import {
  createReader,
  createSigner,
  isSchemaRegistered,
  registerSchema,
} from '../implementations/crops/easClient'
import { attestationNetwork, optionalRpcUrl } from './args'
import { readAttesterKey } from './cropsKey'

export const CropsSchema = command({
  name: 'crops-schema',
  description:
    'Prints the crop attestation schema and its uid, and registers it in the EAS SchemaRegistry.',
  args: {
    network: attestationNetwork,
    rpcUrl: optionalRpcUrl,
    execute: flag({
      type: boolean,
      long: 'execute',
      description: 'send the transaction. Needs L2B_CROPS_PRIVATE_KEY.',
    }),
  },
  handler: async (args) => {
    const network = ATTESTATION_NETWORKS[args.network]
    // Before any RPC work, so a missing key fails first.
    const signer = args.execute
      ? createSigner(network, readAttesterKey(), args.rpcUrl)
      : undefined

    assertAnonymous(network, 'The attestation schema', ATTESTATION_SCHEMA)
    console.log(chalk.bold('schema  '), ATTESTATION_SCHEMA)
    console.log(chalk.bold('resolver'), ATTESTATION_SCHEMA_RESOLVER)
    console.log(chalk.bold('revocable'), ATTESTATION_SCHEMA_REVOCABLE)
    console.log(chalk.bold('uid     '), ATTESTATION_SCHEMA_UID)
    console.log(chalk.bold('network '), `${network.name} (${network.chainId})`)
    console.log(chalk.bold('explorer'), getSchemaUrl(network))

    const reader = createReader(network, args.rpcUrl)
    if (await isSchemaRegistered(reader, network)) {
      console.log(chalk.green('\nAlready registered on this network.'))
      return
    }
    console.log(chalk.yellow('\nNot registered on this network yet.'))

    if (!signer) {
      console.log('Pass --execute to register it.')
      return
    }

    console.log(`\nattester ${signer.account.address} on ${network.name}`)
    if (network.isTestnet) {
      console.log(
        chalk.dim(
          'Reminder: while on a testnet the attester must be a throwaway EOA, and do not name the schema on easscan.',
        ),
      )
    }
    if (!keyInYN(`Register the schema on ${network.name}?`)) {
      return
    }

    const txHash = await registerSchema(signer, network)
    console.log(chalk.green('registered'), txHash)
  },
})
