import { expect } from 'earl'
import type { PrivacyCompliancePower } from '../types'
import { definePrivacyCompliance } from './privacyCompliance'

const SOURCE = { title: 'Docs', url: 'https://example.com' }

function power(
  ladder: PrivacyCompliancePower['ladder'],
  rung: PrivacyCompliancePower['rung'],
  extra: Partial<PrivacyCompliancePower> = {},
): PrivacyCompliancePower {
  return {
    ladder,
    rung,
    text: `${ladder} ${rung}.`,
    sources: [SOURCE],
    ...extra,
  }
}

function met(compliance: ReturnType<typeof definePrivacyCompliance>) {
  return compliance.requirements.filter((r) => r.met).map((r) => r.id)
}

describe(definePrivacyCompliance.name, () => {
  it('shows the worst power on each ladder', () => {
    const compliance = definePrivacyCompliance({
      description: '',
      powers: [power('privacy', 2), power('privacy', 5), power('funds', 3)],
    })
    const [privacy, funds] = compliance.ladders
    expect(privacy.id).toEqual('privacy')
    expect(privacy.rung).toEqual(5)
    expect(privacy.sentiment).toEqual('bad')
    expect(privacy.power?.text).toEqual('privacy 5.')
    expect(funds.rung).toEqual(3)
    expect(funds.sentiment).toEqual('warning')
  })

  it('puts a ladder without powers on rung 1', () => {
    const compliance = definePrivacyCompliance({ description: '', powers: [] })
    for (const ladder of compliance.ladders) {
      expect(ladder.rung).toEqual(1)
      expect(ladder.sentiment).toEqual('good')
      expect(ladder.power).toEqual(undefined)
    }
    expect(met(compliance)).toEqual([])
  })

  it('turns a logged lens red when it reaches past history', () => {
    const logged = definePrivacyCompliance({
      description: '',
      powers: [power('privacy', 4)],
    })
    const reaching = definePrivacyCompliance({
      description: '',
      powers: [power('privacy', 4, { reachesPastHistory: true })],
    })
    expect(logged.ladders[0].sentiment).toEqual('warning')
    expect(reaching.ladders[0].sentiment).toEqual('bad')
  })

  it('derives the requirements from every power, not only the worst', () => {
    const compliance = definePrivacyCompliance({
      description: '',
      powers: [power('privacy', 2), power('privacy', 5), power('funds', 5)],
      disclosure: {
        level: 1,
        text: 'A tool.',
        verifiableWithoutOperator: true,
        singleVerifier: true,
        sources: [SOURCE],
      },
      curatedList: true,
    })
    expect(met(compliance)).toEqual([
      'entryScreening',
      'freeze',
      'seizure',
      'authorityView',
      'userProof',
      'curatedList',
    ])
  })

  it('rejects a rung 1 power next to another power on its ladder', () => {
    expect(() =>
      definePrivacyCompliance({
        description: '',
        powers: [power('funds', 1), power('funds', 4)],
      }),
    ).toThrow()
  })
})
