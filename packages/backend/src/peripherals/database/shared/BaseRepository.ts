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

type Keys<T, U> = Extract<keyof T, U>
type Match<T, U> = T extends U ? T : never

/* eslint-disable @typescript-eslint/no-explicit-any */

export type CheckConvention<T extends BaseRepository> = {
  [K in Keys<T, `add${string}`>]: Match<T[K], AddMethod<any, any>>
} & {
  [K in Keys<T, `addMany${string}`>]: Match<T[K], AddManyMethod<any, any>>
} & {
  [K in Keys<T, `find${string}`>]: Match<T[K], FindMethod<any[], any>>
} & {
  [K in Keys<T, `get${string}`>]: Match<T[K], GetMethod<any[], any>>
} & {
  [K in Keys<T, `delete${string}`>]: Match<T[K], DeleteMethod<any[]>>
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/* 
  This class enforces its child classes to persist given naming convention of methods and wrap them with logger and metrics.
  
  The CheckConvention will make sure if you are using naming convention correctly. So in the child class' constructor you should always use this.autoWrap<CheckConvention<RepositoryName>>().

  Methods that should be auto wrapped needs to start with add, addMany, find, get or delete prefix.
  If you do not want to wrap some method then you should prefix the method name with "_".
  If you do not want to use autoWrap on some method then you have to wrap it manually before calling autoWrap.

  Naming convention:
    * add... -> 
      * Arguments: record that you want to add 
      * Return type: any
    * add...Many -> 
      * Arguments: array of records that you want to add 
      * Return type: array of records or count of added records
    * find... ->
      * Return type: record or undefined
    * get... -> 
      * Return type: array of records
    * delete... ->
      * Return type: count of deleted records  
*/
export abstract class BaseRepository {
  protected histogram: RepositoryHistogram

  constructor(
    protected readonly database: Database,
    protected readonly logger: Logger,
    readonly metrics: Metrics,
  ) {
    this.logger = logger.for(this)
    this.histogram = metrics.repositoryHistogram
  }

  async runInTransaction(
    fun: (trx: Knex.Transaction) => Promise<void>,
  ): Promise<void> {
    const knex = await this.knex()
    await knex.transaction(fun)
  }

  protected knex(trx?: Knex.Transaction) {
    return this.database.getKnex(trx)
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  autoWrap<T>(obj: T) {
    const methodNames = Object.getOwnPropertyNames(
      Object.getPrototypeOf(obj),
    ) as unknown as (keyof T)[]

    for (const methodName of methodNames) {
      const method = obj[methodName]
      if (
        methodName === 'constructor' ||
        typeof method !== 'function' ||
        typeof methodName !== 'string' ||
        Object.prototype.hasOwnProperty.call(method, 'wrapped') ||
        methodName.startsWith('_')
      ) {
        continue
      }

      if (methodName.startsWith('get')) {
        obj[methodName] = this.wrapGet(
          method as unknown as GetMethod<any, any>,
        ) as unknown as T[keyof T & string]
        continue
      }

      if (methodName.startsWith('add') && methodName.includes('Many')) {
        obj[methodName] = this.wrapAddMany(
          method as unknown as AddManyMethod<any, any>,
        ) as unknown as T[keyof T & string]
        continue
      }

      if (methodName.startsWith('add')) {
        obj[methodName] = this.wrapAdd(
          method as unknown as AddMethod<any, any>,
        ) as unknown as T[keyof T & string]
        continue
      }

      if (methodName.startsWith('find')) {
        obj[methodName] = this.wrapFind(
          method as unknown as FindMethod<any, any>,
        ) as unknown as T[keyof T & string]
        continue
      }

      if (methodName.startsWith('delete')) {
        obj[methodName] = this.wrapDelete(
          method as unknown as DeleteMethod<any>,
        ) as unknown as T[keyof T & string]
        continue
      }

      throw new Error(
        `Wrong repository method naming convention: ${methodName}`,
      )
    }
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

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
      this.logger.info({ method: method.name, id: id.valueOf() }),
    )
  }

  protected wrapGet<A extends unknown[], T>(
    method: GetMethod<A, T>,
  ): GetMethod<A, T> {
    return this.wrap(method, (records) =>
      this.logger.debug({
        method: method.name,
        count: Array.isArray(records) ? records.length : 1,
      }),
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
      this.logger.info({ method: method.name, count }),
    )
  }

  protected wrapAddMany<T, R>(
    method: AddManyMethodWithIds<T, R>,
  ): AddManyMethodWithIds<T, R>
  protected wrapAddMany<T>(
    method: AddManyMethodWithCount<T>,
  ): AddManyMethodWithCount<T>
  protected wrapAddMany<T, R>(method: AddManyMethod<T, R>): AddManyMethod<T, R>
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
    Object.defineProperty(fn, 'wrapped', { value: true })
    return fn
  }

  // adds execution time tracking
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
    Object.defineProperty(fn, 'wrapped', { value: true })
    return fn
  }
}
