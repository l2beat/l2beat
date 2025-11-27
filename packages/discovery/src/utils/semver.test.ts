import { expect } from 'earl'

import { parseSemver } from './semver.js'

describe(parseSemver.name, () => {
  it('should parse a version', () => {
    expect(parseSemver('1.2.3')).toEqual({ major: 1, minor: 2, patch: 3 })
    expect(parseSemver('0.0.0')).toEqual({ major: 0, minor: 0, patch: 0 })
    expect(parseSemver('1.0.0')).toEqual({ major: 1, minor: 0, patch: 0 })
    expect(parseSemver('0.1.0')).toEqual({ major: 0, minor: 1, patch: 0 })
    expect(parseSemver('0.0.1')).toEqual({ major: 0, minor: 0, patch: 1 })
    expect(parseSemver('999.999.999')).toEqual({
      major: 999,
      minor: 999,
      patch: 999,
    })
  })

  it('should throw on invalid characters in the version string', () => {
    expect(() => parseSemver('1.2.3!')).toThrow()
  })

  it('should handle leading zeros in the version string', () => {
    expect(parseSemver('1.02.03')).toEqual({ major: 1, minor: 2, patch: 3 })
    expect(parseSemver('01.02.03')).toEqual({ major: 1, minor: 2, patch: 3 })
  })

  it('throws on invalid semantic version string', () => {
    expect(() => parseSemver('1.2')).toThrow()
    expect(() => parseSemver('1.a.3')).toThrow()
    expect(() => parseSemver('1.2.3.4')).toThrow()
    expect(() => parseSemver('')).toThrow()
  })
})
