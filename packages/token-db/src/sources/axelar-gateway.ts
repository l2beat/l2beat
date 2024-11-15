import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { SetRequired } from 'type-fest'
import { getAddress, parseAbiItem } from 'viem'
import { upsertManyTokensWithMeta } from '../db/helpers.js'
import { NetworkConfig } from '../utils/get-networks-config.js'
import { TokenUpdateQueue } from '../utils/queue/wrap.js'

export { buildAxelarGatewaySource }

type Dependencies = {
  logger: Logger
  db: Database
  networkConfig: NetworkConfig
  queue: TokenUpdateQueue
}

function buildAxelarGatewaySource({
  logger,
  db,
  networkConfig,
  queue,
}: Dependencies) {
  logger = logger
    .for('AxelarGatewaySource')
    .tag({ tag: `${networkConfig.name}` })

  return async function () {
    logger.info(`Syncing tokens from Axelar Gateway...`)

    const network = await db.network.findByChainId(networkConfig.chainId)

    if (!network || !network.axelarGatewayAddress) {
      logger.info(`Syncing tokens from Axelar Gateway skipped`)
      return
    }

    try {
      const logs = await networkConfig.publicClient.getLogs({
        event: parseAbiItem(
          'event TokenDeployed(string symbol, address tokenAddresses)',
        ),
        address: getAddress(network.axelarGatewayAddress),
        fromBlock: 0n,
        toBlock: 'latest',
      })

      const tokens = logs
        .filter(
          (
            log,
          ): log is typeof log & {
            args: SetRequired<(typeof log)['args'], 'tokenAddresses'>
          } => !!log.args.tokenAddresses,
        )
        .map((log) => ({
          name: null,
          decimals: null,
          logoUrl: null,
          contractName: null,
          networkId: network.id,
          address: log.args.tokenAddresses,
          source: { type: 'AxelarGateway' as const },
          symbol: log.args.symbol ?? null,
          externalId: `${log.transactionHash}-${log.logIndex.toString()}`,
        }))

      logger.info('Inserting tokens', { count: tokens.length })
      const tokenIds = await upsertManyTokensWithMeta(db, tokens)

      await Promise.all(tokenIds.map((tokenId) => queue.add(tokenId)))
      logger.info(`Synced ${tokens.length} tokens from Axelar Gateway`)
    } catch (e) {
      logger.error(
        `Failed to sync tokens from Axelar Gateway on ${network.name}`,
        e,
      )
    }
  }
}
