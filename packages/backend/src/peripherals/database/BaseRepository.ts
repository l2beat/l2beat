import { Logger } from '@l2beat/common'
import { Knex } from 'knex'

interface AnyMethod<A extends unknown[], R> {
  (...args: A): Promise<R>
}

interface AddMethod<T, R> {
  (record: T): Promise<R>
}

interface AddManyMethod<T, R> {
  (records: T[]): Promise<R[]>
}

interface GetMethod<A extends unknown[], T> {
  (...args: A): Promise<T[]>
}

interface FindMethod<A extends unknown[], T> {
  (...args: A): Promise<T | undefined>
}

interface DeleteMethod<A extends unknown[]> {
  (...args: A): Promise<number>
}

interface SaveMethod<T> {
  (record: T): Promise<boolean>
}

export class BaseRepository {
  constructor(
    protected readonly knex: Knex,
    protected readonly logger: Logger
  ) {
    this.logger = logger.for(this)
  }

  protected wrapAny<A extends unknown[], R>(
    method: AnyMethod<A, R>
  ): AnyMethod<A, R> {
    return this.wrap(method, () => this.logger.debug({ method: method.name }))
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  protected wrapAdd<T, R extends number | string | String | Number>(
    method: AddMethod<T, R>
  ): AddMethod<T, R> {
    return this.wrap(method, (id) =>
      this.logger.debug({ method: method.name, id: id.valueOf() })
    )
  }

  protected wrapAddMany<T, R>(
    method: AddManyMethod<T, R>
  ): AddManyMethod<T, R> {
    const fn = async (records: T[]) => {
      if (records.length === 0) {
        this.logger.debug({ method: method.name, count: 0 })
        return []
      }
      const ids = await method.call(this, records)
      this.logger.debug({ method: method.name, count: ids.length })
      return ids
    }
    Object.defineProperty(fn, 'name', { value: method.name })
    return fn
  }

  protected wrapGet<A extends unknown[], T>(
    method: GetMethod<A, T>
  ): GetMethod<A, T> {
    return this.wrap(method, (records) =>
      this.logger.debug({ method: method.name, count: records.length })
    )
  }

  protected wrapFind<A extends unknown[], T>(
    method: FindMethod<A, T>
  ): FindMethod<A, T> {
    return this.wrap(method, (record) =>
      this.logger.debug({ method: method.name, count: record ? 1 : 0 })
    )
  }

  protected wrapDelete<A extends unknown[]>(
    method: DeleteMethod<A>
  ): DeleteMethod<A> {
    return this.wrap(method, (count) =>
      this.logger.debug({ method: method.name, count })
    )
  }

  protected wrapSave<T>(method: SaveMethod<T>): SaveMethod<T> {
    return this.wrap(method, (updated) =>
      this.logger.debug({ method: method.name, updated })
    )
  }

  private wrap<A extends unknown[], R>(
    method: AnyMethod<A, R>,
    log: (result: R) => void
  ): AnyMethod<A, R> {
    const fn = async (...args: A) => {
      const result = await method.call(this, ...args)
      log(result)
      return result
    }
    Object.defineProperty(fn, 'name', { value: method.name })
    return fn
  }
}
