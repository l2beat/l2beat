import { assert, assertUnreachable } from '~/utils/assertUnreachable'
import {
  parseAbstractTokens,
  parseChains,
  parseDeployedTokens,
} from './mockData'
import type { AbstractToken, DeployedToken } from './types'

type Intent =
  | AddAbstractTokenIntent
  | AddDeployedTokenIntent
  | UpdateAbstractTokenIntent
  | UpdateDeployedTokenIntent
  | DeleteAbstractTokenIntent
  | DeleteDeployedTokenIntent

interface AddAbstractTokenIntent {
  type: 'AddAbstractTokenIntent'
  abstractToken: AbstractToken
}

interface AddDeployedTokenIntent {
  type: 'AddDeployedTokenIntent'
  deployedToken: DeployedToken
}

interface UpdateAbstractTokenIntent {
  type: 'UpdateAbstractTokenIntent'
  abstractToken: AbstractToken
}

interface UpdateDeployedTokenIntent {
  type: 'UpdateDeployedTokenIntent'
  deployedToken: DeployedToken
}

interface DeleteAbstractTokenIntent {
  type: 'DeleteAbstractTokenIntent'
  abstractTokenId: string
}

interface DeleteDeployedTokenIntent {
  type: 'DeleteDeployedTokenIntent'
  deployedTokenId: string
}

export type Command =
  | AddAbstractTokenCommand
  | AddDeployedTokenCommand
  | UpdateAbstractTokenCommand
  | UpdateDeployedTokenCommand
  | DeleteAbstractTokenCommand
  | DeleteDeployedTokenCommand

interface AddAbstractTokenCommand {
  type: 'AddAbstractTokenCommand'
  abstractToken: AbstractToken
}

interface AddDeployedTokenCommand {
  type: 'AddDeployedTokenCommand'
  deployedToken: DeployedToken
}

interface UpdateAbstractTokenCommand {
  type: 'UpdateAbstractTokenCommand'
  before: AbstractToken
  after: AbstractToken
}

interface UpdateDeployedTokenCommand {
  type: 'UpdateDeployedTokenCommand'
  before: DeployedToken
  after: DeployedToken
}

interface DeleteAbstractTokenCommand {
  type: 'DeleteAbstractTokenCommand'
  abstractToken: AbstractToken
}

interface DeleteDeployedTokenCommand {
  type: 'DeleteDeployedTokenCommand'
  deployedToken: DeployedToken
}

export interface Plan {
  intent: Intent
  commands: Command[]
}

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
    const deployedToken = this.deployedTokens.find((t) => t.id === id)
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

  plan(intent: Intent): Promise<Plan> {
    let commands: Command[]
    switch (intent.type) {
      case 'AddAbstractTokenIntent':
        commands = [
          {
            type: 'AddAbstractTokenCommand',
            abstractToken: intent.abstractToken,
          },
        ]
        break
      case 'AddDeployedTokenIntent':
        commands = [
          {
            type: 'AddDeployedTokenCommand',
            deployedToken: intent.deployedToken,
          },
        ]
        break

      case 'UpdateAbstractTokenIntent': {
        const before = this.abstractTokens.find(
          (t) => t.id === intent.abstractToken.id,
        )
        assert(before, 'Abstract token not found')

        commands = [
          {
            type: 'UpdateAbstractTokenCommand',
            before: before,
            after: intent.abstractToken,
          },
        ]
        break
      }
      case 'UpdateDeployedTokenIntent': {
        const before = this.deployedTokens.find(
          (t) => t.id === intent.deployedToken.id,
        )
        assert(before, 'Deployed token not found')

        commands = [
          {
            type: 'UpdateDeployedTokenCommand',
            before: before,
            after: intent.deployedToken,
          },
        ]
        break
      }
      case 'DeleteAbstractTokenIntent': {
        const abstractToken = this.abstractTokens.find(
          (t) => t.id === intent.abstractTokenId,
        )
        assert(abstractToken, 'Abstract token not found')
        const deployedTokens = this.deployedTokens.filter(
          (t) => t.abstractTokenId === intent.abstractTokenId,
        )
        commands = [
          {
            type: 'DeleteAbstractTokenCommand',
            abstractToken,
          },
          ...deployedTokens.map((t) => {
            const { abstractTokenId: _, ...tokenWithoutAbstractTokenId } = t
            return {
              type: 'UpdateDeployedTokenCommand' as const,
              before: t,
              after: tokenWithoutAbstractTokenId,
            }
          }),
        ]
        break
      }
      case 'DeleteDeployedTokenIntent': {
        const deployedToken = this.deployedTokens.find(
          (t) => t.id === intent.deployedTokenId,
        )
        assert(deployedToken, 'Deployed token not found')
        commands = [
          {
            type: 'DeleteDeployedTokenCommand',
            deployedToken: deployedToken,
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
        this.abstractTokens.push(command.abstractToken)
        break
      case 'AddDeployedTokenCommand':
        this.deployedTokens.push(command.deployedToken)
        break
      case 'DeleteAbstractTokenCommand':
        this.abstractTokens = this.abstractTokens.filter(
          (t) => t.id !== command.abstractToken.id,
        )
        break
      case 'DeleteDeployedTokenCommand':
        this.deployedTokens = this.deployedTokens.filter(
          (t) => t.id !== command.deployedToken.id,
        )
        break
      case 'UpdateAbstractTokenCommand':
        this.abstractTokens = this.abstractTokens.map((t) =>
          t.id === command.before.id ? command.after : t,
        )
        break
      case 'UpdateDeployedTokenCommand':
        this.deployedTokens = this.deployedTokens.map((t) =>
          t.id === command.before.id ? command.after : t,
        )
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
