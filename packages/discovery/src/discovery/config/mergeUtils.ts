import { assert } from '@l2beat/shared-pure'
import uniq from 'lodash/uniq'

export type MergePolicy<T> = {
  [K in keyof T]-?: (base: T[K], override: T[K]) => T[K]
}

export function mergeWithPolicy<T extends object>(
  policy: MergePolicy<T>,
  base: T,
  override: T,
): T {
  assert(Object.keys(base).every((key) => key in policy))
  assert(Object.keys(override).every((key) => key in policy))
  const result = {} as T
  for (const key of Object.keys(policy) as (keyof T)[]) {
    result[key] = policy[key](base[key], override[key])
  }
  return result
}

type Scalar = string | number | boolean | undefined

export function overrideScalar<T extends Scalar>(base: T, override: T): T {
  return override ?? base
}

export function replaceArray<T extends unknown[] | undefined>(
  base: T,
  override: T,
): T {
  return override ?? base
}

export function mergeRecordShallow<
  T extends Record<string, unknown> | undefined,
>(base: T, override: T): T {
  if (base === undefined || override === undefined) {
    return override ?? base
  }
  return { ...base, ...override }
}

export function mergeRecordByName<V>(
  mergeValue: (base: V, override: V) => V,
): <R extends Record<string, V> | undefined>(base: R, override: R) => R {
  return (base, override) => {
    if (base === undefined || override === undefined) {
      return override ?? base
    }
    const result: Record<string, V> = { ...base }
    for (const [name, overrideValue] of Object.entries(override)) {
      const baseValue = base[name]
      result[name] =
        baseValue === undefined
          ? overrideValue
          : mergeValue(baseValue, overrideValue)
    }
    return result as typeof base
  }
}

export function unionStrings<T extends string[] | undefined>(
  base: T,
  override: T,
): T {
  if (base === undefined || override === undefined) {
    return override ?? base
  }
  return uniq([...base, ...override]) as T
}

export function mergeIgnoreRelatives<T extends string[] | true | undefined>(
  base: T,
  override: T,
): T {
  if (base === true || override === true) {
    return true as T
  }
  return unionStrings(base as string[] | undefined, override) as T
}
