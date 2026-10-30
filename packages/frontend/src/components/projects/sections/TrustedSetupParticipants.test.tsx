import { expect } from 'earl'
import { renderToStaticMarkup } from 'react-dom/server'
import { TrustedSetupParticipants } from './TrustedSetupParticipants'

describe(TrustedSetupParticipants.name, () => {
  it('shows both phases with their own counts and units', () => {
    const html = renderToStaticMarkup(
      <TrustedSetupParticipants
        phases={{
          phase1: { count: 30, unit: 'contributions' },
          phase2: { count: 1114, unit: 'participants' },
        }}
      />,
    )

    expect(html).toInclude(
      'Phase 1',
      '30',
      'contributions',
      'Phase 2',
      '1,114',
      'participants',
    )
    expect(html.indexOf('Phase 1') < html.indexOf('Phase 2')).toEqual(true)
  })

  it('does not invent a second phase for a universal setup', () => {
    const html = renderToStaticMarkup(
      <TrustedSetupParticipants
        phases={{ phase1: { count: 54, unit: 'contributions' } }}
      />,
    )

    expect(html).toInclude('Phase 1', '54')
    expect(html.includes('Phase 2')).toEqual(false)
  })

  it('distinguishes an unknown count from a known zero', () => {
    const html = renderToStaticMarkup(
      <TrustedSetupParticipants
        phases={{
          phase1: { count: 0, unit: 'contributions' },
          phase2: {
            unit: 'participants',
            description: 'Transcript unavailable.',
          },
        }}
      />,
    )

    expect(html).toInclude('>0<', 'Unknown', 'Transcript unavailable.')
  })

  it('shows a circuit-dependent range and its explanation', () => {
    const html = renderToStaticMarkup(
      <TrustedSetupParticipants
        phases={{
          phase2: {
            count: { min: 513, max: 514 },
            unit: 'contributions',
            description: 'Ragequit: 513. Withdraw: 514.',
          },
        }}
      />,
    )

    expect(html).toInclude(
      '513–514',
      'contributions',
      'Ragequit: 513. Withdraw: 514.',
    )
  })

  it('shows legacy counts without assigning them to an unknown phase', () => {
    const html = renderToStaticMarkup(
      <TrustedSetupParticipants participantCount={1} phases={{}} />,
    )

    expect(html).toInclude('Participants', '>1<', '>participant<')
    expect(html.includes('Phase')).toEqual(false)
  })

  it('renders nothing for a setup without participant metadata', () => {
    expect(renderToStaticMarkup(<TrustedSetupParticipants />)).toEqual('')
  })
})
