import { assert } from '@l2beat/shared-pure'

export function tmpHackGetFirst<T>(value: T | T[]): T {
  if (Array.isArray(value)) {
    const result = value[0]
    assert(result !== undefined)
    return result
  }
  return value
}
