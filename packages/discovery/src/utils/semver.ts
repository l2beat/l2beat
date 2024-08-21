import { assert } from '@l2beat/shared-pure'

export interface Semver {
  major: number
  minor: number
  patch: number
}

export function parseSemver(version: string): Semver {
  const numbers = version.split('.').map(Number)

  assert(numbers.length === 3, 'Invalid semantic version string')
  assert(
    numbers.every((n) => !isNaN(n)),
    'Invalid semantic version string',
  )

  const [major, minor, patch] = numbers
  assert(major !== undefined, 'Failed to parse major version')
  assert(minor !== undefined, 'Failed to parse minor version')
  assert(patch !== undefined, 'Failed to parse patch version')

  return { major, minor, patch }
}
