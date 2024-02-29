import { expect } from 'earl'

import { normalizeDiffPath, removeArraySuffix } from './normalizeDiffPath'

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

  it('should remove array suffix and values.prefix', () => {
    expect(normalizeDiffPath('values.test.0')).toEqual('test')
    expect(normalizeDiffPath('values.test.1')).toEqual('test')
    expect(normalizeDiffPath('values.test.12')).toEqual('test')
    expect(normalizeDiffPath('values.test.01')).toEqual('test')
    expect(normalizeDiffPath('values.test.21')).toEqual('test')

    expect(normalizeDiffPath('upgradeability.test.0')).toEqual('test')
    expect(normalizeDiffPath('upgradeability.test.1')).toEqual('test')
    expect(normalizeDiffPath('upgradeability.test.12')).toEqual('test')
    expect(normalizeDiffPath('upgradeability.test.01')).toEqual('test')
    expect(normalizeDiffPath('upgradeability.test.21')).toEqual('test')
  })

  it('should remove array suffix when no values. prefix', () => {
    expect(normalizeDiffPath('test.0')).toEqual('test')
    expect(normalizeDiffPath('test.1')).toEqual('test')
    expect(normalizeDiffPath('test.12')).toEqual('test')
    expect(normalizeDiffPath('test.01')).toEqual('test')
    expect(normalizeDiffPath('test.21')).toEqual('test')
  })

  it('should throw on different prefix', () => {
    expect(() => normalizeDiffPath('test.values.0')).toThrow(
      'Expected test.values.0 to have only one suffix',
    )
  })
})

describe(removeArraySuffix.name, () => {
  it('should remove the array suffix', () => {
    expect(removeArraySuffix('test.0')).toEqual('test')
    expect(removeArraySuffix('test.1')).toEqual('test')
    expect(removeArraySuffix('test.12')).toEqual('test')
    expect(removeArraySuffix('test.01')).toEqual('test')
    expect(removeArraySuffix('test.21')).toEqual('test')
  })

  it('should return the input if it does not contain a suffix', () => {
    expect(removeArraySuffix('test')).toEqual('test')
  })

  it('should throw if the suffix is not a decimal number', () => {
    expect(() => removeArraySuffix('test.a')).toThrow(
      'Expected a to be a number',
    )
    expect(() => removeArraySuffix('test.1a')).toThrow(
      'Expected 1a to be a number',
    )
    expect(() => removeArraySuffix('test.1e2')).toThrow(
      'Expected 1e2 to be a number',
    )
  })

  it('should throw if the input has more than one suffix', () => {
    expect(() => removeArraySuffix('test.1.2')).toThrow(
      'Expected test.1.2 to have only one suffix',
    )
  })
})
