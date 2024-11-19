import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { assert } from '@l2beat/shared-pure'
import { nanoid } from 'nanoid'
import { NetworkConfig, WithExplorer } from '../utils/get-networks-config.js'
import { TokenUpdateQueue } from '../utils/queue/wrap.js'

type Dependencies = {
  db: Database
  logger: Logger
  networkConfig: WithExplorer<NetworkConfig>
  queue: TokenUpdateQueue
}

export function buildLayerZeroV1Source({
  db,
  logger,
  networkConfig: { chainId, networkId, explorerClient, publicClient, name },
  queue,
}: Dependencies) {
  logger = logger.for('LayerZeroV1Source').tag({ tag: name })

  return async function () {
    logger.info(`Syncing tokens from LayerZero...`)

    logger.info('Upserting bridge info')
    const { id: externalBridgeId } = await db.externalBridge.upsert({
      name: 'LayerZeroV1',
      type: 'LayerZeroV1',
    })

    // TODO We have to decide whether we inject required data, filter it out or something else
    const network = await db.network.findByChainId(chainId)

    if (!network || !network.layerZeroV1EndpointAddress) {
      logger.warn('Network has no layer zero v1 endpoint assigned')
      return
    }

    const endpointAddress = network.layerZeroV1EndpointAddress as `0x${string}`

    const blockNumber = await publicClient.getBlockNumber()

    const deploymentInfo =
      await explorerClient.getContractDeployment(endpointAddress)

    assert(deploymentInfo, 'Could not retrieve deployment info')

    const transaction = await publicClient.getTransaction({
      hash: deploymentInfo.txHash as `0x${string}`,
    })

    const fromAddresses = new Set<string>()
    const fromBlock = Number(transaction.blockNumber)
    const toBlock = Number(blockNumber)
    const batchSize = 10_000
    logger.info(`Fetching addresses from internal transaction to Endpoint`, {
      fromBlock,
      toBlock,
      batchSize,
    })

    for (let i = fromBlock; i < toBlock; i += batchSize) {
      logger.info('Fetching internal transactions', {
        fromBlock: i,
        toBlock: i + batchSize,
      })

      const fetchedInternalTxs = await explorerClient.getInternalTransactions(
        endpointAddress,
        i - 1,
        i + batchSize,
      )

      // reduce memory footprint by only storing the from address
      fetchedInternalTxs.forEach((ftx) => fromAddresses.add(ftx.from))
    }

    logger.info('Addresses fetched', { count: fromAddresses.size })

    const ercAddresses: string[] = []

    logger.info('Filtering ERC20 addresses')

    let idx = 1
    for (const address of Array.from(fromAddresses)) {
      logger.info('Pulling ABI', {
        address,
        current: idx++,
        total: fromAddresses.size,
      })

      const source = await explorerClient.getContractSource(
        address as `0x${string}`,
      )

      const isErc20 = source?.ABI.includes('balanceOf')

      if (isErc20) {
        ercAddresses.push(address)
      }
    }

    logger.info('ERC20 addresses fetched', { count: ercAddresses.length })

    logger.info('Inserting tokens', { count: ercAddresses.length })
    await db.token.upsertMany(
      ercAddresses.map((address) => ({
        id: nanoid(),
        address,
        networkId,
      })),
    )

    logger.info('Inserting bridge escrows', { count: ercAddresses.length })
    const tokenEntities = await db.token.getByNetworks(
      ercAddresses.map((address) => ({
        address,
        networkId,
      })),
    )

    logger.info('Upserting bridge escrows', { count: ercAddresses.length })
    await db.bridgeEscrow.upsertMany(
      ercAddresses.map((address) => ({
        id: nanoid(),
        externalBridgeId,
        address,
        networkId,
      })),
    )

    await Promise.all(tokenEntities.map((token) => queue.add(token.id)))

    logger.info(`Synced tokens from LayerZero`)
  }
}
