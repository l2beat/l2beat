import { expect } from 'earl'
import { findMainDeclarationOffset } from './declarations'

describe(findMainDeclarationOffset.name, () => {
  it('points at the last named declaration', () => {
    expect(
      findMainDeclarationOffset([
        { name: null, content: 'pragma solidity 0.8.0;\n\n' },
        { name: 'L', content: 'library L {}' },
        { name: null, content: '\n\n' },
        { name: 'Main', content: '/// @title Main\ncontract Main {}' },
        { name: null, content: '\n' },
      ]),
    ).toEqual(38)
  })

  it('finds nothing in a source without declarations', () => {
    expect(
      findMainDeclarationOffset([{ name: null, content: 'not solidity' }]),
    ).toEqual(undefined)
  })
})
