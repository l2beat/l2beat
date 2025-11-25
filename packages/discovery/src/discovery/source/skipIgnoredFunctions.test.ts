import { expect } from 'earl'

import { skipIgnoredFunctions } from './skipIgnoredFunctions.js'

describe(skipIgnoredFunctions.name, () => {
  it('should return the same array if ignoreInWatchMode is undefined', () => {
    const abi = ['function foo()', 'function bar()']
    const result = skipIgnoredFunctions(abi)
    expect(result).toEqual(abi)
  })

  it('should return the same array if ignoreInWatchMode is empty', () => {
    const abi = ['function foo()', 'function bar()']
    const result = skipIgnoredFunctions(abi, [])
    expect(result).toEqual(abi)
  })

  it('should return the same array if ignoreInWatchMode does not match any function', () => {
    const abi = ['function foo()', 'function bar()']
    const result = skipIgnoredFunctions(abi, ['baz'])
    expect(result).toEqual(abi)
  })

  it('should return the filtered array if ignoreInWatchMode matches some functions', () => {
    const abi = ['function foo()', 'function bar()']
    const result = skipIgnoredFunctions(abi, ['foo'])
    expect(result).toEqual(['function bar()'])
  })
})
