import { Logger } from '@l2beat/common'
import { Knex } from 'knex'

import { Metrics, RepositoryHistogram } from '../../../Metrics'
import { Database } from './Database'

type AnyMethod<A extends unknown[], R> = (...args: A) => Promise<R>

type AddMethod<T, R> = (record: T) => Promise<R>

type AddManyMethod<T, R> = (records: T[]) => Promise<R[] | number>

type AddManyMethodWithIds<T, R> = (records: T[]) => Promise<R[]>

type AddManyMethodWithCount<T> = (records: T[]) => Promise<number>

type GetMethod<A extends unknown[], T> = (...args: A) => Promise<T[]>

type FindMethod<A extends unknown[], T> = (...args: A) => Promise<T | undefined>

type DeleteMethod<A extends unknown[]> = (...args: A) => Promise<number>

type SaveMethod<T> = (record: T) => Promise<boolean>

export class BaseRepository {
  protected histogram: RepositoryHistogram

  constructor(
    protected readonly database: Database,
    protected readonly logger: Logger,
    readonly metrics: Metrics,
  ) {
    this.logger = logger.for(this)
    this.histogram = metrics.repositoryHistogram
  }

  protected knex(trx?: Knex.Transaction) {
    return this.database.getKnex(trx)
  }

  protected wrapAny<A extends unknown[], R>(
    method: AnyMethod<A, R>,
  ): AnyMethod<A, R> {
    return this.wrap(method, () => this.logger.debug({ method: method.name }))
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  protected wrapAdd<T, R extends number | string | String | Number>(
    method: AddMethod<T, R>,
  ): AddMethod<T, R> {
    return this.wrap(method, (id) =>
      this.logger.debug({ method: method.name, id: id.valueOf() }),
    )
  }

  protected wrapAddMany<T, R>(
    method: AddManyMethodWithIds<T, R>,
  ): AddManyMethodWithIds<T, R>
  protected wrapAddMany<T>(
    method: AddManyMethodWithCount<T>,
  ): AddManyMethodWithCount<T>
  protected wrapAddMany<T, R>(
    method: AddManyMethod<T, R>,
  ): AddManyMethod<T, R> {
    const fn = async (records: T[]) => {
      if (records.length === 0) {
        this.logger.debug({ method: method.name, count: 0 })
        return []
      }
      const idsOrCount = await method.call(this, records)
      const count =
        typeof idsOrCount === 'number' ? idsOrCount : idsOrCount.length
      this.logger.debug({ method: method.name, count })
      return idsOrCount
    }
    Object.defineProperty(fn, 'name', { value: method.name })
    return fn
  }

  protected wrapGet<A extends unknown[], T>(
    method: GetMethod<A, T>,
  ): GetMethod<A, T> {
    return this.wrap(method, (records) =>
      this.logger.debug({ method: method.name, count: records.length }),
    )
  }

  protected wrapFind<A extends unknown[], T>(
    method: FindMethod<A, T>,
  ): FindMethod<A, T> {
    return this.wrap(method, (record) =>
      this.logger.debug({ method: method.name, count: record ? 1 : 0 }),
    )
  }

  protected wrapDelete<A extends unknown[]>(
    method: DeleteMethod<A>,
  ): DeleteMethod<A> {
    return this.wrap(method, (count) =>
      this.logger.debug({ method: method.name, count }),
    )
  }

  protected wrapSave<T>(method: SaveMethod<T>): SaveMethod<T> {
    return this.wrap(method, (updated) =>
      this.logger.debug({ method: method.name, updated }),
    )
  }

  async runInTransaction(
    fun: (trx: Knex.Transaction) => Promise<void>,
  ): Promise<void> {
    const knex = await this.knex()
    await knex.transaction(fun)
  }

  private wrap<A extends unknown[], R>(
    method: AnyMethod<A, R>,
    log: (result: R) => void,
  ): AnyMethod<A, R> {
    const fn = async (...args: A) => {
      const start = Date.now()
      const result = await method.call(this, ...args)
      const timeMs = Date.now() - start
      this.histogram
        .labels({ repository: this.constructor.name, method: method.name })
        .observe(timeMs / 1000)
      log(result)
      return result
    }
    Object.defineProperty(fn, 'name', { value: method.name })
    return fn
  }
}
