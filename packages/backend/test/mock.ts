export function mock<T>(overrides: Partial<T>): T {
  const clone = { ...overrides }
  const proxy = new Proxy(clone, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property, receiver)
      if (value !== undefined) {
        return value
      }
      const name = String(property)
      return () => {
        throw new Error(
          `Cannot call .${name}() - no mock implementation provided.`
        )
      }
    },
  })
  return proxy as T
}
