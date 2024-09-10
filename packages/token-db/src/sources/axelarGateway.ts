import { assert, Logger } from '@l2beat/backend-tools'
import { SetRequired } from 'type-fest'
import { isAddress, parseAbiItem } from 'viem'
import { upsertManyTokensWithMeta } from '../db/helpers.js'
import { PrismaClient } from '../db/prisma.js'
import { NetworkConfig } from '../utils/getNetworksConfig.js'
import { TokenUpdateQueue } from '../utils/queue/wrap.js'

export { buildAxelarGatewaySource }

type Dependencies = {
  logger: Logger
  db: PrismaClient
  networkConfig: NetworkConfig
  queue: TokenUpdateQueue
}

function buildAxelarGatewaySource({
  logger,
  db,
  networkConfig,
  queue,
}: Dependencies) {
  logger = logger.for('AxelarGatewaySource').tag(`${networkConfig.name}`)

  return async function () {
    logger.info(`Syncing tokens from Axelar Gateway...`)

    const network = await db.network
      .findFirst({
        include: {
          rpcs: true,
        },
        where: {
          axelarGatewayAddress: {
            not: null,
          },
          chainId: networkConfig.chainId,
        },
      })
      .then((result) => {
        if (!result) {
          return
        }
        const { axelarGatewayAddress } = result
        assert(axelarGatewayAddress, 'Expected axelarGatewayAddress')
        assert(isAddress(axelarGatewayAddress), 'Expected address')
        return {
          ...result,
          axelarGatewayAddress,
        }
      })

    if (!network) {
      logger.info(`Syncing tokens from Axelar Gateway skipped`)
      return
    }

    try {
      const logs = await networkConfig.publicClient.getLogs({
        event: parseAbiItem(
          'event TokenDeployed(string symbol, address tokenAddresses)',
        ),
        address: network.axelarGatewayAddress,
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
          networkId: network.id,
          address: log.args.tokenAddresses,
          source: { type: 'AxelarGateway' as const },
          symbol: log.args.symbol,
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
