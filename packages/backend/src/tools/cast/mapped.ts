export function mapped<T, U>(
  cast: (value: unknown) => T,
  map: (value: T) => U
) {
  return function (value: unknown) {
    const parsed = cast(value)
    return map(parsed)
  }
}
