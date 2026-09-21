/**
 * Identity of a plan, independent of how its JSON happened to be laid out.
 *
 * The benchmark's consistency number counts how many of N authored plans
 * were identical, and a model that emits the same steps in a different key
 * order has produced the same plan. Keys are therefore sorted at every level
 * before hashing; array order is meaningful (steps run in order, `covers`
 * are compared as lists) and is kept.
 */
import { createHash } from 'crypto'

export function planHash(plan: unknown): string {
  return `0x${createHash('sha256').update(canonicalJson(plan)).digest('hex')}`
}

export function canonicalJson(value: unknown): string {
  return JSON.stringify(sortKeys(value))
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeys)
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entry]) => entry !== undefined)
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .map(([key, entry]) => [key, sortKeys(entry)]),
    )
  }
  return value
}
