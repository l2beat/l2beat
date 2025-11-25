import { expect } from 'earl'

import { normalizeDiffPath, removeArraySuffix } from './normalizeDiffPath.js'

describe(normalizeDiffPath.name, () => {
  it('should remove values. prefix', () => {
    expect(normalizeDiffPath('values.test')).toEqual('test')
  })

  it('should remove upgradeability. prefix', () => {
    expect(normalizeDiffPath('upgradeability.test')).toEqual('test')
  })

  it('should do nothing if no prefix', () => {
    expect(normalizeDiffPath('test')).toEqual('test')
  })

  it('remove array suffix and prefixes', () => {
    expect(normalizeDiffPath('values.test.0')).toEqual('test')
    expect(normalizeDiffPath('values.test.1')).toEqual('test')
    expect(normalizeDiffPath('values.test.12')).toEqual('test')
    expect(normalizeDiffPath('values.test.01')).toEqual('test')
    expect(normalizeDiffPath('values.test.21')).toEqual('test')
    expect(normalizeDiffPath('values.test.0.1')).toEqual('test')
    expect(normalizeDiffPath('values.test.2.1.0')).toEqual('test')

    expect(normalizeDiffPath('upgradeability.test.0')).toEqual('test')
    expect(normalizeDiffPath('upgradeability.test.1')).toEqual('test')
    expect(normalizeDiffPath('upgradeability.test.12')).toEqual('test')
    expect(normalizeDiffPath('upgradeability.test.01')).toEqual('test')
    expect(normalizeDiffPath('upgradeability.test.21')).toEqual('test')
    expect(normalizeDiffPath('upgradeability.test.0.1')).toEqual('test')
    expect(normalizeDiffPath('upgradeability.test.2.1.0')).toEqual('test')
  })

  it('remove array suffix when no values. prefix', () => {
    expect(normalizeDiffPath('test.0')).toEqual('test')
    expect(normalizeDiffPath('test.1')).toEqual('test')
    expect(normalizeDiffPath('test.12')).toEqual('test')
    expect(normalizeDiffPath('test.01')).toEqual('test')
    expect(normalizeDiffPath('test.21')).toEqual('test')
  })

  it('should throw on different prefix', () => {
    expect(normalizeDiffPath('test.values.0')).toEqual('test.values.0')
  })
})

describe(removeArraySuffix.name, () => {
  it('remove single array suffix', () => {
    expect(removeArraySuffix('test.0')).toEqual('test')
    expect(removeArraySuffix('test.1')).toEqual('test')
    expect(removeArraySuffix('test.12')).toEqual('test')
    expect(removeArraySuffix('test.01')).toEqual('test')
    expect(removeArraySuffix('test.21')).toEqual('test')
  })

  it('remove multiple array suffixes', () => {
    expect(removeArraySuffix('test.0.0')).toEqual('test')
    expect(removeArraySuffix('test.0.6')).toEqual('test')
    expect(removeArraySuffix('test.0.6.0')).toEqual('test')
    expect(removeArraySuffix('test.1.2.3.4.5.6.7')).toEqual('test')
  })

  it('should return the input if it does not contain a suffix', () => {
    expect(removeArraySuffix('test')).toEqual('test')
  })

  it('should throw if the suffix is not a decimal number', () => {
    expect(removeArraySuffix('test.a')).toEqual('test.a')
    expect(removeArraySuffix('test.1a')).toEqual('test.1a')
    expect(removeArraySuffix('test.1e2')).toEqual('test.1e2')
    expect(removeArraySuffix('test.0.')).toEqual('test.0.')
  })
})
