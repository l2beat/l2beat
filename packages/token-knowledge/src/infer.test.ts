import { expect } from 'earl'
import { infer } from './infer'

describe(infer.name, () => {
  it('returns empty knowledge base when given no facts', async () => {
    const kb = await infer('', '')
    expect(kb.facts).toEqual([])
  })

  it('runs rules on facts and returns inferred knowledge', async () => {
    const facts = [
      'transfer("ethereum","0xA0b8","base","0x833","hop","lockAndMint").',
      'transfer("base","0x833","zora","0xCcc","hop","lockAndMint").',
    ].join('\n')

    const rules = [
      'same_token(SC, ST, DC, DT) :- transfer(SC, ST, DC, DT, _, "lockAndMint").',
      'same_token(C1, T1, C3, T3) :- same_token(C1, T1, C2, T2), same_token(C2, T2, C3, T3).',
      'same_token(C2, T2, C1, T1) :- same_token(C1, T1, C2, T2).',
      '#show same_token/4.',
    ].join('\n')

    const kb = await infer(facts, rules)

    // Direct: ethereum->base, base->zora
    expect(kb.getFacts('same_token', ['ethereum', '0xA0b8', 'base', '0x833']).length).toEqual(1)
    expect(kb.getFacts('same_token', ['base', '0x833', 'zora', '0xCcc']).length).toEqual(1)

    // Transitive: ethereum->zora (via base)
    expect(kb.getFacts('same_token', ['ethereum', '0xA0b8', 'zora', '0xCcc']).length).toEqual(1)

    // Symmetric: base->ethereum
    expect(kb.getFacts('same_token', ['base', '0x833', 'ethereum', '0xA0b8']).length).toEqual(1)
  })

  it('does not infer same_token for non-canonical bridges', async () => {
    const facts =
      'transfer("ethereum","0xA0b8","base","0x833","hop","nonMinting").\n'

    const rules = [
      'same_token(SC, ST, DC, DT) :- transfer(SC, ST, DC, DT, _, "lockAndMint").',
      '#show same_token/4.',
    ].join('\n')

    const kb = await infer(facts, rules)
    expect(kb.facts).toEqual([])
  })
})
