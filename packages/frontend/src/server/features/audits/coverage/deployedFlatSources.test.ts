import { expect } from 'earl'
import {
  indexFlatSources,
  sha256,
  stripFlatHeader,
} from './deployedFlatSources'

describe('deployedFlatSources', () => {
  const body = 'contract A {}\n'
  const withHeader = `// SPDX-License-Identifier: Unknown\npragma solidity 0.8.20;\n\n${body}`

  it('strips the header discovery prepends and nothing else', () => {
    expect(stripFlatHeader(withHeader)).toEqual(body)
    expect(stripFlatHeader(body)).toEqual(body)
  })

  it('indexes the stripped sources by their sha256', () => {
    const index = indexFlatSources({ 'A.sol': withHeader, 'B.sol': 'x' })
    expect(index.get(sha256(body))).toEqual(body)
    expect(index.get(sha256('x'))).toEqual('x')
    expect(index.size).toEqual(2)
  })
})
