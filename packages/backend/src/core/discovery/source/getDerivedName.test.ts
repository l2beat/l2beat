import { expect } from 'earl'

import { getDerivedName } from './getDerivedName'

describe(getDerivedName.name, () => {
  it('returns unknown when given no names', () => {
    const result = getDerivedName([])
    expect(result).toEqual('Unknown')
  })

  it('returns the name when given one name', () => {
    const result = getDerivedName(['Escrow'])
    expect(result).toEqual('Escrow')
  })

  it('returns combined names when given two names', () => {
    const result = getDerivedName(['Proxy', 'Escrow'])
    expect(result).toEqual('Escrow (Proxy)')
  })

  it('handles empty names', () => {
    const result = getDerivedName(['', 'Escrow'])
    expect(result).toEqual('Escrow (Unknown)')
  })

  it('returns implementation count when given more names', () => {
    const result = getDerivedName(['Proxy', 'Facet A', 'Facet B'])
    expect(result).toEqual('Proxy (2 implementations)')
  })
})
