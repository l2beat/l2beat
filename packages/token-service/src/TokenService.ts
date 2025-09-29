import type { Logger } from '@l2beat/backend-tools'
import type {
  AbstractTokenRecord,
  DeployedTokenRecord,
  TokenConnectionRecord,
  TokenDatabase,
} from '@l2beat/database'
import { assert } from '@l2beat/shared-pure'

export class TokenService {
  constructor(
    private readonly db: TokenDatabase,
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  upsertAbstractTokens(t: AbstractTokenRecord[]): Promise<number> {
    return this.db.abstractToken.upsertMany(t)
  }

  upsertDeployedTokens(t: DeployedTokenRecord[]): Promise<number> {
    return this.db.deployedToken.upsertMany(t)
  }

  async findAllConnected(deployedId: string) {
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
