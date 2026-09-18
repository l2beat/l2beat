import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { existsSync, readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { getDiscoveryPaths } from '../config/getDiscoveryPaths'
import { DiffHistoryParser } from './DiffHistoryParser'
import type { DiscoveryDiff } from './diffDiscovery'
import { discoveryDiffToMarkdown } from './diffToMarkdown'
import {
  type DiffHistoryBlock,
  parseDiffHistoryBlocks,
} from './parseDiffHistoryBlocks'

const ADDRESS_A = ChainSpecificAddress(
  'eth:0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f',
)
const ADDRESS_B = ChainSpecificAddress(
  'eth:0x059dAF31F571da48Ab4e74Ae12F64f907681Cd8b',
)

describe(parseDiffHistoryBlocks.name, () => {
  it('is the inverse of discoveryDiffToMarkdown', () => {
    const diffs: DiscoveryDiff[] = [
      {
        name: 'Diamond (main)',
        address: ADDRESS_A,
        addressType: 'Contract',
        template: 'shared-zk-stack/Diamond',
        description: 'The main contract.',
        diff: [
          {
            key: 'values.$pastUpgrades.13',
            after: '["2026-08-16T12:38:23.000Z","0x30","["eth:0x37"]]',
          },
          {
            key: 'values.getProtocolVersion',
            before: '128849018880',
            after: '128849018881',
            severity: 'HIGH',
            description: 'Protocol version.',
          },
          { key: 'values.$upgradeCount', before: '13', after: '14' },
        ],
      },
      {
        name: 'L1VerifierPlonk',
        address: ADDRESS_B,
        addressType: 'Contract',
        type: 'deleted',
      },
      { address: ADDRESS_A, addressType: 'EOA', type: 'created' },
      {
        address: ADDRESS_B,
        addressType: 'Reference',
        diff: [{ key: 'receivedPermissions', after: '[{"permission":"a"}]' }],
      },
    ]

    const parsed = parseDiffHistoryBlocks(discoveryDiffToMarkdown(diffs))

    const expected: DiffHistoryBlock[] = [
      {
        addressType: 'Contract',
        name: 'Diamond (main)',
        address: ADDRESS_A.toString(),
        template: 'shared-zk-stack/Diamond',
        description: 'The main contract.',
        diff: [
          {
            key: 'values.$pastUpgrades.13',
            after: '["2026-08-16T12:38:23.000Z","0x30","["eth:0x37"]]',
          },
          {
            key: 'values.getProtocolVersion',
            severity: 'HIGH',
            description: 'Protocol version.',
            before: '128849018880',
            after: '128849018881',
          },
          { key: 'values.$upgradeCount', before: '13', after: '14' },
        ],
      },
      {
        addressType: 'Contract',
        name: 'L1VerifierPlonk',
        address: ADDRESS_B.toString(),
        type: 'deleted',
      },
      { addressType: 'EOA', address: ADDRESS_A.toString(), type: 'created' },
      {
        addressType: 'Reference',
        address: ADDRESS_B.toString(),
        diff: [{ key: 'receivedPermissions', after: '[{"permission":"a"}]' }],
      },
    ]
    expect(parsed).toEqual(expected)
  })

  it('reads legacy blocks with bare addresses and no template', () => {
    const block = [
      '```diff',
      '    contract SystemConfig (0x73a79Fab69143498Ed3712e519A88a918e1f4072) {',
      '    +++ description: None',
      '+++ type: RISK_PARAMETER',
      '      upgradeability.implementation:',
      '-        "0xAAAA"',
      '+        "0xBBBB"',
      '    }',
      '```',
    ].join('\n')
    expect(parseDiffHistoryBlocks(block)).toEqual([
      {
        addressType: 'Contract',
        name: 'SystemConfig',
        address: '0x73a79Fab69143498Ed3712e519A88a918e1f4072',
        diff: [
          {
            key: 'upgradeability.implementation',
            before: '"0xAAAA"',
            after: '"0xBBBB"',
          },
        ],
      },
    ])
  })

  it('keeps free text lines as part of the description before them', () => {
    const block = [
      '```diff',
      `    contract Verifier (${ADDRESS_A}) [x/Verifier] {`,
      '    +++ description: Verifies proofs.',
      'Note: currently only Succinct proofs are used.',
      '+++ severity: HIGH',
      '      values.owner:',
      '-        "0xAAAA"',
      '+        "0xBBBB"',
      '    }',
      '```',
    ].join('\n')
    const [block0] = parseDiffHistoryBlocks(block)
    expect(block0?.description).toEqual(
      'Verifies proofs.\nNote: currently only Succinct proofs are used.',
    )
    expect(block0?.diff).toEqual([
      {
        key: 'values.owner',
        severity: 'HIGH',
        before: '"0xAAAA"',
        after: '"0xBBBB"',
      },
    ])
  })

  it('rejects a block it cannot attribute to an address', () => {
    const block = ['```diff', '    something else entirely', '```'].join('\n')
    expect(() => parseDiffHistoryBlocks(block)).toThrow()
  })

  it('reads every watched and initial discovery block of every project', function () {
    this.timeout(60_000)
    const root = getDiscoveryPaths().discovery
    const parser = new DiffHistoryParser()
    let blockStarts = 0
    let blocks = 0
    for (const project of readdirSync(root)) {
      const file = join(root, project, 'diffHistory.md')
      if (!existsSync(file)) continue
      for (const entry of parser.parse(readFileSync(file, 'utf-8'))) {
        for (const section of entry.sections) {
          if (
            section.kind !== 'watched-changes' &&
            section.kind !== 'initial-discovery'
          ) {
            continue
          }
          blockStarts += section.body.split('```diff\n').length - 1
          for (const block of parseDiffHistoryBlocks(section.body)) {
            blocks++
            expect(block.address.length).toBeGreaterThan(0)
            for (const field of block.diff ?? []) {
              expect(field.key.length).toBeGreaterThan(0)
              expect(
                field.before !== undefined || field.after !== undefined,
              ).toEqual(true)
            }
          }
        }
      }
    }
    expect(blocks).toEqual(blockStarts)
    expect(blocks).toBeGreaterThan(0)
  })
})
