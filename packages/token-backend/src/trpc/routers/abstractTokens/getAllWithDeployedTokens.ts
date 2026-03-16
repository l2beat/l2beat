import type { TokenDatabase } from '@l2beat/database'

export async function getAllWithDeployedTokens(tokenDb: TokenDatabase) {
  const [abstractTokens, allDeployedTokens] = await Promise.all([
    tokenDb.abstractToken.getAll(),
    tokenDb.deployedToken.getAll(),
  ])

  const deployedByAbstract = allDeployedTokens.reduce(
    (acc, deployed) => {
      if (deployed.abstractTokenId) {
        if (!acc[deployed.abstractTokenId]) {
          acc[deployed.abstractTokenId] = []
        }
        acc[deployed.abstractTokenId]?.push(deployed)
      }
      return acc
    },
    {} as Record<string, typeof allDeployedTokens>,
  )

  const abstractTokenIds = abstractTokens.map((t) => t.id)

  const deployedWithoutAbstractTokens = allDeployedTokens.filter(
    (t) => !t.abstractTokenId || !abstractTokenIds.includes(t.abstractTokenId),
  )

  return {
    abstractTokens: abstractTokens.map((abstractToken) => ({
      ...abstractToken,
      deployedTokens: deployedByAbstract[abstractToken.id] ?? [],
    })),
    deployedWithoutAbstractTokens,
  }
}
