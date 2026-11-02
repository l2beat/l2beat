import { expect } from 'earl'
import type { GlossaryTerm } from '~/components/markdown/GlossaryContext'
import { linkGlossaryTerms } from '~/utils/markdown/glossaryPlugin'
import { getClientGlossaryTerms } from './getClientGlossaryTerms'

// Why: the client links markdown from page data with only the shipped terms,
// so a missing term silently drops a glossary link (and breaks hydration),
// while an extra one only costs bytes.
// How: link every string with the shipped subset and with the whole glossary
// and require the same output, then check that unmentioned terms are dropped.
describe(getClientGlossaryTerms.name, () => {
  const glossary: GlossaryTerm[] = [
    { id: 'rollup', matches: ['Rollup', 'rollups'], description: 'R' },
    { id: 'zk-rollup', matches: ['ZK-Rollup'], description: 'ZKR' },
    { id: 'ab', matches: ['alpha beta'], description: 'AB' },
    { id: 'bcd', matches: ['beta gamma delta'], description: 'BCD' },
    { id: 'dac', matches: ['(DAC)'], description: 'DAC' },
    { id: 'l2', matches: ['L2'], description: 'L2' },
    { id: 'unused', matches: ['validium'], description: 'V' },
  ]

  const pageData = {
    title: 'ROLLUPS everywhere',
    nested: [
      { description: 'A Zk-ROLLUP, unlike L2s, says Alpha Beta gamma delta.' },
    ],
    committee: 'Run by a committee (DAC).',
    numbers: [1, null, true],
  }

  it('links every string in the page data like the whole glossary does', () => {
    const shipped = getClientGlossaryTerms(glossary, new Set(), pageData)
    const linkWithShipped = linkGlossaryTerms(shipped)
    const linkWithAll = linkGlossaryTerms(glossary)

    for (const text of [
      pageData.title,
      pageData.nested[0]!.description,
      pageData.committee,
    ]) {
      expect(linkWithShipped(text)).toEqual(linkWithAll(text))
    }
  })

  it('ships only the terms the page mentions or the server linked', () => {
    const shipped = getClientGlossaryTerms(
      glossary,
      new Set(['unused']),
      pageData,
    )

    // `l2` stays out: the page says "L2s", which is not a whole-word match.
    expect(shipped.map((term) => term.id)).toEqual([
      'rollup',
      'zk-rollup',
      'ab',
      'bcd',
      'dac',
      'unused',
    ])
  })
})
