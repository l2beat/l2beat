import { Logger } from '@l2beat/backend-tools'

import { Database } from '@l2beat/database'
import { assert } from '@l2beat/shared-pure'
import { notUndefined } from '@l2beat/shared-pure'
import { getContract, parseAbiItem } from 'viem'
import { NetworkConfig } from '../utils/get-networks-config.js'

export { buildArbitrumCanonicalSource }

const ARB_RETRYABLE_TX = '0x000000000000000000000000000000000000006E'
const L2_ERC20_GATEWAY = '0x09e9222E96E7B4AE2a407B98d48e330053351EEe'

const abi = [
  parseAbiItem('function l1Address() external view returns (address)'),
]

type Dependencies = {
  logger: Logger
  db: Database
  networksConfig: NetworkConfig[]
}

function buildArbitrumCanonicalSource({
  db,
  logger,
  networksConfig,
}: Dependencies) {
  logger = logger.for('ArbitrumCanonicalSource')

  return async function () {
    logger.info(`Syncing Arbitrum canonical tokens data...`)

    const arbitrumClient = networksConfig.find(
      (c) => c.name === 'Arbitrum One',
    )?.publicClient
    assert(arbitrumClient, 'Arbitrum One client not found')

    const arbitrumNetwork = await db.network.findByName('Arbitrum One')
    assert(arbitrumNetwork, 'Arbitrum One network not found')

    const tokens = await db.token.getByDeploymentTargetAndContractName({
      networkId: arbitrumNetwork.id,
      to: [L2_ERC20_GATEWAY, ARB_RETRYABLE_TX],
      contractName: 'ClonableBeaconProxy',
    })

    logger.info('Matching L2 tokens with L1 addresses...')
    const tokensBridgeToUpsert = await Promise.all(
      tokens.map(async (token) => {
        const contract = getContract({
          address: token.address as `0x${string}`,
          abi,
          client: arbitrumClient,
        })

        const l1Address = await contract.read.l1Address().catch(() => undefined)

        assert(l1Address, 'L1 address not found')

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
      `Synced ${tokensBridgeToUpsert.length} Arbitrum canonical tokens data`,
    )
  }
}
