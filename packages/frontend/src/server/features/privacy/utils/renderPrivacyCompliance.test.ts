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
      voluntaryDisclosure: {
        type: 'key',
        detail: 'The wallet exports one.',
      },
      content:
        '### Enforcement\n\nRelayers check a list.\n\n### Voluntary disclosure\n\nIt cannot be revoked.',
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
        '### Voluntary disclosure',
        '',
        '**The whole history, by viewing key.** The wallet exports one.',
        '',
        'It cannot be revoked.',
      ].join('\n'),
    )
  })

  it('leaves out timing and consequence without a gatekeeper', () => {
    const markdown = renderPrivacyCompliance({
      tradeoff: 'Nothing is checked.',
      gatekeeper: { type: 'none' },
      rules: { type: 'none', detail: 'The contracts check no list.' },
      voluntaryDisclosure: { type: 'none', detail: 'The app has no report.' },
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
        '### Voluntary disclosure',
        '',
        '**None.** The app has no report.',
      ].join('\n'),
    )
  })

  it('says in one line that a project has no compliance design', () => {
    const markdown = renderPrivacyCompliance({
      none: 'The contracts and the app check no list.',
    })

    expect(markdown).toEqual(
      '**No compliance tools.** The contracts and the app check no list.',
    )
  })
})
