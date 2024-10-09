import { Database, DeploymentRecord } from '@l2beat/database'
import { NetworkConfig, WithExplorer } from './get-networks-config.js'

type Dependencies = {
  db: Database
  networkConfig: WithExplorer<NetworkConfig>
}

type Options = {
  /**
   * If true, the source will fetch the data for all tokens from scratch.
   */
  flush: boolean
}

export async function getTokensForChain(
  { db, networkConfig }: Dependencies,
  { flush }: Options = { flush: false },
) {
  const tokens = await db.token.getByChainId(networkConfig.chainId)

  if (!flush) {
    const deployments = await db.deployment.getByTokenIds(
      tokens.map((token) => token.id),
    )
    const deploymentsByTokenId = deployments.reduce(
      (acc, deployment) => {
        acc[deployment.tokenId] = deployment
        return acc
      },
      {} as Record<string, DeploymentRecord>,
    )
    return tokens.filter((token) => deploymentsByTokenId[token.id])
  }

  return tokens
}
