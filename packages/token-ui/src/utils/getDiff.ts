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

function isDeepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true

  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false

  if (Array.isArray(a) !== Array.isArray(b)) return false

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) return false

  return keysA.every((key) => {
    // @ts-ignore: it's fine
    return keysB.includes(key) && isDeepEqual(a[key], b[key])
  })
}

// This is a copy of the diff function from the @l2beat/discovery package.
// We need to share the code between the two packages to avoid duplication.
// I did it this way to avoid wasting time related with moving the code.
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

function getLCSLength<T, U>(a: T[], b: U[]): number[][] {
  const lcs: number[][] = []
  for (let i = 0; i < a.length + 1; i++) {
    lcs[i] = []
    for (let j = 0; j < b.length + 1; j++) {
      if (i === 0 || j === 0) {
        lcs[i]?.push(0)
      } else if (isDeepEqual(a[i - 1], b[j - 1])) {
        // biome-ignore lint/style/noNonNullAssertion: it's there
        lcs[i]?.push(1 + lcs[i - 1]![j - 1]!)
      } else {
        // biome-ignore lint/style/noNonNullAssertion: it's there
        lcs[i]?.push(Math.max(lcs[i - 1]![j]!, lcs[i]![j - 1]!))
      }
    }
  }
  return lcs
}

// NOTE(radomski): Based on - https://florian.github.io/diffing/
function lcsDiff<T, U>(lhs: T[], rhs: U[]): Difference[] {
  const out: Difference[] = []
  const lcs = getLCSLength(lhs, rhs)

  let i = lhs.length
  let j = rhs.length

  while (i > 0 || j > 0) {
    const u = i - 1
    const v = j - 1
    if (i > 0 && j > 0 && isDeepEqual(lhs[u], rhs[v])) {
      i--
      j--
      continue
    }

    if (
      i > 0 &&
      j > 0 &&
      // biome-ignore lint/style/noNonNullAssertion: We know it's there
      lcs[u]![v]! >= lcs[u]![j]! &&
      // biome-ignore lint/style/noNonNullAssertion: We know it's there
      lcs[u]![v]! >= lcs[i]![v]!
    ) {
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

    // biome-ignore lint/style/noNonNullAssertion: We know it's fine
    if (j > 0 && (i === 0 || lcs[i]![v]! >= lcs[u]![j]!)) {
      out.push({ kind: 'create', path: [v], rhs: rhs[v] })
      j--
    } else {
      out.push({ kind: 'remove', path: [u], lhs: lhs[u] })
      i--
    }
  }

  return out.reverse()
}
