import { Mock as MockFunction, mockFn } from 'earljs'

export type MockedObject<T> = T & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [P in keyof T]: T[P] extends (...args: any[]) => any
    ? MockFunction.Of<T[P]>
    : T[P]
}

export function mock<T>(overrides: Partial<T> = {}): MockedObject<T> {
  const clone = replaceFunctionsWithMocks(overrides)

  const proxy = new Proxy(clone as unknown as MockedObject<T>, {
    get(target, property, receiver) {
      const value: unknown = Reflect.get(target, property, receiver)
      if (value !== undefined) {
        return value
      }
      const name = String(property)

      const res = () => {
        throw new Error(
          `Cannot call .${name}() - no mock implementation provided.`,
        )
      }

      // Handles `expect(f).toHaveBeenCalledWith([])` when the function wasn't
      // called. We'd otherwise fail the test with the following error:
      // > TypeError: control.actual.calls is not iterable
      Object.defineProperty(res, 'calls', {
        get: () => {
          throw new Error(
            'Cannot access .calls - no mock implementation provided' +
              ' and the function was not called.',
          )
        },
      })

      return res
    },
  })

  return proxy
}

function replaceFunctionsWithMocks<T extends object>(object: T) {
  const clone = { ...object }
  for (const key of Object.keys(clone) as (keyof T)[]) {
    const value = clone[key]
    if (typeof value === 'function') {
      if (!isMockFunction(value)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        clone[key] = mockFn(value as any) as any
      }
    }
  }
  return clone
}

function isMockFunction(x: unknown) {
  return typeof x === 'function' && 'calls' in x
}
