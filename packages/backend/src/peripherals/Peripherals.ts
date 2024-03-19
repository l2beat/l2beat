import { Logger } from '@l2beat/backend-tools'
import { HttpClient } from '@l2beat/shared'

import { BaseRepository } from './database/BaseRepository'
import { Database } from './database/Database'

interface RepositoryClass<T extends BaseRepository> {
  new (database: Database, logger: Logger): T
}

/**
 * Peripherals is a class that provides access to various external resources.
 * It is only intended to be used by modules. No services should depend on it!
 */
export class Peripherals {
  private readonly repositories: Map<
    RepositoryClass<BaseRepository>,
    BaseRepository
  > = new Map()

  constructor(
    public readonly database: Database,
    public readonly http: HttpClient,
    public readonly logger: Logger,
  ) {}

  getRepository<T extends BaseRepository>(clazz: RepositoryClass<T>): T {
    let repository = this.repositories.get(clazz)
    if (!repository) {
      repository = new clazz(this.database, this.logger)
      this.repositories.set(clazz, repository)
    }
    return repository as T
  }
}
