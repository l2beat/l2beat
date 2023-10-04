export function withoutDuplicates<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}
