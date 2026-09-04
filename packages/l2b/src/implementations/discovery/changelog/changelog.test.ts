import { getDiffHistoryEntryId } from '@l2beat/shared'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { changelogEntryFromDiff } from './changelogFromDiff'
import { changelogFromDiffHistory } from './migrateChangelog'

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
const ENTRY_ID = getDiffHistoryEntryId('Mon, 19 Aug 2026 12:34:56 GMT', {
  kind: 'timestamp',
  value: 1755600100,
})

function entryWith(sections: string[]): string {
  return [...HEADER, ...sections, ''].join('\n')
}

describe(changelogFromDiffHistory.name, () => {
  it('migrates a watched-changes entry with its recorded severities', () => {
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

    expect(changelogFromDiffHistory(md)).toEqual({
      formatVersion: 1,
      entries: [
        {
          id: ENTRY_ID,
          timestamp: 1755600100,
          changes: [
            {
              address: 'eth:0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f',
              fields: [
                {
                  key: 'values.trustedImages.0',
                  severity: 'HIGH',
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

  it('attributes headers whose contract name contains parentheses', () => {
    const md = entryWith([
      '## Watched changes',
      '',
      '```diff',
      '    contract SignerList (Security Council) (eth:0x0F95E6968EC1B28c794CF1aD99609431de5179c2) [taiko/SignerList] {',
      '      values.settings:',
      '-        "0x1"',
      '+        "0x2"',
      '    }',
      '```',
      '',
      '```diff',
      '    EOA Named Operator (eth:0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {',
      '      values.x:',
      '+        "1"',
      '    }',
      '```',
    ])
    expect(
      changelogFromDiffHistory(md).entries[0]?.changes.map((c) => c.address),
    ).toEqual([
      'eth:0x0f95e6968ec1b28c794cf1ad99609431de5179c2',
      'eth:0x352f1defb49718e7ea411687e850aa8d6299f7ac',
    ])
  })

  it('throws instead of dropping an unattributable block', () => {
    const md = entryWith([
      '## Watched changes',
      '',
      '```diff',
      '    something unexpected {',
      '      values.x:',
      '+        "1"',
      '    }',
      '```',
    ])
    expect(() => changelogFromDiffHistory(md)).toThrow(
      /Cannot attribute diff block/,
    )
  })

  it('ignores config-related, initial-discovery and source-code sections', () => {
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
    expect(changelogFromDiffHistory(md).entries).toEqual([])
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
    const before = changelogFromDiffHistory(entryWith(watched))
    const after = changelogFromDiffHistory(
      entryWith(watched).replace(
        'Human-edited description that must not affect identity.',
        'A completely different description.',
      ),
    )
    expect(before.entries[0]?.id).toEqual(after.entries[0]?.id)
  })

  it('attributes non-EVM addresses and legacy bare addresses', () => {
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
      '    contract Core (starknet:0x0644ac0128ba38b91b5b1b7e769ba8b51d4d07c07a33b7f234b978d9d5f6d7f) {',
      '      values.programHash:',
      '-        "0x1"',
      '+        "0x2"',
      '    }',
      '```',
      '',
      '```diff',
      '    contract Example (0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f) {',
      '      values.x:',
      '+        "1"',
      '    }',
      '```',
      '',
    ].join('\n')
    const entry = changelogFromDiffHistory(md).entries[0]
    expect(entry?.timestamp).toEqual(
      Math.floor(Date.parse('Fri, 01 Mar 2024 10:00:00 GMT') / 1000),
    )
    expect(entry?.changes.map((c) => c.address)).toEqual([
      'starknet:0x0644ac0128ba38b91b5b1b7e769ba8b51d4d07c07a33b7f234b978d9d5f6d7f',
      '0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f',
    ])
  })
})

describe(changelogEntryFromDiff.name, () => {
  it('records the same facts the markdown block would carry', () => {
    const entry = changelogEntryFromDiff(ENTRY_ID, 1755600100, [
      {
        name: 'Example',
        address: ChainSpecificAddress(
          'eth:0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f',
        ),
        addressType: 'Contract',
        diff: [
          {
            key: 'values.trustedImages.0',
            before: '"0xaa"',
            after: '"0xbb"',
            severity: 'HIGH',
          },
          {
            key: 'values.$pastUpgrades.10',
            after: '["2026-04-21T03:26:47.000Z","0x123",["eth:0x111"]]',
          },
        ],
      },
      {
        name: 'Fresh',
        address: ChainSpecificAddress(
          'eth:0x059dAF31F571da48Ab4e74Ae12F64f907681Cd8b',
        ),
        addressType: 'Contract',
        type: 'created',
      },
    ])
    expect(entry).toEqual({
      id: ENTRY_ID,
      timestamp: 1755600100,
      changes: [
        {
          address: 'eth:0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f',
          fields: [
            {
              key: 'values.trustedImages.0',
              removed: ['"0xaa"'],
              added: ['"0xbb"'],
              severity: 'HIGH',
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
    })
  })

  it('returns nothing for an empty diff', () => {
    expect(changelogEntryFromDiff(ENTRY_ID, 1755600100, [])).toEqual(undefined)
  })
})
