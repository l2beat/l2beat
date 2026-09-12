import {
  ATTESTATION_SCHEMA,
  ATTESTATION_SCHEMA_RESOLVER,
  ATTESTATION_SCHEMA_REVOCABLE,
  ATTESTATION_SCHEMA_UID,
  getSchemaUrl,
} from '@l2beat/config'
import chalk from 'chalk'
import { command } from 'cmd-ts'
import { keyInYN } from 'readline-sync'
import { assertAnonymous } from '../implementations/crops/anonymity'
import {
  executeFlag,
  networkOption,
  rpcUrlOption,
} from '../implementations/crops/args'
import {
  createReader,
  createSigner,
  isSchemaRegistered,
  registerSchema,
} from '../implementations/crops/easClient'
import { defaultRpcUrl } from '../implementations/crops/rpc'
import { assertSchemaUid } from '../implementations/crops/schema'

export const CropsSchema = command({
  name: 'crops-schema',
  description:
    'Prints the crop attestation schema and its uid, and registers it in the EAS SchemaRegistry.',
  args: {
    network: networkOption,
    rpcUrl: rpcUrlOption,
    execute: executeFlag,
  },
  handler: async (args) => {
    assertSchemaUid()

    const network = args.network
    const rpcUrl = args.rpcUrl ?? defaultRpcUrl(network)
    // Before any RPC work, so a missing key fails first.
    const signer = args.execute ? createSigner(rpcUrl) : undefined

    assertAnonymous(network, 'The attestation schema', ATTESTATION_SCHEMA)
    console.log(chalk.bold('schema  '), ATTESTATION_SCHEMA)
    console.log(chalk.bold('resolver'), ATTESTATION_SCHEMA_RESOLVER)
    console.log(chalk.bold('revocable'), ATTESTATION_SCHEMA_REVOCABLE)
    console.log(chalk.bold('uid     '), ATTESTATION_SCHEMA_UID)
    console.log(chalk.bold('network '), `${network.name} (${network.chainId})`)
    console.log(chalk.bold('explorer'), getSchemaUrl(network))

    const reader = createReader(rpcUrl)
    if (await isSchemaRegistered(reader, network)) {
      console.log(chalk.green('\nAlready registered on this network.'))
      return
    }
    console.log(chalk.yellow('\nNot registered on this network yet.'))

    if (!signer) {
      console.log('Pass --execute to register it.')
      return
    }

    console.log(`\nattester ${signer.account?.address} on ${network.name}`)
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
