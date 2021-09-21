import { CastError } from './CastError'

export function boolean(value: unknown) {
  if (typeof value !== 'boolean') {
    throw new CastError('boolean')
  }
  return value
}
