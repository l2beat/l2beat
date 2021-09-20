const Optional = Symbol()

export function optional<T>(cast: (value: unknown) => T) {
  const result = function (value: unknown) {
    if (value === null || value === undefined) {
      return undefined
    }
    return cast(value)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(result as any)[Optional] = true
  return result
}

export function isOptional(cast: (value: unknown) => unknown) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (cast as any)[Optional] === true
}
