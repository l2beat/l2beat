import { Logger } from '@l2beat/backend-tools'
import { assert } from '@l2beat/shared-pure'

import { Database } from '@l2beat/database'
import { notUndefined } from '@l2beat/shared-pure'
import { getContract, parseAbiItem } from 'viem'
import { NetworkConfig } from '../utils/get-networks-config.js'

export { buildOptimismCanonicalSource }

const OPTIMISM_BRIDGE_3 = '0x4200000000000000000000000000000000000012'
const OVM_TOKEN_FACTORY = '0x2e985AcD6C8Fa033A4c5209b0140940E24da7C5C'

const abi = [parseAbiItem('function l1Token() external view returns (address)')]

type Dependencies = {
  logger: Logger
  db: Database
  networksConfig: NetworkConfig[]
}

function buildOptimismCanonicalSource({
  db,
  logger,
  networksConfig,
}: Dependencies) {
  logger = logger.for('OptimismCanonicalSource')

  return async function () {
    logger.info(`Syncing Optimism canonical tokens data...`)

    const optimismClient = networksConfig.find(
      (c) => c.name === 'Optimism',
    )?.publicClient
    assert(optimismClient, 'Optimism client not found')

    const optimismNetwork = await db.network.findByName('Optimism')
    assert(optimismNetwork, 'Optimism network not found')

    const tokens = await db.token.getByDeployment({
      networkId: optimismNetwork.id,
      deploymentConstraints: [
        { to: OPTIMISM_BRIDGE_3 },
        { to: OVM_TOKEN_FACTORY },
      ],
    })

    logger.info('Matching L2 tokens with L1 addresses...')
    const tokensBridgeToUpsert = await Promise.all(
      tokens.map(async (token) => {
        const contract = getContract({
          address: token.address as `0x${string}`,
          abi,
          client: optimismClient,
        })

        const l1Address = await contract.read.l1Token().catch(() => undefined)

        if (!l1Address) {
          return
        }

        const l1Token = await db.token.findByNetwork({
          network: optimismNetwork.name,
          address: l1Address,
        })

        if (!l1Token) {
          return
        }

        return {
          sourceTokenId: l1Token.id,
          targetTokenId: token.id,
          externalBridgeId: optimismNetwork.id,
        }
      }),
    )

    await db.tokenBridge.upsertMany(tokensBridgeToUpsert.filter(notUndefined))

    logger.info(
      `Synced ${tokensBridgeToUpsert.length} Optimism canonical tokens data`,
    )
  }
}
