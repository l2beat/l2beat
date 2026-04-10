import { expect } from 'earl'
import { parseClingoFact } from './parseClingoFact'

describe(parseClingoFact.name, () => {
  it('parses a simple fact with atom params', () => {
    expect(parseClingoFact('transfer(ethereum,base,hop)')).toEqual({
      atom: 'transfer',
      params: ['ethereum', 'base', 'hop'],
    })
  })

  it('parses a fact with string params', () => {
    expect(parseClingoFact('token("0xA0b8","USDC")')).toEqual({
      atom: 'token',
      params: ['0xA0b8', 'USDC'],
    })
  })

  it('parses a fact with numeric params', () => {
    expect(parseClingoFact('amount(42,-3.14)')).toEqual({
      atom: 'amount',
      params: [42, -3.14],
    })
  })

  it('parses nested facts', () => {
    expect(parseClingoFact('outer(inner(a,b),c)')).toEqual({
      atom: 'outer',
      params: [{ atom: 'inner', params: ['a', 'b'] }, 'c'],
    })
  })

  it('parses a fact with no params', () => {
    expect(parseClingoFact('empty()')).toEqual({
      atom: 'empty',
      params: [],
    })
  })

  it('throws on invalid input', () => {
    expect(() => parseClingoFact('123')).toThrow()
    expect(() => parseClingoFact('foo')).toThrow()
  })
})
