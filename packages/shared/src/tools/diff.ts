import { isDeepStrictEqual } from 'util'

export interface DifferenceCreate {
  kind: 'create'
  path: (string | number)[]
  rhs: unknown
}

export interface DifferenceRemove {
  kind: 'remove'
  path: (string | number)[]
  lhs: unknown
}

export interface DifferenceChange {
  kind: 'change'
  path: (string | number)[]
  lhs: unknown
  rhs: unknown
}

export type Difference = DifferenceCreate | DifferenceRemove | DifferenceChange

const richTypes = { Date: true, RegExp: true, String: true, Number: true }

// NOTE(radomski): Fork of - https://github.com/AsyncBanana/microdiff
export function diff(left: unknown, right: unknown): Difference[] {
  const isLeftArray = Array.isArray(left)
  const isRightArray = Array.isArray(right)

  if (isLeftArray && isRightArray) {
    return lcsDiff(left, right)
  }

  if (
    typeof left !== 'object' ||
    typeof right !== 'object' ||
    right === null ||
    left === null
  ) {
    const diff: Difference[] = []
    if (left !== right) {
      diff.push({ kind: 'change', path: [], lhs: left, rhs: right })
    }
    return diff
  }

  const diffs: Difference[] = []
  for (const key in left) {
    // @ts-ignore: it's fine
    const lhs = left[key]
    const path = isLeftArray ? +key : key
    if (!(key in right)) {
      diffs.push({ kind: 'remove', path: [path], lhs })
      continue
    }

    // @ts-ignore: it's fine
    const rhs = right[key]
    const areCompatibleObjects =
      typeof lhs === 'object' &&
      typeof rhs === 'object' &&
      Array.isArray(lhs) === Array.isArray(rhs)
    if (
      lhs &&
      rhs &&
      areCompatibleObjects &&
      !richTypes[
        Object.getPrototypeOf(lhs)?.constructor?.name as keyof typeof richTypes
      ]
    ) {
      diffs.push.apply(
        diffs,
        diff(lhs, rhs).map((difference) => {
          difference.path.unshift(path)
          return difference
        }),
      )
    } else if (
      lhs !== rhs &&
      // treat NaN values as equivalent
      !(Number.isNaN(lhs) && Number.isNaN(rhs)) &&
      !(
        areCompatibleObjects &&
        (isNaN(lhs) ? lhs + '' === rhs + '' : +lhs === +rhs)
      )
    ) {
      diffs.push({ path: [path], kind: 'change', lhs, rhs })
    }
  }

  for (const key in right) {
    if (!(key in left)) {
      // @ts-ignore: it's fine
      const rhs = right[key]
      const path = [isRightArray ? +key : key]
      diffs.push({ kind: 'create', path, rhs })
    }
  }
  return diffs
}

// The walk in lcsDiff matches equal ends before it reads the table, and the
// LCS of two equal prefixes is the shorter one, so only the middle is stored.
function getLCSLength(a: Int32Array, b: Int32Array) {
  let prefix = 0
  while (prefix < a.length && prefix < b.length && a[prefix] === b[prefix]) {
    prefix++
  }
  let suffix = 0
  while (
    suffix < a.length - prefix &&
    suffix < b.length - prefix &&
    a[a.length - 1 - suffix] === b[b.length - 1 - suffix]
  ) {
    suffix++
  }
  const rows = a.length - prefix - suffix + 1
  const width = b.length - prefix - suffix + 1
  const table = new Int32Array(rows * width)
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < width; j++) {
      const at = i * width + j
      table[at] =
        a[prefix + i - 1] === b[prefix + j - 1]
          ? (table[at - width - 1] as number) + 1
          : Math.max(table[at - width] as number, table[at - 1] as number)
    }
  }
  return (i: number, j: number): number =>
    i <= prefix || j <= prefix
      ? Math.min(i, j)
      : prefix + (table[(i - prefix) * width + (j - prefix)] as number)
}

// Equal elements get equal ids so the table compares numbers. The
// fingerprint only narrows the candidates, isDeepStrictEqual still decides.
// Short lists skip it, scanning a few candidates is cheaper.
function toIds(lhs: unknown[], rhs: unknown[]): [Int32Array, Int32Array] {
  const candidates = new Map<unknown, { value: unknown; id: number }[]>()
  let count = 0
  const idOf = (value: unknown): number => {
    const key = lhs.length + rhs.length > 16 ? fingerprint(value) : 0
    const bucket = candidates.get(key) ?? []
    candidates.set(key, bucket)
    const found = bucket.find((c) => isDeepStrictEqual(c.value, value))
    if (found) {
      return found.id
    }
    bucket.push({ value, id: count })
    return count++
  }
  return [Int32Array.from(lhs, idOf), Int32Array.from(rhs, idOf)]
}

// Keys and primitives of the first few values in a fixed order, so deeply
// equal values always share a fingerprint.
function fingerprint(value: unknown): unknown {
  if (typeof value !== 'object' || value === null) {
    return value
  }
  let result = ''
  const work: unknown[] = [value]
  for (let step = 0; step < 16 && work.length > 0; step++) {
    const next = work.pop()
    if (typeof next !== 'object' || next === null) {
      result += `${typeof next}:${String(next)},`
      continue
    }
    const keys = Object.keys(next).sort()
    result += `{${keys.join(',')}}`
    for (const key of keys) {
      work.push((next as Record<string, unknown>)[key])
    }
  }
  return result
}

// NOTE(radomski): Based on - https://florian.github.io/diffing/
function lcsDiff<T, U>(lhs: T[], rhs: U[]): Difference[] {
  const out: Difference[] = []
  const [left, right] = toIds(lhs, rhs)
  const lcs = getLCSLength(left, right)

  let i = lhs.length
  let j = rhs.length

  while (i > 0 || j > 0) {
    const u = i - 1
    const v = j - 1
    if (i > 0 && j > 0 && left[u] === right[v]) {
      i--
      j--
      continue
    }

    if (i > 0 && j > 0 && lcs(u, v) >= lcs(u, j) && lcs(u, v) >= lcs(i, v)) {
      const nested = diff(lhs[u], rhs[v])

      if (nested.length) {
        // propagate nested paths
        nested.forEach((d) => d.path.unshift(u))
        out.push(...nested)
      } else {
        out.push({ kind: 'change', path: [u], lhs: lhs[u], rhs: rhs[v] })
      }

      i--
      j--
      continue
    }

    if (j > 0 && (i === 0 || lcs(i, v) >= lcs(u, j))) {
      out.push({ kind: 'create', path: [v], rhs: rhs[v] })
      j--
    } else {
      out.push({ kind: 'remove', path: [u], lhs: lhs[u] })
      i--
    }
  }

  return out.reverse()
}
