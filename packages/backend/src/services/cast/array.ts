import { CastError } from './CastError'

export function array<T>(cast: (value: unknown) => T) {
  return function (value: unknown) {
    if (!Array.isArray(value)) {
      throw new CastError('array')
    }
    return value.map((item) => cast(item))
  }
}
