export function factorialize(num: number): number {
  if (num < 0) return -1
  if (num === 0) return 1

  return num * factorialize(num - 1)
}
