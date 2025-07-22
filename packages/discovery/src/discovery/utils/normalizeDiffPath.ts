import { assert } from '@l2beat/shared-pure'

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

    assert(rest.length >= 1, 'Unreachable code')
    assert(name !== undefined, 'Unexpected undefined value')

    if (!rest.every((p) => p.length > 0 && isIntNumeric(p))) {
      return path
    }
    return name
  }

  return path
}

function isIntNumeric(str: string): boolean {
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
