import type { InteropSelection } from './types'

export function isSameInteropSelection(
  left: InteropSelection,
  right: InteropSelection,
) {
  return (
    left.from.length === right.from.length &&
    left.to.length === right.to.length &&
    left.from.every((value, index) => value === right.from[index]) &&
    left.to.every((value, index) => value === right.to[index])
  )
}
