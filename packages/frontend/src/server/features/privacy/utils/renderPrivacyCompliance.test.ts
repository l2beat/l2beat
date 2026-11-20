import { expect } from 'earl'
import { renderPrivacyCompliance } from './renderPrivacyCompliance'

describe(renderPrivacyCompliance.name, () => {
  it('opens each part with its facts and continues with its prose', () => {
    const markdown = renderPrivacyCompliance({
      tradeoff: 'Relayers screen recipients.',
      gatekeeper: {
        type: 'relayer',
        detail: 'while the contracts enforce no list',
      },
      rules: { type: 'closed', detail: 'Each relayer checks recipients.' },
      timing: { type: 'entry', detail: 'Later sends carry the proof.' },
      consequence: {
        type: 'access',
        detail: 'The user submits it themselves.',
      },
      cleanOrigin: { type: 'proof', detail: 'Every spend carries one.' },
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
        '- **Rules:** closed. Each relayer checks recipients.',
        '- **Timing:** once at entry, then final. Later sends carry the proof.',
        '- **Consequence:** loss of access. The user submits it themselves.',
        '',
        'Relayers check a list.',
        '',
        '### Access to private data',
        '',
        '**Nobody.**',
        '',
        '### Proof of clean origin',
        '',
        '**A proof against a list.** Every spend carries one.',
        '',
        'Anyone can verify it.',
      ].join('\n'),
    )
  })

  it('leaves out what a project without a gatekeeper or funds has no answer to', () => {
    const markdown = renderPrivacyCompliance({
      tradeoff: 'Nothing is checked.',
      gatekeeper: { type: 'none' },
      rules: { type: 'none', detail: 'The contracts check no list.' },
      dataAccess: 'the committee, which can decrypt every ballot',
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
        '### Access to private data',
        '',
        '**The committee, which can decrypt every ballot.**',
      ].join('\n'),
    )
  })
})
