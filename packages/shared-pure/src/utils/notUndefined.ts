export function notUndefined<T>(value: T | undefined): value is T {
  return value !== undefined
}

export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null
}
