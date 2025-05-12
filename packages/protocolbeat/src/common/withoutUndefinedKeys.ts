export function withoutUndefinedKeys<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T
}
