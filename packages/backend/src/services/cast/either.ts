import { CastError } from './CastError'

export function either<T, U>(
  castT: (value: unknown) => T,
  castU: (value: unknown) => U
) {
  return function (value: unknown) {
    try {
      return castT(value)
    } catch {
      try {
        return castU(value)
      } catch {
        throw new CastError('either')
      }
    }
  }
}
