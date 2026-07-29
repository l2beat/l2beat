import { expect } from 'earl'
import {
  countRecentDiscoveryUpdates,
  type DiscoveryUpdate,
  parseDiscoveryUpdates,
} from './getDiscoveryUpdates'

describe(parseDiscoveryUpdates.name, () => {
  it('keeps only initial discovery and watched changes', () => {
    const updates = parseDiscoveryUpdates(
      [
        '# Diff at Tue, 21 Jan 2026 09:00:00 GMT:',
        '',
        '## Description',
        '',
        'A public update.',
        '',
        '## Watched changes',
        '',
        '```diff',
        '+ watched',
        '```',
        '',
        '## Config/verification related changes',
        '',
        '```diff',
        '+ config',
        '```',
        '',
        '# Diff at Mon, 20 Jan 2026 09:00:00 GMT:',
        '',
        '## Description',
        '',
        'Internal only.',
        '',
        '## Source code changes',
        '',
        '```diff',
        '+ source',
        '```',
        '',
      ].join('\n'),
    )

    expect(updates.length).toEqual(1)
    expect(updates[0]?.id ?? '').toMatchRegex(/^[0-9a-f]{8}$/)
    expect(updates[0]?.description).toEqual('A public update.')
    expect(updates[0]?.sections).toEqual([
      {
        kind: 'watched-changes',
        body: ['```diff', '+ watched', '```'].join('\n'),
      },
    ])
    expect(updates[0]?.changeCount).toEqual(1)
  })

  it('keeps initial discovery entries', () => {
    const updates = parseDiscoveryUpdates(
      [
        '# Diff at Tue, 21 Jan 2026 09:00:00 GMT:',
        '',
        '## Initial discovery',
        '',
        '```diff',
        '+ contract Added (eth:0x123)',
        '```',
        '',
      ].join('\n'),
    )

    expect(updates.length).toEqual(1)
    expect(updates[0]?.sections[0]?.kind).toEqual('initial-discovery')
  })

  it('marks high severity for implementation changes', () => {
    const updates = parseDiscoveryUpdates(
      [
        '# Diff at Tue, 21 Jan 2026 09:00:00 GMT:',
        '',
        '## Watched changes',
        '',
        '```diff',
        '  values.$implementation:',
        '-   "eth:0x0000000000000000000000000000000000000001"',
        '+   "eth:0x0000000000000000000000000000000000000002"',
        '```',
        '',
      ].join('\n'),
    )

    expect(updates[0]?.isHighSeverity).toEqual(true)
    expect(updates[0]?.changeCount).toEqual(2)
  })

  it('marks high severity from explicit severity metadata', () => {
    const updates = parseDiscoveryUpdates(
      [
        '# Diff at Tue, 21 Jan 2026 09:00:00 GMT:',
        '',
        '## Watched changes',
        '',
        '```diff',
        '+++ severity: HIGH',
        '+   field: value',
        '```',
        '',
      ].join('\n'),
    )

    expect(updates[0]?.isHighSeverity).toEqual(true)
  })

  it('does not mark descriptions mentioning implementation as high severity', () => {
    const updates = parseDiscoveryUpdates(
      [
        '# Diff at Tue, 21 Jan 2026 09:00:00 GMT:',
        '',
        '## Watched changes',
        '',
        '```diff',
        '+   description: Uses an implementation of a proof system.',
        '```',
        '',
      ].join('\n'),
    )

    expect(updates[0]?.isHighSeverity).toEqual(false)
  })

  it('uses current timestamp metadata when present', () => {
    const updates = parseDiscoveryUpdates(
      [
        '# Diff at Tue, 21 Jan 2026 09:00:00 GMT:',
        '',
        '- current timestamp: 1700000000',
        '',
        '## Watched changes',
        '',
        '```diff',
        '+ watched',
        '```',
        '',
      ].join('\n'),
    )

    expect(updates[0]?.timestamp).toEqual(1700000000)
    expect(updates[0]?.id ?? '').toMatchRegex(/^[0-9a-f]{8}$/)
  })

  it('creates unique ids for entries with the same discovery timestamp and date', () => {
    const updates = parseDiscoveryUpdates(
      [
        'Generated with discovered.json: 0x111',
        '# Diff at Tue, 21 Jan 2026 09:00:00 GMT:',
        '',
        '- current timestamp: 1700000000',
        '',
        '## Watched changes',
        '',
        '```diff',
        '+ first',
        '```',
        '',
        'Generated with discovered.json: 0x222',
        '# Diff at Tue, 21 Jan 2026 09:00:00 GMT:',
        '',
        '- current timestamp: 1700000000',
        '',
        '## Watched changes',
        '',
        '```diff',
        '+ second',
        '```',
        '',
      ].join('\n'),
    )

    expect(updates[0]?.id).not.toEqual(updates[1]?.id)
    expect(updates[0]?.id ?? '').toMatchRegex(/^[0-9a-f]{8}$/)
    expect(updates[1]?.id ?? '').toMatchRegex(/^[0-9a-f]{8}$/)
  })

  it('creates stable unique ids without a discovery hash', () => {
    const content = [
      '# Diff at Tue, 21 Jan 2026 09:00:00 GMT:',
      '',
      '- current timestamp: 1700000000',
      '',
      '## Watched changes',
      '',
      '```diff',
      '+ first',
      '```',
      '',
      '# Diff at Tue, 21 Jan 2026 09:00:00 GMT:',
      '',
      '- current timestamp: 1700000000',
      '',
      '## Watched changes',
      '',
      '```diff',
      '+ second',
      '```',
      '',
    ].join('\n')
    const updates = parseDiscoveryUpdates(content)
    const repeated = parseDiscoveryUpdates(content)

    expect(updates[0]?.id).not.toEqual(updates[1]?.id)
    expect(repeated.map((update) => update.id)).toEqual(
      updates.map((update) => update.id),
    )
  })

  it('creates a linkable id for legacy entries with an invalid date', () => {
    const updates = parseDiscoveryUpdates(
      [
        '# Diff at legacy entry:',
        '',
        '## Watched changes',
        '',
        '```diff',
        '+ watched',
        '```',
        '',
      ].join('\n'),
    )

    expect(updates[0]?.timestamp).toEqual(null)
    expect(updates[0]?.id ?? '').toMatchRegex(/^[0-9a-f]{8}$/)
  })

  it('respects the result limit', () => {
    const updates = parseDiscoveryUpdates(
      [
        '# Diff at Tue, 21 Jan 2026 09:00:00 GMT:',
        '',
        '## Watched changes',
        '',
        '```diff',
        '+ first',
        '```',
        '',
        '# Diff at Mon, 20 Jan 2026 09:00:00 GMT:',
        '',
        '## Watched changes',
        '',
        '```diff',
        '+ second',
        '```',
        '',
      ].join('\n'),
      1,
    )

    expect(updates.length).toEqual(1)
    expect(updates[0]?.date).toEqual('Tue, 21 Jan 2026 09:00:00 GMT')
  })
})

describe(countRecentDiscoveryUpdates.name, () => {
  const DAY = 24 * 60 * 60
  const NOW = 1700000000

  function update(timestamp: number | null): DiscoveryUpdate {
    return {
      id: `${timestamp ?? 'unknown'}`,
      date: 'Tue, 21 Jan 2026 09:00:00 GMT',
      timestamp,
      description: '',
      isHighSeverity: false,
      changeCount: 1,
      sections: [],
    }
  }

  it('counts only updates from the past 7 days', () => {
    const count = countRecentDiscoveryUpdates(
      [
        update(NOW - 1 * DAY),
        update(NOW - 7 * DAY),
        update(NOW - 8 * DAY),
        update(NOW - 30 * DAY),
      ],
      NOW,
    )

    expect(count).toEqual(2)
  })

  it('ignores updates without a timestamp', () => {
    expect(countRecentDiscoveryUpdates([update(null)], NOW)).toEqual(0)
  })

  it('returns zero for no updates', () => {
    expect(countRecentDiscoveryUpdates([], NOW)).toEqual(0)
  })
})
