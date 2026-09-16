import { type Mock, vi } from 'vitest'

/**
 * A `T` whose function members are vitest mocks, so that call assertions such
 * as `toHaveBeenCalledWith` and `.mock.calls` typecheck without casts.
 *
 * Intersecting with `T` keeps the result assignable wherever a `T` is expected.
 */
export type MockObject<T> = T & {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? Mock<(...args: A) => R>
    : T[K]
}

/**
 * Builds a stand-in for `T` out of the members a test actually cares about.
 *
 * Reading a member that was not provided throws instead of returning
 * `undefined`, because a silent `undefined` turns a typo into a confusing
 * failure far away from its cause.
 *
 * @example
 * ```ts
 * const repo = mockObject<Repository>({ getAll: async () => [] })
 * await service.run(repo)
 * expect(repo.getAll).toHaveBeenCalledExactlyOnceWith()
 * ```
 */
export function mockObject<T>(overrides: Partial<T> = {}): MockObject<T> {
  const members = spyOnFunctionMembers(overrides)
  return new Proxy(members, {
    get(target, property, receiver) {
      const isProbedByFormatters = typeof property === 'symbol'
      if (isProbedByFormatters || Reflect.has(target, property)) {
        return Reflect.get(target, property, receiver)
      }
      throw new TypeError(
        `Cannot read .${property} - mockObject was created without it.`,
      )
    },
  }) as MockObject<T>
}

function spyOnFunctionMembers<T>(overrides: Partial<T>): Partial<T> {
  const members: Partial<T> = { ...overrides }
  for (const key of Object.keys(members) as (keyof T)[]) {
    const value = members[key]
    if (typeof value === 'function' && !vi.isMockFunction(value)) {
      members[key] = vi.fn(
        value as (...args: unknown[]) => unknown,
      ) as T[keyof T]
    }
  }
  return members
}
