export function compare(
  left: number | null,
  right: number | null,
  lowerIsBetter: boolean | undefined,
): {
  leader: 'left' | 'right' | undefined
  leftFill: number
  rightFill: number
} {
  if (left === null || right === null) {
    return { leader: undefined, leftFill: 0, rightFill: 0 }
  }
  const total = left + right
  let leftFill = total > 0 ? left / total : 0
  let rightFill = total > 0 ? right / total : 0
  if (lowerIsBetter) [leftFill, rightFill] = [rightFill, leftFill]
  if (left === right) return { leader: undefined, leftFill, rightFill }
  const leftWins = lowerIsBetter ? left < right : left > right
  return { leader: leftWins ? 'left' : 'right', leftFill, rightFill }
}
