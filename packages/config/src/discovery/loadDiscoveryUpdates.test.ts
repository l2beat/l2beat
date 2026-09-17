import { expect } from 'earl'
import { parseDiscoveryUpdates } from './loadDiscoveryUpdates'

describe(parseDiscoveryUpdates.name, () => {
  it('keeps only public changes', () => {
    const discoveryUpdates = parseDiscoveryUpdates(
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

    expect(discoveryUpdates.length).toEqual(1)
    const update = discoveryUpdates[0]!
    expect(update.id).toMatchRegex(/^[0-9a-f]{8}$/)
    expect(update.description).toEqual('A public update.')
    expect(update.changeCount).toEqual(1)
    expect(update.sections).toEqual([
      {
        kind: 'watched-changes',
        body: ['```diff', '+ watched', '```'].join('\n'),
      },
    ])
  })

  it('keeps verified and created contracts from config related changes', () => {
    const verifiedContract = [
      '```diff',
      '    contract Inbox (eth:0x123) [orbitstack/Inbox] {',
      '      unverified:',
      '-        true',
      '      sourceHashes.0:',
      '-        null',
      '+        "0xabcdef"',
      '    }',
      '```',
    ].join('\n')
    const createdContract = [
      '```diff',
      '+   Status: CREATED',
      '    contract UpgradeExecutor (eth:0x456) [orbitstack/UpgradeExecutor]',
      '    +++ description: None',
      '```',
    ].join('\n')

    const discoveryUpdates = parseDiscoveryUpdates(
      [
        '# Diff at Tue, 21 Jan 2026 09:00:00 GMT:',
        '',
        '## Config/verification related changes',
        '',
        'These changes can also include config-only updates.',
        '',
        verifiedContract,
        '',
        '```diff',
        '    contract ConfiguredContract (eth:0x789) [N/A] {',
        '      description:',
        '+        "A config-only change"',
        '    }',
        '```',
        '',
        createdContract,
        '',
        '```diff',
        '+   Status: CREATED',
        '    EOA NewActor (eth:0xabc)',
        '    +++ description: None',
        '```',
        '',
        '```diff',
        '    EOA NewActor (eth:0xabc) {',
        '      unverified:',
        '-        true',
        '    }',
        '```',
        '',
      ].join('\n'),
    )

    expect(discoveryUpdates.length).toEqual(1)
    const update = discoveryUpdates[0]!
    expect(update.sections).toEqual([
      {
        kind: 'config-related-changes',
        body: [verifiedContract, createdContract].join('\n\n'),
      },
    ])
    expect(update.changeCount).toEqual(3)
  })

  it('keeps standalone contracts added through config', () => {
    const createdContract = [
      '```diff',
      '+   Status: CREATED',
      '    contract ConfiguredContract (eth:0x789) [N/A]',
      '    +++ description: None',
      '```',
    ].join('\n')
    const discoveryUpdates = parseDiscoveryUpdates(
      [
        '# Diff at Tue, 21 Jan 2026 09:00:00 GMT:',
        '',
        '## Config/verification related changes',
        '',
        createdContract,
        '',
      ].join('\n'),
    )

    expect(discoveryUpdates[0]?.sections).toEqual([
      {
        kind: 'config-related-changes',
        body: createdContract,
      },
    ])
  })

  it('keeps initial discovery entries', () => {
    const discoveryUpdates = parseDiscoveryUpdates(
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

    expect(discoveryUpdates.length).toEqual(1)
    expect(discoveryUpdates[0]?.sections[0]?.kind).toEqual('initial-discovery')
  })

  it('marks high severity for implementation changes', () => {
    const discoveryUpdates = parseDiscoveryUpdates(
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

    expect(discoveryUpdates[0]?.isHighSeverity).toEqual(true)
  })

  it('marks high severity from explicit severity metadata', () => {
    const discoveryUpdates = parseDiscoveryUpdates(
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

    expect(discoveryUpdates[0]?.isHighSeverity).toEqual(true)
  })

  it('does not mark descriptions mentioning implementation as high severity', () => {
    const discoveryUpdates = parseDiscoveryUpdates(
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

    expect(discoveryUpdates[0]?.isHighSeverity).toEqual(false)
  })

  it('uses current timestamp metadata when present', () => {
    const discoveryUpdates = parseDiscoveryUpdates(
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

    expect(discoveryUpdates[0]?.timestamp).toEqual(1700000000)
    expect(discoveryUpdates[0]?.id ?? '').toMatchRegex(/^[0-9a-f]{8}$/)
  })

  it('creates unique ids for entries with the same discovery timestamp and date', () => {
    const discoveryUpdates = parseDiscoveryUpdates(
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

    expect(discoveryUpdates[0]?.id).not.toEqual(discoveryUpdates[1]?.id)
    expect(discoveryUpdates[0]?.id ?? '').toMatchRegex(/^[0-9a-f]{8}$/)
    expect(discoveryUpdates[1]?.id ?? '').toMatchRegex(/^[0-9a-f]{8}$/)
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
    const discoveryUpdates = parseDiscoveryUpdates(content)
    const repeated = parseDiscoveryUpdates(content)

    expect(discoveryUpdates[0]?.id).not.toEqual(discoveryUpdates[1]?.id)
    expect(repeated.map((update) => update.id)).toEqual(
      discoveryUpdates.map((update) => update.id),
    )
  })

  it('creates a linkable id for legacy entries with an invalid date', () => {
    const discoveryUpdates = parseDiscoveryUpdates(
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

    expect(discoveryUpdates[0]?.timestamp).toEqual(null)
    expect(discoveryUpdates[0]?.id ?? '').toMatchRegex(/^[0-9a-f]{8}$/)
  })
})
