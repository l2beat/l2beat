import { assertUnreachable } from '~/utils/assertUnreachable'
import { abstractTokens, chains, deployedTokens } from './mockData'
import type { AbstractToken, DeployedToken } from './types'

type Intent = AddAbstractTokenIntent | AddDeployedTokenIntent

interface AddAbstractTokenIntent {
  type: 'AddAbstractTokenIntent'
  abstractToken: AbstractToken
}

interface AddDeployedTokenIntent {
  type: 'AddDeployedTokenIntent'
  deployedToken: DeployedToken
}

export type Command = AddAbstractTokenCommand | AddDeployedTokenCommand

interface AddAbstractTokenCommand {
  type: 'AddAbstractTokenCommand'
  abstractToken: AbstractToken
}

interface AddDeployedTokenCommand {
  type: 'AddDeployedTokenCommand'
  deployedToken: DeployedToken
}

export interface Plan {
  intent: Intent
  commands: Command[]
}

class MockTokenService {
  getAbstractTokens() {
    const result = abstractTokens.map((token) => ({
      ...token,
      deployedTokens: deployedTokens.filter(
        (t) => t.abstractTokenId === token.id,
      ),
    }))
    return simulateNetworkDelay(result)
  }

  getMainPageTokens() {
    const result = abstractTokens.map((token) => ({
      ...token,
      deployedTokens: deployedTokens.filter(
        (t) => t.abstractTokenId === token.id,
      ),
    }))

    const abstractTokenIds = result.map((t) => t.id)
    const deployedWithoutAbstractTokens = deployedTokens.filter(
      (t) =>
        !t.abstractTokenId || !abstractTokenIds.includes(t.abstractTokenId),
    )

    return simulateNetworkDelay({
      abstractTokens: result,
      deployedWithoutAbstractTokens,
    })
  }

  getChains() {
    return simulateNetworkDelay(chains)
  }

  checkIfDeployedTokenExists(address: string, chain: string) {
    return simulateNetworkDelay(
      deployedTokens.some((t) => t.address === address && t.chain === chain),
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
        abstractTokens.push(command.abstractToken)
        break
      case 'AddDeployedTokenCommand':
        deployedTokens.push(command.deployedToken)
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
