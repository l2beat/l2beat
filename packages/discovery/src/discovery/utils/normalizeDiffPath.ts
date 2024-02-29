import { assert } from '@l2beat/backend-tools'

const PREFIXES = ['values.', 'upgradeability.']

export function normalizeDiffPath(path: string): string {
  let pathWithoutPrefix = path

  for (const prefix of PREFIXES) {
    if (path.startsWith(prefix)) {
      pathWithoutPrefix = path.substring(prefix.length)
      break
    }
  }

  return removeArraySuffix(pathWithoutPrefix)
}

export function removeArraySuffix(path: string): string {
  if (path.includes('.')) {
    const [name, ...rest] = path.split('.')

    assert(rest.length === 1, `Expected ${path} to have only one suffix`)
    assert(
      name !== undefined && rest[0] !== undefined,
      `Unexpected undefined value`,
    )
    assert(isIntNumeric(rest[0]), `Expected ${rest[0]} to be a number`)
    return name
  }

  return path
}

export function isIntNumeric(str: string): boolean {
  const ZERO = '0'.charCodeAt(0)
  const NINE = '9'.charCodeAt(0)

  for (let i = 0; i < str.length; i++) {
    const z = str.charCodeAt(i)
    if (z < ZERO || z > NINE) {
      return false
    }
  }

  return true
}
