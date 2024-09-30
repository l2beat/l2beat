import { Logger } from '@l2beat/backend-tools'
import { assert } from '@l2beat/shared-pure'

import { Database } from '@l2beat/database'
import { notUndefined } from '@l2beat/shared-pure'
import { getContract, parseAbiItem } from 'viem'
import { NetworkConfig } from '../utils/get-networks-config.js'

export { buildScrollCanonicalSource }

const SCROLL_MESSENGER = '0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC'

const abi = [
  parseAbiItem('function counterpart() external view returns (address)'),
]

type Dependencies = {
  logger: Logger
  db: Database
  networksConfig: NetworkConfig[]
}

function buildScrollCanonicalSource({
  db,
  logger,
  networksConfig,
}: Dependencies) {
  logger = logger.for('ScrollCanonicalSource')

  return async function () {
    logger.info(`Syncing Scroll canonical tokens data...`)

    const scrollClient = networksConfig.find(
      (c) => c.name === 'Scroll',
    )?.publicClient
    assert(scrollClient, 'Scroll client not found')

    const scrollNetwork = await db.network.findByName('Scroll')
    assert(scrollNetwork, 'Scroll network not found')

    const tokens = await db.token.getByDeployment({
      deploymentConstraints: [{ to: SCROLL_MESSENGER }],
      networkId: scrollNetwork.id,
    })

    logger.info('Matching L2 tokens with L1 addresses...')
    const tokensBridgeToUpsert = await Promise.all(
      tokens.map(async (token) => {
        const contract = getContract({
          address: token.address as `0x${string}`,
          abi,
          client: scrollClient,
        })

        const l1Address = await contract.read
          .counterpart()
          .catch(() => undefined)

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
      `Synced ${tokensBridgeToUpsert.length} Scroll canonical tokens data`,
    )
  }
}
