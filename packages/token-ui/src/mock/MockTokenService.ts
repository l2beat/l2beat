import { parseAbstractTokens, parseDeployedTokens } from './mockData'
import type { AbstractToken, DeployedToken } from './types'

class MockTokenService {
  private abstractTokens: AbstractToken[] = parseAbstractTokens()
  private deployedTokens: DeployedToken[] = parseDeployedTokens()

  getMainPageTokens() {
    const result = this.abstractTokens.map((token) => ({
      ...token,
      deployedTokens: this.deployedTokens.filter(
        (t) => t.abstractTokenId === token.id,
      ),
    }))

    const abstractTokenIds = result.map((t) => t.id)
    const deployedWithoutAbstractTokens = this.deployedTokens.filter(
      (t) =>
        !t.abstractTokenId || !abstractTokenIds.includes(t.abstractTokenId),
    )

    return simulateNetworkDelay({
      abstractTokens: result,
      deployedWithoutAbstractTokens,
    })
  }
}

function simulateNetworkDelay<T>(promise: T, delay = 1000): Promise<T> {
  return new Promise<T>((resolve) => {
    setTimeout(() => {
      resolve(promise)
    }, delay)
  })
}

export const tokenService = new MockTokenService()
