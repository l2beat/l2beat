import { Logger } from '@l2beat/backend-tools'
import { assert } from '@l2beat/shared-pure'

import { Database } from '@l2beat/database'
import { notUndefined } from '@l2beat/shared-pure'
import { getContract, parseAbiItem } from 'viem'
import { NetworkConfig } from '../utils/get-networks-config.js'

export { buildLineaCanonicalSource }

const LINEA_MESSAGE_SERVICE = '0x508Ca82Df566dCD1B0DE8296e70a96332cD644ec'
const LINEA_TOKEN_DEPLOYER = '0x49ee40140e522651744e1c27828c76ee92802833'

const LINEA_BRIDGE = '0x353012dc4a9A6cF55c941bADC267f82004A8ceB9'

const tokenABI = [
  parseAbiItem('function bridge() public view returns (address)'),
]

const lineaBridgeABI = [
  parseAbiItem(
    'function bridgedToNativeToken(address) public view returns (address)',
  ),
]

type Dependencies = {
  logger: Logger
  db: Database
  networksConfig: NetworkConfig[]
}

function buildLineaCanonicalSource({
  db,
  logger,
  networksConfig,
}: Dependencies) {
  logger = logger.for('LineaCanonicalSource')

  return async function () {
    logger.info(`Syncing Linea canonical tokens data...`)

    const lineaClient = networksConfig.find(
      (c) => c.name === 'Linea',
    )?.publicClient
    assert(lineaClient, 'Linea client not found')

    const lineaNetwork = await db.network.findByName('Linea')
    assert(lineaNetwork, 'Linea network not found')

    const tokens = await db.token.getByDeployment({
      networkId: lineaNetwork.id,
      deploymentConstraints: [
        { to: LINEA_MESSAGE_SERVICE },
        { from: LINEA_TOKEN_DEPLOYER },
      ],
    })

    logger.info('Matching L2 tokens with L1 addresses...')
    const tokensBridgeToUpsert = (
      await Promise.all(
        tokens.map(async (token) => {
          const tokenContract = getContract({
            address: token.address as `0x${string}`,
            abi: tokenABI,
            client: lineaClient,
          })

          const bridgeAddress = await tokenContract.read
            .bridge()
            .catch(() => undefined)

          if (
            bridgeAddress?.toLocaleLowerCase() !== LINEA_BRIDGE.toLowerCase()
          ) {
            return
          }

          const bridgeContract = getContract({
            address: LINEA_BRIDGE as `0x${string}`,
            abi: lineaBridgeABI,
            client: lineaClient,
          })

          const l1Address = await bridgeContract.read
            .bridgedToNativeToken([token.address as `0x${string}`])
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
    ).filter(notUndefined)

    await db.tokenBridge.upsertMany(tokensBridgeToUpsert)

    logger.info(
      `Synced ${tokensBridgeToUpsert.length} Linea canonical tokens data`,
    )
  }
}
