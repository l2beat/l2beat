import { expect } from 'earl'
import type { ClingoFact } from './clingo/parseClingoFact'
import { infer } from './infer'

const ADDR_A = '0xabcdabcd12345678abcdabcd12345678abcdabcd'
const ADDR_B = '0x33d66941465ac776c38096cb1bc496c673ae7390'
const ADDR_C = '0xccccccccccccccccccccccccccccccccccccccc1'

const t = (chain: string, addr: string): ClingoFact => ({
  atom: 't',
  params: [chain, addr],
})

describe(infer.name, () => {
  it('returns empty array when given no facts', async () => {
    const facts = await infer('', '')
    expect(facts).toEqual([])
  })

  it('runs rules on facts and returns inferred knowledge', async () => {
    const factsProgram = [
      `transfer(t("ethereum","${ADDR_A}"),t("base","${ADDR_B}"),hop,lockAndMint).`,
      `transfer(t("base","${ADDR_B}"),t("zora","${ADDR_C}"),hop,lockAndMint).`,
    ].join('\n')

    const rules = [
      'same_token(T1, T2) :- transfer(T1, T2, _, lockAndMint).',
      'same_token(T1, T3) :- T1 != T3, same_token(T1, T2), same_token(T2, T3).',
      'same_token(T2, T1) :- same_token(T1, T2).',
      '#show same_token/2.',
    ].join('\n')

    const facts = await infer(factsProgram, rules)

    const has = (t1: ClingoFact, t2: ClingoFact) =>
      facts.some(
        (f) =>
          f.atom === 'same_token' &&
          JSON.stringify(f.params) === JSON.stringify([t1, t2]),
      )

    // Direct: ethereum->base, base->zora
    expect(has(t('ethereum', ADDR_A), t('base', ADDR_B))).toEqual(true)
    expect(has(t('base', ADDR_B), t('zora', ADDR_C))).toEqual(true)

    // Transitive: ethereum->zora (via base)
    expect(has(t('ethereum', ADDR_A), t('zora', ADDR_C))).toEqual(true)

    // Symmetric: base->ethereum
    expect(has(t('base', ADDR_B), t('ethereum', ADDR_A))).toEqual(true)
  })

  it('does not infer same_token for non-canonical bridges', async () => {
    const factsProgram = `transfer(t("ethereum","${ADDR_A}"),t("base","${ADDR_B}"),hop,nonMinting).\n`

    const rules = [
      'same_token(T1, T2) :- transfer(T1, T2, _, lockAndMint).',
      '#show same_token/2.',
    ].join('\n')

    const facts = await infer(factsProgram, rules)
    expect(facts).toEqual([])
  })
})
