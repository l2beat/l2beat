import { CastError } from './CastError'

export function number(value: unknown) {
  if (typeof value !== 'number') {
    throw new CastError('number')
  }
  return value
}
