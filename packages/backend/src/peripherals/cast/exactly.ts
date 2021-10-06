import { CastError } from './CastError'

export function exactly<T>(expected: T) {
  return function (value: unknown) {
    if (value !== expected) {
      throw new CastError('exact value')
    }
    return expected
  }
}
