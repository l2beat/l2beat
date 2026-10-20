import { expect } from 'earl'
import { FlatCompileError, takeExactPragma } from './solc'

describe(takeExactPragma.name, () => {
  it('reads versions the flattener writes without the leading zero', () => {
    const text = 'pragma solidity .8.16;\ncontract A {}\n'
    const { version, source } = takeExactPragma(text)

    expect(version).toEqual('0.8.16')
    expect(source.length).toEqual(text.length)
    expect(source.indexOf('contract A')).toEqual(text.indexOf('contract A'))
  })

  it('restores the dropped ABI encoder pragma after everything else', () => {
    const text = 'pragma solidity 0.6.11;\ncontract A {}\n'
    const { source } = takeExactPragma(text)

    expect(source.startsWith(`//${text.slice(2)}`)).toEqual(true)
    expect(source.endsWith('pragma experimental ABIEncoderV2;\n')).toEqual(true)
  })

  it('leaves the encoder alone when the flat already picks one', () => {
    const text =
      'pragma solidity 0.7.6;\npragma experimental ABIEncoderV2;\ncontract A {}\n'

    expect(takeExactPragma(text).source.length).toEqual(text.length)
  })

  it('reports flats it cannot place as compile failures', () => {
    expect(() => takeExactPragma('pragma solidity ^0.8.0;\n')).toThrow(
      FlatCompileError,
    )
    expect(() => takeExactPragma('contract A {}\n')).toThrow(FlatCompileError)
  })
})
