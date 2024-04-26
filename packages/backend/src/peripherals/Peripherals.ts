import { Logger } from '@l2beat/backend-tools'
import { HttpClient } from '@l2beat/shared'
import { isEqual } from 'lodash'

import { BaseRepository } from './database/BaseRepository'
import { Database } from './database/Database'

interface RepositoryClass<T extends BaseRepository> {
  new (database: Database, logger: Logger): T
}

export interface ClientClass<T, O> {
  create(services: { httpClient: HttpClient; logger: Logger }, options: O): T
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

  private readonly clients: Map<
    ClientClass<unknown, unknown>,
    { client: unknown; clientOptions: unknown }[]
  > = new Map()

  constructor(
    public readonly database: Database,
    public readonly httpClient: HttpClient,
    public readonly logger: Logger,
  ) {}

  /**
   * Returns a repository of the given class. If the repository has already been
   * created, it will be reused.
   */
  getRepository<T extends BaseRepository>(clazz: RepositoryClass<T>): T {
    let repository = this.repositories.get(clazz)
    if (!repository) {
      repository = new clazz(this.database, this.logger)
      this.repositories.set(clazz, repository)
    }
    return repository as T
  }

  /**
   * Returns a client of the given class. If the client has already been
   * created with the same options, it will be reused.
   *
   * The options are compared using lodash's isEqual function, so make sure that
   * you are not passing more than is requested.
   *
   * For example, if a client only needs { foo: number, bar: string }, don't pass
   * { foo: number, bar: string, baz: boolean }, even though TypeScript will
   * allow it!
   */
  getClient<T, O>(clazz: ClientClass<T, O>, options: O): T {
    const clients = this.clients.get(clazz) ?? []
    this.clients.set(clazz, clients)

    for (const { client, clientOptions } of clients) {
      if (isEqual(clientOptions, options)) {
        return client as T
      }
    }

    const client = clazz.create(
      { httpClient: this.httpClient, logger: this.logger },
      options,
    )
    clients.push({ client, clientOptions: options })
    return client
  }
}
