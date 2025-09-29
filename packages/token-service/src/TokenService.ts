import type { Logger } from '@l2beat/backend-tools'
import type { TokenDatabase } from '@l2beat/database'

export class TokenService {
  constructor(
    private readonly db: TokenDatabase,
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this)
  }
}
