import { expect } from 'earl'
import {
  buildDiscoveryChangelog,
  getDiffHistoryEntryId,
} from './DiscoveryChangelog'

const HEADER = [
  'Generated with discovered.json: 0xabc123',
  '',
  '# Diff at Mon, 19 Aug 2026 12:34:56 GMT:',
  '',
  '- author: someone (<someone@example.com>)',
  '- comparing to: main@deadbeef block: 1755600000',
  '- current timestamp: 1755600100',
  '',
  '## Description',
  '',
  'Human-edited description that must not affect identity.',
  '',
]

function entryWith(sections: string[]): string {
  return [...HEADER, ...sections, ''].join('\n')
}

describe('buildDiscoveryChangelog', () => {
  it('projects a watched-changes entry into mechanical facts', () => {
    const md = entryWith([
      '## Watched changes',
      '',
      '```diff',
      '    contract Example (eth:0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f) [example] {',
      '    +++ description: test contract',
      '+++ description: trusted keys',
      '+++ severity: HIGH',
      '      values.trustedImages.0:',
      '-        "0xaa"',
      '+        "0xbb"',
      '      values.$pastUpgrades.10:',
      '+        ["2026-04-21T03:26:47.000Z","0x123",["eth:0x111"]]',
      '    }',
      '```',
      '',
      '```diff',
      '+   Status: CREATED',
      '    contract Fresh (eth:0x059dAF31F571da48Ab4e74Ae12F64f907681Cd8b)',
      '    +++ description: None',
      '```',
    ])

    const changelog = buildDiscoveryChangelog(md)
    expect(changelog).toEqual({
      formatVersion: 1,
      entries: [
        {
          id: getDiffHistoryEntryId('Mon, 19 Aug 2026 12:34:56 GMT', {
            kind: 'timestamp',
            value: 1755600100,
          }),
          timestamp: 1755600100,
          changes: [
            {
              address: 'eth:0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f',
              fields: [
                {
                  key: 'values.trustedImages.0',
                  removed: ['"0xaa"'],
                  added: ['"0xbb"'],
                },
                {
                  key: 'values.$pastUpgrades.10',
                  added: ['["2026-04-21T03:26:47.000Z","0x123",["eth:0x111"]]'],
                },
              ],
            },
            {
              address: 'eth:0x059daf31f571da48ab4e74ae12f64f907681cd8b',
              status: 'created',
            },
          ],
        },
      ],
    })
  })

  it('ignores config-related and source-code sections', () => {
    const md = entryWith([
      '## Source code changes',
      '',
      '```diff',
      'anything',
      '```',
      '',
      '## Config/verification related changes',
      '',
      'Following changes come from updates made to the config file.',
      '',
      '```diff',
      '    contract Example (eth:0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f) {',
      '      values.something:',
      '+        "1"',
      '    }',
      '```',
    ])
    expect(buildDiscoveryChangelog(md).entries).toEqual([])
  })

  it('keeps the entry id stable across description edits', () => {
    const watched = [
      '## Watched changes',
      '',
      '```diff',
      '    contract Example (eth:0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f) {',
      '      values.x:',
      '+        "1"',
      '    }',
      '```',
    ]
    const before = buildDiscoveryChangelog(entryWith(watched))
    const after = buildDiscoveryChangelog(
      entryWith(watched).replace(
        'Human-edited description that must not affect identity.',
        'A completely different description.',
      ),
    )
    expect(before.entries[0]?.id).toEqual(after.entries[0]?.id)
  })

  it('attributes non-EVM addresses instead of dropping them', () => {
    const md = entryWith([
      '## Watched changes',
      '',
      '```diff',
      '    contract Core (starknet:0x0644ac0128ba38b91b5b1b7e769ba8b51d4d07c07a33b7f234b978d9d5f6d7f) {',
      '      values.programHash:',
      '-        "0x1"',
      '+        "0x2"',
      '    }',
      '```',
    ])
    expect(buildDiscoveryChangelog(md).entries[0]?.changes[0]?.address).toEqual(
      'starknet:0x0644ac0128ba38b91b5b1b7e769ba8b51d4d07c07a33b7f234b978d9d5f6d7f',
    )
  })

  it('falls back to the entry date for legacy block-numbered entries', () => {
    const md = [
      '# Diff at Fri, 01 Mar 2024 10:00:00 GMT:',
      '',
      '- author: someone (<someone@example.com>)',
      '- comparing to: main@deadbeef',
      '- current block number: 19340000',
      '',
      '## Watched changes',
      '',
      '```diff',
      '    contract Example (0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f) {',
      '      values.x:',
      '+        "1"',
      '    }',
      '```',
      '',
    ].join('\n')
    const entry = buildDiscoveryChangelog(md).entries[0]
    expect(entry?.timestamp).toEqual(
      Math.floor(Date.parse('Fri, 01 Mar 2024 10:00:00 GMT') / 1000),
    )
    expect(entry?.changes[0]?.address).toEqual(
      '0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f',
    )
  })
})
