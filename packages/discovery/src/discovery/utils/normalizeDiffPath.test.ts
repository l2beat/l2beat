import { describe, expect, it } from 'vitest'

import { normalizeDiffPath, removeArraySuffix } from './normalizeDiffPath'

describe(normalizeDiffPath.name, () => {
  it('should remove values. prefix', () => {
    expect(normalizeDiffPath('values.test')).toBe('test')
  })

  it('should remove upgradeability. prefix', () => {
    expect(normalizeDiffPath('upgradeability.test')).toBe('test')
  })

  it('should do nothing if no prefix', () => {
    expect(normalizeDiffPath('test')).toBe('test')
  })

  it('remove array suffix and prefixes', () => {
    expect(normalizeDiffPath('values.test.0')).toBe('test')
    expect(normalizeDiffPath('values.test.1')).toBe('test')
    expect(normalizeDiffPath('values.test.12')).toBe('test')
    expect(normalizeDiffPath('values.test.01')).toBe('test')
    expect(normalizeDiffPath('values.test.21')).toBe('test')
    expect(normalizeDiffPath('values.test.0.1')).toBe('test')
    expect(normalizeDiffPath('values.test.2.1.0')).toBe('test')

    expect(normalizeDiffPath('upgradeability.test.0')).toBe('test')
    expect(normalizeDiffPath('upgradeability.test.1')).toBe('test')
    expect(normalizeDiffPath('upgradeability.test.12')).toBe('test')
    expect(normalizeDiffPath('upgradeability.test.01')).toBe('test')
    expect(normalizeDiffPath('upgradeability.test.21')).toBe('test')
    expect(normalizeDiffPath('upgradeability.test.0.1')).toBe('test')
    expect(normalizeDiffPath('upgradeability.test.2.1.0')).toBe('test')
  })

  it('remove array suffix when no values. prefix', () => {
    expect(normalizeDiffPath('test.0')).toBe('test')
    expect(normalizeDiffPath('test.1')).toBe('test')
    expect(normalizeDiffPath('test.12')).toBe('test')
    expect(normalizeDiffPath('test.01')).toBe('test')
    expect(normalizeDiffPath('test.21')).toBe('test')
  })

  it('should throw on different prefix', () => {
    expect(normalizeDiffPath('test.values.0')).toBe('test.values.0')
  })
})

describe(removeArraySuffix.name, () => {
  it('remove single array suffix', () => {
    expect(removeArraySuffix('test.0')).toBe('test')
    expect(removeArraySuffix('test.1')).toBe('test')
    expect(removeArraySuffix('test.12')).toBe('test')
    expect(removeArraySuffix('test.01')).toBe('test')
    expect(removeArraySuffix('test.21')).toBe('test')
  })

  it('remove multiple array suffixes', () => {
    expect(removeArraySuffix('test.0.0')).toBe('test')
    expect(removeArraySuffix('test.0.6')).toBe('test')
    expect(removeArraySuffix('test.0.6.0')).toBe('test')
    expect(removeArraySuffix('test.1.2.3.4.5.6.7')).toBe('test')
  })

  it('should return the input if it does not contain a suffix', () => {
    expect(removeArraySuffix('test')).toBe('test')
  })

  it('should throw if the suffix is not a decimal number', () => {
    expect(removeArraySuffix('test.a')).toBe('test.a')
    expect(removeArraySuffix('test.1a')).toBe('test.1a')
    expect(removeArraySuffix('test.1e2')).toBe('test.1e2')
    expect(removeArraySuffix('test.0.')).toBe('test.0.')
  })
})
