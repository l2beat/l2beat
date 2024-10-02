import { Logger } from '@l2beat/backend-tools'
import { assert } from '@l2beat/shared-pure'

import { Database } from '@l2beat/database'
import { notUndefined } from '@l2beat/shared-pure'
import { getContract, parseAbiItem } from 'viem'
import { NetworkConfig } from '../utils/get-networks-config.js'

export { buildZkSyncCanonicalSource }

const ZKSYNC_DEPLOYER = '0x689a1966931eb4bb6fb81430e6ce0a03aabdf174'

const abi = [
  parseAbiItem('function l1Address() external view returns (address)'),
]

type Dependencies = {
  logger: Logger
  db: Database
  networksConfig: NetworkConfig[]
}

function buildZkSyncCanonicalSource({
  db,
  logger,
  networksConfig,
}: Dependencies) {
  logger = logger.for('ZkSyncCanonicalSource')

  return async function () {
    logger.info(`Syncing ZkSync canonical tokens data...`)

    const zkSyncClient = networksConfig.find(
      (c) => c.name === 'zkSync',
    )?.publicClient
    assert(zkSyncClient, 'zkSync client not found')

    const zkSyncNetwork = await db.network.findByName('zkSync')
    assert(zkSyncNetwork, 'zkSync network not found')

    const tokens = await db.token.getByDeployment({
      deploymentConstraints: [{ from: ZKSYNC_DEPLOYER }],
      networkId: zkSyncNetwork.id,
    })

    logger.info('Matching L2 tokens with L1 addresses...')
    const tokensBridgeToUpsert = await Promise.all(
      tokens.map(async (token) => {
        const contract = getContract({
          address: token.address as `0x${string}`,
          abi,
          client: zkSyncClient,
        })

        const l1Address = await contract.read.l1Address().catch(() => undefined)

        if (!l1Address) {
          return
        }

        const l1Token = await db.token.findByNetwork({
          network: 'Ethereum',
          address: l1Address,
        })
        if (!l1Token) {
          return
        }

        return {
          sourceTokenId: l1Token.id,
          targetTokenId: token.id,
          externalBridgeId: null,
        }
      }),
    )

    await db.tokenBridge.upsertMany(tokensBridgeToUpsert.filter(notUndefined))

    logger.info(
      `Synced ${tokensBridgeToUpsert.length} zkSync canonical tokens data`,
    )
  }
}
