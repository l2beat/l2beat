import { expect } from 'earl'
import { KnowledgeBase } from './KnowledgeBase'
import type { ClingoFact } from './parseClingoFact'

const transferToBase: ClingoFact = {
  atom: 'transfer',
  params: ['ethereum', '0xA0b8', 'base', '0x833', 'hop'],
}
const transferToArb: ClingoFact = {
  atom: 'transfer',
  params: ['ethereum', '0xA0b8', 'arbitrum', '0x1234', 'hop'],
}
const connected: ClingoFact = {
  atom: 'connected',
  params: ['ethereum', '0xA0b8', 'base', '0x833'],
}
const FACTS: ClingoFact[] = [transferToBase, transferToArb, connected]

describe(KnowledgeBase.name, () => {
  it('filters facts by atom name', () => {
    const kb = new KnowledgeBase(FACTS)
    expect(kb.getFacts('connected')).toEqual([connected])
  })

  it('filters facts by atom and partial params', () => {
    const kb = new KnowledgeBase(FACTS)
    const results = kb.getFacts('transfer', [undefined, undefined, 'base'])
    expect(results).toEqual([transferToBase])
  })

  it('getFact returns single match', () => {
    const kb = new KnowledgeBase(FACTS)
    expect(kb.getFact('connected', [undefined, undefined, 'base'])).toEqual(
      connected,
    )
  })

  it('getFact throws when no match', () => {
    const kb = new KnowledgeBase(FACTS)
    expect(() => kb.getFact('missing', [])).toThrow()
  })

  it('getFact throws when multiple matches', () => {
    const kb = new KnowledgeBase(FACTS)
    expect(() => kb.getFact('transfer', ['ethereum'])).toThrow()
  })
})
