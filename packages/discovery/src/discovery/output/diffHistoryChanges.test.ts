import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { existsSync, readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { getDiscoveryPaths } from '../config/getDiscoveryPaths'
import { DiffHistoryParser } from './DiffHistoryParser'
import {
  canonicalField,
  getDiffHistoryChanges,
  stripChainPrefixes,
} from './diffHistoryChanges'

const parser = new DiffHistoryParser()
const ADDRESS = '0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f'
const TX = `0x${'1'.repeat(64)}`

function entry(header: string[], blocks: string[]): string {
  return [
    '# Diff at Tue, 05 May 2026 15:19:12 GMT:',
    '',
    ...header,
    '',
    '## Watched changes',
    '',
    ...blocks,
    '',
  ].join('\n')
}

const block = (head: string, lines: string[]) =>
  ['```diff', head, '    +++ description: None', ...lines, '    }', '```'].join(
    '\n',
  )

describe(getDiffHistoryChanges.name, () => {
  it('types every field change and carries the entry facts', () => {
    const md = entry(
      [
        '- comparing to: main@abc block: 1777900000',
        '- current timestamp: 1777994288',
      ],
      [
        block(`    contract A (eth:${ADDRESS}) [x/A] {`, [
          '      values.$pastUpgrades.1:',
          `+        ["2026-05-01T00:00:00.000Z","${TX}",["eth:${ADDRESS}"]]`,
          '      values.$upgradeCount:',
          '-        1',
          '+        2',
          '      values.$implementation:',
          '-        "0xa"',
          '+        "0xb"',
          '      values.owner:',
          '-        "0xa"',
          '+        "eth:0xa"',
          '      upgradeability.admin:',
          '-        "0xa"',
          '+        "0xb"',
          '      receivedPermissions.0:',
          '+        {}',
        ]),
      ],
    )
    const [parsed] = parser.parse(md)
    const changes = getDiffHistoryChanges(parsed!)
    expect(changes.map((c) => [c.kind, c.field])).toEqual([
      ['upgradeAppended', '$pastUpgrades'],
      ['upgradeRecord', '$upgradeCount'],
      ['implementation', '$implementation'],
      ['representationOnly', 'owner'],
      ['value', '$admin'],
      ['value', undefined],
    ])
    expect(changes[0]).toEqual({
      entryId: parsed!.id,
      timestamp: 1777994288,
      previous: 1777900000,
      address: ChainSpecificAddress(`eth:${ADDRESS}`),
      addressType: 'Contract',
      template: 'x/A',
      field: '$pastUpgrades',
      kind: 'upgradeAppended',
      upgrade: {
        timestamp: Date.parse('2026-05-01T00:00:00.000Z') / 1000,
        transaction: TX,
      },
    })
  })

  it('resolves bare legacy addresses with the entry chain and keeps statuses', () => {
    const md = entry(
      ['- chain: arbitrum', '- current block number: 19340000'],
      [
        [
          '```diff',
          '-   Status: DELETED',
          `    contract B (${ADDRESS})`,
          '    +++ description: None',
          '```',
        ].join('\n'),
      ],
    )
    const [change] = getDiffHistoryChanges(parser.parse(md)[0]!)
    expect(change).toEqual({
      entryId: parser.parse(md)[0]!.id,
      timestamp: Math.floor(Date.parse('Tue, 05 May 2026 15:19:12 GMT') / 1000),
      address: ChainSpecificAddress(`arb1:${ADDRESS}`),
      addressType: 'Contract',
      status: 'deleted',
    })
  })

  it('reads every watched change of every project', function () {
    this.timeout(60_000)
    const root = getDiscoveryPaths().discovery
    let changes = 0
    for (const project of readdirSync(root)) {
      const file = join(root, project, 'diffHistory.md')
      if (!existsSync(file)) continue
      for (const parsed of parser.parse(readFileSync(file, 'utf-8'))) {
        changes += getDiffHistoryChanges(parsed).length
      }
    }
    expect(changes).toBeGreaterThan(0)
  })
})

describe(canonicalField.name, () => {
  it('maps diff keys to fieldMeta names', () => {
    expect(canonicalField('values.owner')).toEqual('owner')
    expect(canonicalField('values.$pastUpgrades.3')).toEqual('$pastUpgrades')
    expect(canonicalField('upgradeability.admin')).toEqual('$admin')
    expect(canonicalField('receivedPermissions.0')).toEqual(undefined)
    expect(canonicalField('name')).toEqual(undefined)
  })
})

describe(stripChainPrefixes.name, () => {
  it('removes chain prefixes written before addresses', () => {
    expect(stripChainPrefixes('"eth:0xAb"')).toEqual('"0xAb"')
    expect(stripChainPrefixes('["arb1:0x1","zksync-era:0x2"]')).toEqual(
      '["0x1","0x2"]',
    )
    expect(stripChainPrefixes('{"a":0x1}')).toEqual('{"a":0x1}')
  })
})
