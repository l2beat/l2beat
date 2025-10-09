import type { Command, Plan } from '@l2beat/token-service'
import fuzzysort from 'fuzzysort'
import { assert, assertUnreachable } from '~/utils/assertUnreachable'
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

  getAbstractTokens() {
    const result = this.abstractTokens.map((token) => ({
      ...token,
      deployedTokens: this.deployedTokens.filter(
        (t) => t.abstractTokenId === token.id,
      ),
    }))
    return simulateNetworkDelay(result)
  }

  search(search: string) {
    if (search.startsWith('0x')) {
      return simulateNetworkDelay(
        {
          deployedTokens: this.deployedTokens.filter(
            (t) => t.address === search,
          ),
          abstractTokens: [],
        },
        300,
      )
    }

    const abstractTokens = fuzzysort
      .go(search, this.abstractTokens, {
        limit: 15,
        keys: [
          (e) => e.id,
          (e) => e.symbol,
          (e) => e.category,
          (e) => e.coingeckoId ?? '',
          (e) => e.issuer ?? 'unknown',
        ],
      })
      .map((match) => match.obj)

    const deployedTokens = fuzzysort
      .go(search, this.deployedTokens, {
        limit: 15,
        keys: [
          (e) => e.address,
          (e) => e.symbol,
          (e) => e.chain,
          (e) => e.abstractTokenId ?? '',
        ],
      })
      .map((match) => match.obj)

    return simulateNetworkDelay(
      {
        abstractTokens,
        deployedTokens,
      },
      300,
    )
  }

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

  getChains() {
    return simulateNetworkDelay(this.chains)
  }

  checkIfDeployedTokenExists(address: string, chain: string) {
    return simulateNetworkDelay(
      this.deployedTokens.some(
        (t) => t.address === address && t.chain === chain,
      ),
    )
  }

  plan(intent: Plan['intent']): Promise<Plan> {
    let commands: Command[]
    switch (intent.type) {
      case 'AddAbstractTokenIntent':
        commands = [
          {
            type: 'AddAbstractTokenCommand',
            record: intent.record,
          },
        ]
        break
      case 'AddDeployedTokenIntent':
        commands = [
          {
            type: 'AddDeployedTokenCommand',
            record: intent.record,
          },
        ]
        break

      case 'UpdateAbstractTokenIntent': {
        const before = this.abstractTokens.find((t) => t.id === intent.id)
        assert(before, 'Abstract token not found')

        commands = [
          {
            type: 'UpdateAbstractTokenCommand',
            existing: before,
            id: intent.id,
            update: intent.update,
          },
        ]
        break
      }
      case 'UpdateDeployedTokenIntent': {
        const before = this.deployedTokens.find(
          (t) => t.address === intent.pk.address && t.chain === intent.pk.chain,
        )
        assert(before, 'Deployed token not found')

        commands = [
          {
            type: 'UpdateDeployedTokenCommand',
            existing: before,
            pk: intent.pk,
            update: intent.update,
          },
        ]
        break
      }
      case 'DeleteAbstractTokenIntent': {
        const abstractToken = this.abstractTokens.find(
          (t) => t.id === intent.id,
        )
        assert(abstractToken, 'Abstract token not found')
        const deployedTokens = this.deployedTokens.filter(
          (t) => t.abstractTokenId === intent.id,
        )
        commands = [
          {
            type: 'DeleteAbstractTokenCommand',
            id: intent.id,
          },
          ...deployedTokens.map((t) => {
            const { abstractTokenId: _, ...tokenWithoutAbstractTokenId } = t
            return {
              type: 'UpdateDeployedTokenCommand' as const,
              existing: t,
              pk: {
                chain: t.chain,
                address: t.address,
              },
              update: tokenWithoutAbstractTokenId,
            }
          }),
        ]
        break
      }
      case 'DeleteDeployedTokenIntent': {
        const deployedToken = this.deployedTokens.find(
          (t) => t.address === intent.pk.address && t.chain === intent.pk.chain,
        )
        assert(deployedToken, 'Deployed token not found')
        commands = [
          {
            type: 'DeleteDeployedTokenCommand',
            pk: intent.pk,
          },
        ]
        break
      }
      case 'DeleteAllAbstractTokensIntent': {
        commands = [
          {
            type: 'DeleteAllAbstractTokensCommand',
          },
        ]
        break
      }
      case 'DeleteAllDeployedTokensIntent': {
        commands = [
          {
            type: 'DeleteAllDeployedTokensCommand',
          },
        ]
        break
      }
      default:
        assertUnreachable(intent)
    }

    return simulateNetworkDelay({
      intent,
      commands,
    })
  }

  execute(plan: Plan) {
    for (const command of plan.commands) {
      this.executeCommand(command)
    }
    return simulateNetworkDelay({ outcome: 'success' })
  }
  private executeCommand(command: Command) {
    switch (command.type) {
      case 'AddAbstractTokenCommand':
        this.abstractTokens.push(command.record)
        break
      case 'AddDeployedTokenCommand':
        this.deployedTokens.push(command.record)
        break
      case 'DeleteAbstractTokenCommand':
        this.abstractTokens = this.abstractTokens.filter(
          (t) => t.id !== command.id,
        )
        break
      case 'DeleteDeployedTokenCommand':
        this.deployedTokens = this.deployedTokens.filter(
          (t) =>
            t.address !== command.pk.address && t.chain !== command.pk.chain,
        )
        break
      case 'UpdateAbstractTokenCommand':
        this.abstractTokens = this.abstractTokens.map((t) =>
          t.id === command.id ? { ...t, ...command.update } : t,
        )
        break
      case 'UpdateDeployedTokenCommand':
        this.deployedTokens = this.deployedTokens.map((t) =>
          t.address === command.pk.address && t.chain === command.pk.chain
            ? { ...t, ...command.update }
            : t,
        )
        break
      case 'DeleteAllAbstractTokensCommand':
        this.abstractTokens = []
        break
      case 'DeleteAllDeployedTokensCommand':
        this.deployedTokens = []
        break
      default:
        assertUnreachable(command)
    }
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
