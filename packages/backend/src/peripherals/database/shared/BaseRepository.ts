import { Logger } from '@l2beat/shared'
import { wrapAndMeasure } from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { Histogram } from 'prom-client'

import { Database } from './Database'

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types */
type IdType = number | string | String | Number

type AnyMethod = (...args: any[]) => Promise<any>
type AddMethod = (record: any) => Promise<IdType>
type AddManyMethod = (records: any[]) => Promise<IdType[] | number>
type GetMethod = (...args: any[]) => Promise<{}[]>
type FindMethod = (...args: any[]) => Promise<{} | undefined>
type DeleteMethod = (...args: any[]) => Promise<number>
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types */

type Keys<T, U> = Extract<keyof T, U>
type Match<T, U> = T extends U ? T : Exclude<U, T>

type AddKeys<T> = Exclude<Keys<T, `add${string}`>, AddManyKeys<T>>
type AddManyKeys<T> = Keys<T, `addMany${string}` | `add${string}Many`>
type FindKeys<T> = Keys<T, `find${string}`>
type GetKeys<T> = Keys<T, `get${string}`>
type DeleteKeys<T> = Keys<T, `delete${string}`>

export type CheckConvention<T extends BaseRepository> = {
  [K in AddKeys<T>]: Match<T[K], AddMethod>
} & {
  [K in AddManyKeys<T>]: Match<T[K], AddManyMethod>
} & {
  [K in FindKeys<T>]: Match<T[K], FindMethod>
} & {
  [K in GetKeys<T>]: Match<T[K], GetMethod>
} & {
  [K in DeleteKeys<T>]: Match<T[K], DeleteMethod>
}

/* 
  This class requires its child classes to persist given naming convention of methods and wraps them with logger and metrics.
  
  The CheckConvention will make sure if you are using naming convention correctly. So in the child class' constructor you should always use this.autoWrap<CheckConvention<RepositoryName>>().

  Methods that should be auto wrapped needs to start with add, addMany, find, get or delete prefix.
  If you do not want to wrap some method then you should prefix the method name with "_".
  If you do not want to use autoWrap on some method then you have to wrap it manually before calling autoWrap.

  Naming convention:
    * add... -> 
      * Arguments: record that you want to add 
      * Return type: IdType
    * add...Many || addMany... -> 
      * Arguments: array of records that you want to add 
      * Return type: array of IdType or count of added records
    * find... ->
      * Arguments: any   
      * Return type: record or undefined
    * get... -> 
      * Arguments: any
      * Return type: array of records
    * delete... ->
      * Arguments: any
      * Return type: count of deleted records  
*/

type RepositoryHistogram = Histogram<'repository' | 'method'>
const repositoryHistogram: RepositoryHistogram = new Histogram({
  name: 'repository_method_duration_seconds',
  help: 'duration histogram of repository methods',
  labelNames: ['repository', 'method'],
})

export abstract class BaseRepository {
  protected histogram: RepositoryHistogram

  constructor(
    protected readonly database: Database,
    protected readonly logger: Logger,
  ) {
    this.logger = logger.for(this)
    this.histogram = repositoryHistogram
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
          method as unknown as GetMethod,
        ) as unknown as T[keyof T & string]
        continue
      }

      if (
        methodName.startsWith('addMany') ||
        (methodName.startsWith('add') && methodName.endsWith('Many'))
      ) {
        obj[methodName] = this.wrapAddMany(
          method as unknown as AddManyMethod,
        ) as unknown as T[keyof T & string]
        continue
      }

      if (methodName.startsWith('add')) {
        obj[methodName] = this.wrapAdd(
          method as unknown as AddMethod,
        ) as unknown as T[keyof T & string]
        continue
      }

      if (methodName.startsWith('find')) {
        obj[methodName] = this.wrapFind(
          method as unknown as FindMethod,
        ) as unknown as T[keyof T & string]
        continue
      }

      if (methodName.startsWith('delete')) {
        obj[methodName] = this.wrapDelete(
          method as unknown as DeleteMethod,
        ) as unknown as T[keyof T & string]
        continue
      }

      throw new Error(
        `Wrong repository method naming convention: ${methodName}`,
      )
    }
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  protected wrapAny<T extends AnyMethod>(method: T): T {
    return this.wrap(method, () => this.logger.debug({ method: method.name }))
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  protected wrapAdd<T extends AddMethod>(method: T): T {
    return this.wrap(method, (id) =>
      this.logger.info({ method: method.name, id: id.valueOf() }),
    )
  }

  protected wrapGet<T extends GetMethod>(method: T): T {
    return this.wrap(method, (records) =>
      this.logger.debug({
        method: method.name,
        count: Array.isArray(records) ? records.length : 1,
      }),
    )
  }

  protected wrapFind<T extends FindMethod>(method: T): T {
    return this.wrap(method, (record) =>
      this.logger.debug({ method: method.name, count: record ? 1 : 0 }),
    )
  }

  protected wrapDelete<T extends DeleteMethod>(method: T): T {
    return this.wrap(method, (count) =>
      this.logger.info({ method: method.name, count }),
    )
  }

  protected wrapAddMany<T extends AddManyMethod>(method: T): T {
    const fn = async (records: T[]) => {
      if (records.length === 0) {
        return []
      }
      return method.call(this, records)
    }

    return this.wrap(fn, (result) =>
      this.logger.debug({
        method: method.name,
        count: typeof result === 'number' ? result : result.length,
      }),
    ) as T
  }

  // adds execution time tracking
  private wrap<T extends AnyMethod>(
    method: T,
    log: (result: Awaited<ReturnType<T>>) => void,
  ): T {
    const measured = wrapAndMeasure(method.bind(this), {
      histogram: this.histogram,
      labels: { repository: this.constructor.name, method: method.name },
    })
    /* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */
    const fn = async (...args: Parameters<T>) => {
      const result: Awaited<ReturnType<T>> = await measured(...args)
      log(result)
      return result
    }
    /* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */
    Object.defineProperty(fn, 'name', { value: method.name })
    Object.defineProperty(fn, 'wrapped', { value: true })
    return fn as T
  }
}
