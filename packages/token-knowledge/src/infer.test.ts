import { expect } from 'earl'
import { infer } from './infer'

const ADDR_A = '0xabcdabcd12345678abcdabcd12345678abcdabcd'
const ADDR_B = '0x33d66941465ac776c38096cb1bc496c673ae7390'
const ADDR_C = '0xccccccccccccccccccccccccccccccccccccccc1'

describe(infer.name, () => {
  it('returns empty knowledge base when given no facts', async () => {
    const kb = await infer('', '')
    expect(kb.facts).toEqual([])
  })

  it('runs rules on facts and returns inferred knowledge', async () => {
    const facts = [
      `transfer("ethereum","${ADDR_A}","base","${ADDR_B}",hop,lockAndMint).`,
      `transfer("base","${ADDR_B}","zora","${ADDR_C}",hop,lockAndMint).`,
    ].join('\n')

    const rules = [
      'same_token(SC, SA, DC, DA) :- transfer(SC, SA, DC, DA, _, lockAndMint).',
      'same_token(C1, T1, C3, T3) :- same_token(C1, T1, C2, T2), same_token(C2, T2, C3, T3).',
      'same_token(C2, T2, C1, T1) :- same_token(C1, T1, C2, T2).',
      '#show same_token/4.',
    ].join('\n')

    const kb = await infer(facts, rules)

    // Direct: ethereum->base, base->zora
    expect(
      kb.getFacts('same_token', ['ethereum', ADDR_A, 'base', ADDR_B]).length,
    ).toEqual(1)
    expect(
      kb.getFacts('same_token', ['base', ADDR_B, 'zora', ADDR_C]).length,
    ).toEqual(1)

    // Transitive: ethereum->zora (via base)
    expect(
      kb.getFacts('same_token', ['ethereum', ADDR_A, 'zora', ADDR_C]).length,
    ).toEqual(1)

    // Symmetric: base->ethereum
    expect(
      kb.getFacts('same_token', ['base', ADDR_B, 'ethereum', ADDR_A]).length,
    ).toEqual(1)
  })

  it('does not infer same_token for non-canonical bridges', async () => {
    const facts = `transfer("ethereum","${ADDR_A}","base","${ADDR_B}",hop,nonMinting).\n`

    const rules = [
      'same_token(SC, SA, DC, DA) :- transfer(SC, SA, DC, DA, _, lockAndMint).',
      '#show same_token/4.',
    ].join('\n')

    const kb = await infer(facts, rules)
    expect(kb.facts).toEqual([])
  })
})
