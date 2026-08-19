import { getEnv } from '@l2beat/backend-tools'
import {
  ConfigReader,
  discoverStarknet,
  getDiscoveryPaths,
  modelPermissionsCommand,
  type StarknetDiscoveryPin,
  type StarknetDiscoveryProviderOptions,
} from '@l2beat/discovery'
import { generateEntrypointsCommand } from '@l2beat/discovery/dist/discovery/shared-modules/generateEntrypoints'
import { HttpClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { command, flag, option, optional, positional, string } from 'cmd-ts'
import { getPlainLogger } from '../implementations/common/getPlainLogger'
import { updateDiffHistory } from '../implementations/discovery/updateDiffHistory'

const STARKSCAN_RPC_URL = 'https://api.starkscan.co/v1/SN_MAIN/rpc'

export const DiscoverStarknet = command({
  name: 'discover-starknet',
  description:
    'Run minimal discovery for a project living on Starknet (strk: addresses).',
  args: {
    project: positional({
      type: string,
      displayName: 'project',
      description: 'Name of the project to discover',
    }),
    message: option({
      type: optional(string),
      long: 'message',
      short: 'm',
      description:
        'Message that will be written in the description section of diffHistory.md',
    }),
    dev: flag({
      long: 'dev',
      description:
        'Rerun on the block and timestamp of the existing discovered.json, for byte-stable config/template iteration',
    }),
  },
  handler: async (args) => {
    const logger = getPlainLogger()
    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)
    const config = configReader.readConfig(args.project)
    const options = resolveStarknetOptions()

    if (options.voyagerApiKey === undefined) {
      logger.warn(
        'VOYAGER_API_KEY is not set - sources fall back to ABI-generated ' +
          'interfaces and role scans start from block 0 (deployment blocks ' +
          'come from Voyager)',
      )
    }

    let pin: StarknetDiscoveryPin | undefined
    if (args.dev) {
      const previous = configReader.readDiscovery(args.project)
      const blockNumber = previous.usedBlockNumbers?.starknet
      if (blockNumber === undefined) {
        throw new Error(
          '--dev requires an existing discovered.json with a starknet block number',
        )
      }
      pin = { blockNumber, timestamp: UnixTime(previous.timestamp) }
      logger.info(`Rerunning on block ${blockNumber} (--dev)`)
    }

    await discoverStarknet(
      config,
      paths,
      new HttpClient(),
      logger,
      options,
      pin,
    )
    await modelPermissionsCommand(
      args.project,
      configReader,
      undefined,
      paths,
      undefined,
      logger,
    )
    await updateDiffHistory(args.project, args.message, undefined, logger)
    await generateEntrypointsCommand(configReader, args.project, logger, {
      updateOnly: true,
      keepLegacy: true,
    })
  },
})

export function resolveStarknetOptions(): StarknetDiscoveryProviderOptions {
  const env = getEnv()
  const starkscanApiKey = env.optionalString('STARKSCAN_API_KEY')
  const rpcUrl =
    env.optionalString([
      'STARKNET_RPC_URL_FOR_DISCOVERY',
      'STARKNET_RPC_URL',
    ]) ?? (starkscanApiKey !== undefined ? STARKSCAN_RPC_URL : undefined)

  if (rpcUrl === undefined) {
    throw new Error(
      'Set STARKNET_RPC_URL_FOR_DISCOVERY (or STARKSCAN_API_KEY to use the Starkscan RPC) in packages/config/.env',
    )
  }

  return {
    rpcUrl,
    rpcHeaders:
      starkscanApiKey !== undefined
        ? { 'X-Starkscan-Api-Key': starkscanApiKey }
        : undefined,
    voyagerApiKey: env.optionalString('VOYAGER_API_KEY'),
    // e.g. 1_000_000 for Alchemy; the default 10_000 is the Starkscan cap
    eventBlockSpan: env.optionalInteger(
      'STARKNET_EVENT_BLOCK_SPAN_FOR_DISCOVERY',
    ),
  }
}
