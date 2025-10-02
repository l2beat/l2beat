import { isDeepStrictEqual } from 'node:util'
import type { Logger } from '@l2beat/backend-tools'
import type {
  AbstractTokenRecord,
  AbstractTokenUpdate,
  DeployedTokenRecord,
  TokenConnectionRecord,
  TokenDatabase,
} from '@l2beat/database'
import { assert, assertUnreachable } from '@l2beat/shared-pure'

type Intent = AddAbstractTokenIntent | UpdateAbstractTokenIntent

interface AddAbstractTokenIntent {
  type: 'AddAbstractTokenIntent'
  abstractToken: AbstractTokenRecord
}

interface UpdateAbstractTokenIntent {
  type: 'UpdateAbstractTokenIntent'
  abstractTokenUpdate: AbstractTokenUpdate
}

type Command = AddAbstractTokenCommand | UpdateAbstractTokenCommand

interface AddAbstractTokenCommand {
  type: 'AddAbstractTokenCommand'
  abstractToken: AbstractTokenRecord
}

interface UpdateAbstractTokenCommand {
  type: 'UpdateAbstractTokenCommand'
  before: AbstractTokenRecord
  update: AbstractTokenUpdate
}

interface Plan {
  intent: Intent
  commands: Command[]
}

type PlanExecutionResult = PlanExecutionSuccess | PlanExecutionError

interface PlanExecutionError {
  outcome: 'error'
  error: string
}

interface PlanExecutionSuccess {
  outcome: 'success'
}

export class TokenService {
  constructor(
    private readonly db: TokenDatabase,
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  async plan(intent: Intent): Promise<Plan> {
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
      case 'UpdateAbstractTokenIntent':
        commands = await this.planUpdateAbstractToken(intent)
        break
      default:
        assertUnreachable(intent)
    }

    return {
      intent,
      commands,
    }
  }

  async planUpdateAbstractToken(
    intent: UpdateAbstractTokenIntent,
  ): Promise<Command[]> {
    const before = await this.db.abstractToken.findById(
      intent.abstractTokenUpdate.id,
    )
    if (before === undefined) {
      throw new Error(
        `AbstractToken ${intent.abstractTokenUpdate.id} doesn't exist`,
      )
    }
    return [
      {
        type: 'UpdateAbstractTokenCommand',
        before,
        update: intent.abstractTokenUpdate,
      },
    ]
  }

  execute(plan: Plan): Promise<PlanExecutionResult> {
    return this.db.transaction(
      async (): Promise<PlanExecutionResult> => {
        const regeneratedPlan = await this.plan(plan.intent)
        if (!isDeepStrictEqual(regeneratedPlan, plan)) {
          return {
            outcome: 'error',
            error:
              'Plan is no longer valid due to recent changes to the database',
          }
        }

        for (const command of plan.commands) {
          await this.executeCommand(command)
        }
        return {
          outcome: 'success',
        }
      },
      // Using SERIALIZABLE isolation level ensures that no other transaction can
      // run at the same time. This prevents situations where we make a query
      // (e.g. selecting all connected tokens), prepare an update based on its
      // result, but in the meantime someone else makes an update that
      // invalidates our query (e.g. adds a new connection).  In reality Postgres is
      // smart enough to allow parallel transactions as long as they don't break
      // the "illusion" of no two transactions running at the same time (in
      // "serialzed" order)
      'serializable',
    )
  }

  async executeCommand(command: Command) {
    switch (command.type) {
      case 'AddAbstractTokenCommand':
        await this.db.abstractToken.insert(command.abstractToken)
        break
      case 'UpdateAbstractTokenCommand':
        await this.db.abstractToken.update(command.update)
        break
      default:
        assertUnreachable(command)
    }
  }

  async findAllConnected(deployedId: number) {
    const result: {
      connection: TokenConnectionRecord
      otherToken: DeployedTokenRecord
    }[] = []

    const directConnections =
      await this.db.tokenConnection.getConnectionsFromOrTo(deployedId)

    for (const connection of directConnections) {
      const otherId =
        connection.tokenFromId === deployedId
          ? connection.tokenToId
          : connection.tokenFromId
      const otherToken = await this.db.deployedToken.findById(otherId)
      assert(otherToken !== undefined)
      result.push({
        connection,
        otherToken,
      })
    }

    return result
  }
}
