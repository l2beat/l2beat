import { CastError } from './CastError'
import { isOptional } from './optional'

export type ObjectSchema<T> = {
  [K in keyof T]: (value: unknown) => T[K]
}

export function object<T>(schema: ObjectSchema<T>): (value: unknown) => T
export function object<T>(
  strict: 'strict',
  schema: ObjectSchema<T>
): (value: unknown) => T
export function object<T>(
  arg1: ObjectSchema<T> | 'strict',
  arg2?: ObjectSchema<T>
) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const schema = typeof arg1 === 'string' ? arg2! : arg1
  const strict = arg1 === 'strict'

  return function (value: unknown) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new CastError('object')
    }
    if (strict) {
      for (const key in value) {
        if (has(value, key) && !has(schema, key)) {
          throw new CastError('object')
        }
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: T = {} as any
    for (const key in schema) {
      if (has(schema, key)) {
        const cast = schema[key]
        if (!has(value, key) && isOptional(cast)) {
          continue
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result[key] = cast((value as any)[key])
      }
    }
    return result
  }
}

function has(object: unknown, key: string) {
  return Object.prototype.hasOwnProperty.call(object, key)
}
