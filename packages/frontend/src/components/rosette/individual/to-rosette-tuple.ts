import { assert } from '@l2beat/shared-pure'
import type { RosetteValue } from '../types'
import type { RosetteValueTuple } from './individual-rosette-icon'

export function toRosetteTuple(arr: RosetteValue[]): RosetteValueTuple {
  assert(arr.length === 5, 'Expected 5 risks for rosette tuple')

  return arr as RosetteValueTuple
}
