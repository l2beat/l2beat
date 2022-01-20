import { CastError } from './CastError'

export function integer(value: unknown) {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new CastError('integer')
  }
  return value
}
