import { expect } from 'earl'
import { renderPrivacyCompliance } from './renderPrivacyCompliance'

describe(renderPrivacyCompliance.name, () => {
  it('opens each part with its facts and continues with its prose', () => {
    const markdown = renderPrivacyCompliance({
      short: 'Relayers screen recipients.',
      enforcedBy: 'relayer',
      enforcedByNote: 'while the contracts enforce no list',
      check: { rules: 'closed', detail: 'Recipients, by each relayer.' },
      when: 'entry',
      whenNote: 'Later sends carry the proof.',
      cost: { loses: 'access', detail: 'The user submits it themselves.' },
      cleanOrigin: { tool: 'proof', detail: 'Every spend carries one.' },
      content:
        '### Enforcement\n\nRelayers check a list.\n\n### Proof of clean origin\n\nAnyone can verify it.',
    })

    expect(markdown).toEqual(
      [
        'Relayers screen recipients.',
        '',
        '### Enforcement',
        '',
        '- **Gatekeeper:** relayers, while the contracts enforce no list.',
        '- **Rules:** closed. Recipients, by each relayer.',
        '- **Timing:** once at entry, then final. Later sends carry the proof.',
        '- **Consequence:** loss of access. The user submits it themselves.',
        '',
        'Relayers check a list.',
        '',
        '### Data access',
        '',
        '**Nobody.**',
        '',
        '### Proof of clean origin',
        '',
        '**A proof that reveals nothing else.** Every spend carries one.',
        '',
        'Anyone can verify it.',
      ].join('\n'),
    )
  })

  it('leaves out what a project without a gatekeeper or funds has no answer to', () => {
    const markdown = renderPrivacyCompliance({
      short: 'Nothing is checked.',
      enforcedBy: 'none',
      check: { rules: 'none', detail: 'The contracts check no list.' },
      disclosure: 'the committee, which can decrypt every ballot',
      content: '',
    })

    expect(markdown).toEqual(
      [
        'Nothing is checked.',
        '',
        '### Enforcement',
        '',
        '- **Gatekeeper:** nobody.',
        '- **Rules:** none. The contracts check no list.',
        '',
        '### Data access',
        '',
        '**The committee, which can decrypt every ballot.**',
      ].join('\n'),
    )
  })
})
