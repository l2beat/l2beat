import { expect } from 'earl'
import { getCollection } from '~/content/getCollection'
import { getGlossaryStructuredData } from './getGlossaryStructuredData'

// Runs against the real glossary content so the test also guards what ships.
describe(getGlossaryStructuredData.name, () => {
  const entries = getCollection('glossary')
  const termSet = getGlossaryStructuredData(entries)

  it('is a DefinedTermSet naming the glossary page', () => {
    expect(termSet).toEqual(
      expect.subset({
        '@context': 'https://schema.org',
        '@type': 'DefinedTermSet',
        '@id': 'https://l2beat.com/glossary',
        name: 'L2BEAT Glossary',
        url: 'https://l2beat.com/glossary',
      }),
    )
    expect(termSet.hasDefinedTerm.length).toEqual(entries.length)
  })

  it('describes each entry as a DefinedTerm linking to its anchor', () => {
    const air = termSet.hasDefinedTerm.find((term) => term.url.endsWith('#air'))

    expect(air).toEqual({
      '@type': 'DefinedTerm',
      name: 'Algebraic intermediate representation',
      alternateName: ['AIR'],
      description:
        'Algebraic intermediate representation (AIR) is a type of arithmetization commonly used in zkVMs. It represents a trace of zkVM state transitions with low degree polynomial constraints that enforce the correct relation between previous and current states of the computation. Several variations of AIR are used in practice, with slight differences among them.',
      url: 'https://l2beat.com/glossary#air',
      inDefinedTermSet: 'https://l2beat.com/glossary',
    })
  })
})
