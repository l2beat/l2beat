import type { Logger } from '@l2beat/backend-tools'
import type {
  AbstractTokenRecord,
  DeployedTokenRecord,
  TokenConnectionRecord,
  TokenDatabase,
} from '@l2beat/database'
import { assert, assertUnreachable } from '@l2beat/shared-pure'

type Intent = AddAbstractTokenIntent

interface AddAbstractTokenIntent {
  type: 'AddAbstractTokenIntent'
  abstractToken: AbstractTokenRecord
}

type Command = AddAbstracTokenCommand

interface AddAbstracTokenCommand {
  type: 'AddAbstracTokenCommand'
  abstractToken: AbstractTokenRecord
}

interface Plan {
  intent: Intent
  commands: Command[]
}

export class TokenService {
  constructor(
    private readonly db: TokenDatabase,
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  plan(intent: Intent): Plan {
    const commands: Command[] = []
    switch (intent.type) {
      case 'AddAbstractTokenIntent':
        commands.push({
          type: 'AddAbstracTokenCommand',
          abstractToken: intent.abstractToken,
        })
        break
      default:
        assertUnreachable(intent.type)
    }

    return {
      intent,
      commands,
    }
  }

  execute(plan: Plan) {
    this.db.transaction(
      async () => {
        // TODO
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
