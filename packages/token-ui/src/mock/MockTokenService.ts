import {
  parseAbstractTokens,
  parseChains,
  parseDeployedTokens,
} from './mockData'
import type { AbstractToken, DeployedToken } from './types'

class MockTokenService {
  private chains: string[] = parseChains()
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

  getToken(id: string) {
    const abstractToken = this.abstractTokens.find((t) => t.id === id)
    const abstractTokenWithDeployedTokens = abstractToken
      ? {
          ...abstractToken,
          deployedTokens: this.deployedTokens.filter(
            (t) => t.abstractTokenId === abstractToken.id,
          ),
        }
      : undefined
    if (abstractTokenWithDeployedTokens) {
      return {
        type: 'abstract' as const,
        token: abstractTokenWithDeployedTokens,
      }
    }
    const [chain, address] = id.split('+')
    const deployedToken = this.deployedTokens.find(
      (t) => t.address === address && t.chain === chain,
    )
    if (deployedToken) {
      return {
        type: 'deployed' as const,
        token: deployedToken,
      }
    }

    return null
  }

  checkIfDeployedTokenExists(address: string, chain: string) {
    return simulateNetworkDelay(
      this.deployedTokens.some(
        (t) => t.address === address && t.chain === chain,
      ),
    )
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
