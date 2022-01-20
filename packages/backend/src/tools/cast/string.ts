import { CastError } from './CastError'

export function string(value: unknown) {
  if (typeof value !== 'string') {
    throw new CastError('string')
  }
  return value
}
