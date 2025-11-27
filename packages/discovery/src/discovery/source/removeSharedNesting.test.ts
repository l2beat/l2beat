import { expect } from 'earl'

import { removeSharedNesting } from './removeSharedNesting.js'

describe(removeSharedNesting.name, () => {
  it('removes multiple common directories', () => {
    const entries: [string, string][] = [
      ['a/b/c/d.sol', '1'],
      ['a/b/e/f.sol', '2'],
      ['/a/b/g/h.sol', '3'],
      ['/a/b/x.sol', '4'],
    ]

    expect(removeSharedNesting(entries)).toEqual([
      ['c/d.sol', '1'],
      ['e/f.sol', '2'],
      ['g/h.sol', '3'],
      ['x.sol', '4'],
    ])
  })

  it('removes a single common directory', () => {
    const entries: [string, string][] = [
      ['a/b/c/d.sol', '1'],
      ['a/b/e/f.sol', '2'],
      ['/a/b/g/h.sol', '3'],
      ['/a/x/y.sol', '4'],
    ]

    expect(removeSharedNesting(entries)).toEqual([
      ['b/c/d.sol', '1'],
      ['b/e/f.sol', '2'],
      ['b/g/h.sol', '3'],
      ['x/y.sol', '4'],
    ])
  })

  it('removes no directories', () => {
    const entries: [string, string][] = [
      ['a/b/c/d.sol', '1'],
      ['a/b/e/f.sol', '2'],
      ['/a/b/g/h.sol', '3'],
      ['/a/x/y.sol', '4'],
      ['1/2/3.sol', '5'],
    ]

    expect(removeSharedNesting(entries)).toEqual([
      ['a/b/c/d.sol', '1'],
      ['a/b/e/f.sol', '2'],
      ['a/b/g/h.sol', '3'],
      ['a/x/y.sol', '4'],
      ['1/2/3.sol', '5'],
    ])
  })
})
