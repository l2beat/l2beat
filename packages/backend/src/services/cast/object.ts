import { CastError } from './CastError'
import { isOptional } from './optional'

export type ObjectSchema<T> = {
  [K in keyof T]: (value: unknown) => T[K]
}

export function object<T>(schema: ObjectSchema<T>) {
  return function (value: unknown) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new CastError('object')
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: T = {} as any
    for (const key in schema) {
      const cast = schema[key]
      if (
        !Object.prototype.hasOwnProperty.call(value, key) &&
        isOptional(cast)
      ) {
        continue
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result[key] = cast((value as any)[key])
    }
    return result
  }
}
