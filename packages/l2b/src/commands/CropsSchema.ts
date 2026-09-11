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
  loadCropAttestations,
  pickNetwork,
} from '../implementations/crops/attestations'
import {
  createReader,
  createSigner,
  type EasTarget,
  getSchemaUrl,
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
    const config = await loadCropAttestations()
    assertSchemaUid(config.schema)

    const network = pickNetwork(config, args.network)
    const target: EasTarget = { network, schema: config.schema }
    const rpcUrl = args.rpcUrl ?? defaultRpcUrl(network)
    // Before any RPC work, so a missing key fails first.
    const signer = args.execute ? createSigner(rpcUrl) : undefined

    const { schema } = config
    assertAnonymous(network, 'The attestation schema', schema.definition)
    console.log(chalk.bold('schema  '), schema.definition)
    console.log(chalk.bold('resolver'), schema.resolver)
    console.log(chalk.bold('revocable'), schema.revocable)
    console.log(chalk.bold('uid     '), schema.uid)
    console.log(chalk.bold('network '), `${network.name} (${network.chainId})`)
    console.log(chalk.bold('explorer'), getSchemaUrl(target))

    const reader = createReader(rpcUrl)
    if (await isSchemaRegistered(reader, target)) {
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

    const txHash = await registerSchema(signer, target)
    console.log(chalk.green('registered'), txHash)
  },
})
