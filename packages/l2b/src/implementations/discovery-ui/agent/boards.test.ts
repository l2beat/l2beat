import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { boardSpecSchema, parseBoardSpec, resolveBoard } from './boards'
import type { ProjectEntry } from './entries'

const BRIDGE = ChainSpecificAddress(
  'eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
)
const COUNCIL = ChainSpecificAddress(
  'eth:0xF06E95eF589D9c38af242a8AAee8375f14023F85',
)
const SIGNER = ChainSpecificAddress(
  'eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A',
)

// Tables bind rows to selectors and columns to properties, values or
// per-row selectors, so each kind is resolved against a tiny project.
describe(resolveBoard.name, () => {
  const entries = [
    entry(BRIDGE, 'Bridge', { values: { owner: COUNCIL, paused: false } }),
    entry(COUNCIL, 'Council', {
      signers: { threshold: 2, members: [SIGNER] },
      values: { $threshold: 2, $members: [SIGNER] },
    }),
    entry(SIGNER, undefined, { isEOA: true }),
  ]

  it('binds rows to selectors and columns to values', () => {
    const board = resolveBoard(entries, {
      title: 'Multisigs',
      blocks: [
        {
          type: 'table',
          rows: ['type:multisig'],
          columns: [
            { label: 'Name', property: 'name' },
            { label: 'Threshold', field: '$threshold' },
            { label: 'Signers', field: '$members' },
          ],
        },
      ],
    })
    expect(board.problems).toEqual([])
    expect(board.blocks).toEqual([
      {
        type: 'table',
        title: undefined,
        columns: ['Name', 'Threshold', 'Signers'],
        graphColumns: [],
        rows: [
          {
            address: COUNCIL,
            cells: [
              [{ address: COUNCIL, name: 'Council' }],
              [{ text: '2' }],
              [{ address: SIGNER, name: SIGNER }],
            ],
          },
        ],
      },
    ])
  })

  it('runs column selectors per row and lets rows bring their own cells', () => {
    const board = resolveBoard(entries, {
      title: 'Owners',
      blocks: [
        {
          type: 'table',
          rows: [{ contract: 'Bridge', cells: { Note: 'checked by hand' } }],
          columns: [
            { label: 'Owned by', field: 'owner' },
            { label: 'Same chain', selector: 'chain:eth' },
            { label: 'Note' },
          ],
        },
      ],
    })
    const table = board.blocks[0]
    if (table?.type !== 'table') throw new Error('Expected a table')
    expect(table.rows[0]?.cells).toEqual([
      [{ address: BRIDGE, name: 'Bridge' }],
      [{ address: COUNCIL, name: 'Council' }],
      [
        { address: BRIDGE, name: 'Bridge' },
        { address: COUNCIL, name: 'Council' },
        { address: SIGNER, name: SIGNER },
      ],
      [{ text: 'checked by hand' }],
    ])
  })

  it('answers who upgrades a row, how fast and through what', () => {
    const ADMIN = ChainSpecificAddress(
      'eth:0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD',
    )
    const withUpgrades = [
      ...entries,
      entry(ADMIN, 'ProxyAdmin', {}),
      entry(SIGNER, 'Owner', {
        receivedPermissions: [
          { permission: 'upgrade', from: BRIDGE, via: [{ address: ADMIN }] },
        ],
      }),
    ].filter((e) => e.address !== SIGNER || e.name === 'Owner')
    const board = resolveBoard(withUpgrades, {
      title: 'Upgrades',
      blocks: [
        {
          type: 'table',
          rows: ['Bridge', 'Council'],
          columns: [
            { label: 'By', property: 'upgradedBy' },
            { label: 'Delay', property: 'upgradeDelay' },
            { label: 'Route', property: 'upgradeRoute' },
          ],
        },
      ],
    })
    const table = board.blocks[0]
    if (table?.type !== 'table') throw new Error('Expected a table')
    expect(table.rows.map((r) => r.cells)).toEqual([
      [
        [{ address: BRIDGE, name: 'Bridge' }],
        [{ address: SIGNER, name: 'Owner' }],
        [{ text: 'no delay' }],
        [
          { address: SIGNER, name: 'Owner' },
          { text: '→' },
          { address: ADMIN, name: 'ProxyAdmin' },
        ],
      ],
      [[{ address: COUNCIL, name: 'Council' }], [], [], []],
    ])
  })

  it('reports what did not bind instead of failing', () => {
    const board = resolveBoard(entries, {
      title: 'Typos',
      blocks: [
        {
          type: 'table',
          title: 'Escrows',
          rows: ['name:*Escrow*', 'Bridge'],
          columns: [{ label: 'Delay', field: 'delay' }],
        },
      ],
    })
    expect(board.problems).toEqual([
      'Escrows: rows name:*Escrow* matched nothing',
      'Escrows: no row has field delay (the first row has owner, paused)',
    ])
  })

  it('names the contract of each row when no column does', () => {
    const board = resolveBoard(entries, {
      title: 'Thresholds',
      blocks: [
        {
          type: 'table',
          rows: ['type:multisig'],
          columns: [
            { label: 'Address', property: 'address' },
            { label: 'Threshold', field: '$threshold' },
          ],
        },
        {
          type: 'table',
          rows: [{ cells: { Note: 'computed' } }],
          columns: [{ label: 'Note' }],
        },
      ],
    })
    const [named, computed] = board.blocks
    if (named?.type !== 'table' || computed?.type !== 'table') {
      throw new Error('Expected tables')
    }
    expect(named.columns).toEqual(['Contract', 'Address', 'Threshold'])
    expect(named.rows[0]?.cells[0]).toEqual([
      { address: COUNCIL, name: 'Council' },
    ])
    expect(named.rows[0]?.cells[1]).toEqual([
      { address: COUNCIL, name: COUNCIL },
    ])
    expect(computed.columns).toEqual(['Note'])
  })

  it('names the contracts in an unbound Contract column', () => {
    const board = resolveBoard(entries, {
      title: 'Thresholds',
      blocks: [
        {
          type: 'table',
          rows: ['type:multisig'],
          columns: [
            { label: 'Contract' },
            { label: 'Threshold', field: '$threshold' },
          ],
        },
      ],
    })
    const table = board.blocks[0]
    if (table?.type !== 'table') throw new Error('Expected a table')
    expect(table.columns).toEqual(['Contract', 'Threshold'])
    expect(table.rows[0]?.cells[0]).toEqual([
      { address: COUNCIL, name: 'Council' },
    ])
  })

  it('links an address a cell holds in lowercase', () => {
    const board = resolveBoard(entries, {
      title: 'Computed',
      blocks: [
        {
          type: 'table',
          rows: [{ cells: { Holder: BRIDGE.toLowerCase() } }],
          columns: [{ label: 'Holder' }],
        },
      ],
    })
    const table = board.blocks[0]
    if (table?.type !== 'table') throw new Error('Expected a table')
    expect(table.rows[0]?.cells[0]).toEqual([
      { address: BRIDGE, name: 'Bridge' },
    ])
  })

  it('lists a contract two selectors match once', () => {
    const board = resolveBoard(entries, {
      title: 'Twice',
      blocks: [{ type: 'table', rows: ['Council', 'type:multisig', 'all'] }],
    })
    const table = board.blocks[0]
    if (table?.type !== 'table') throw new Error('Expected a table')
    expect(table.rows.map((r) => r.address)).toEqual([COUNCIL, BRIDGE, SIGNER])
  })

  it('keeps a row whose contract is gone, with its own cells', () => {
    const board = resolveBoard(entries, {
      title: 'Gone',
      blocks: [
        {
          type: 'table',
          title: 'Notes',
          rows: [{ contract: 'Brige', cells: { Note: 'renamed?' } }],
          columns: [{ label: 'Name', property: 'name' }, { label: 'Note' }],
        },
      ],
    })
    const table = board.blocks[0]
    if (table?.type !== 'table') throw new Error('Expected a table')
    expect(table.rows).toEqual([
      { address: undefined, cells: [[], [{ text: 'renamed?' }]] },
    ])
    expect(board.problems).toEqual(['Notes: No contract with this name: Brige'])
  })

  it('says once that a column selector failed', () => {
    const board = resolveBoard(entries, {
      title: 'Typo',
      blocks: [
        {
          type: 'table',
          title: 'Upgrades',
          rows: ['all'],
          columns: [{ label: 'Can', selector: 'upgradableBy:{row}' }],
        },
      ],
    })
    expect(board.problems).toEqual([
      'Upgrades: column Can: No contract with this name in upgradableBy:{row}',
    ])
  })

  it('draws the rest of a board whose view cannot be drawn', () => {
    const board = resolveBoard(entries, {
      title: 'Views',
      blocks: [
        { type: 'text', text: 'Before' },
        {
          type: 'view',
          label: 'Hide the escrow',
          view: { title: 'No escrow', hide: ['Escrow'] },
        },
      ],
    })
    expect(board.blocks[0]).toEqual({ type: 'text', text: 'Before' })
    expect(board.blocks[1]?.type).toEqual('problem')
    expect(board.problems[0]).toInclude('Hide the escrow: No contract')
  })

  it('draws no button for a view that keeps only an empty list', () => {
    const board = resolveBoard(entries, {
      title: 'Views',
      blocks: [
        {
          type: 'view',
          label: 'Nothing',
          view: { title: 'Nothing', only: [] },
        },
      ],
    })
    expect(board.blocks[0]?.type).toEqual('problem')
  })

  it('draws no button that would keep only what nothing matches', () => {
    const board = resolveBoard(entries, {
      title: 'Views',
      blocks: [
        {
          type: 'view',
          label: 'Only escrows',
          view: { title: 'Escrows', only: ['name:*Escrow*'] },
        },
      ],
    })
    expect(board.blocks[0]?.type).toEqual('problem')
    expect(board.problems).toEqual([
      'Only escrows: nothing matches name:*Escrow*',
    ])
  })
})

describe('boardSpecSchema', () => {
  function parse(column: object) {
    return boardSpecSchema.safeParse({
      title: 'T',
      blocks: [{ type: 'table', rows: ['all'], columns: [column] }],
    }).success
  }

  it('takes a column that reads one thing or nothing', () => {
    expect(parse({ label: 'A', property: 'upgradeDelay' })).toEqual(true)
    expect(parse({ label: 'A', field: '$threshold' })).toEqual(true)
    expect(parse({ label: 'A' })).toEqual(true)
  })

  it('rejects a column that reads two things or an unknown property', () => {
    expect(parse({ label: 'A', property: 'name', field: 'x' })).toEqual(false)
    expect(parse({ label: 'A', property: 'owner' })).toEqual(false)
  })
})

function entry(
  address: ChainSpecificAddress,
  name: string | undefined,
  fields: Partial<ProjectEntry>,
): ProjectEntry {
  return {
    address,
    name,
    isEOA: false,
    template: undefined,
    category: undefined,
    directPermissions: [],
    values: {},
    controllers: [],
    ...fields,
  }
}

describe(parseBoardSpec.name, () => {
  it('names the mistake in the block its type points at', () => {
    const result = parseBoardSpec({
      title: 'T',
      blocks: [
        { type: 'text', text: 'ok' },
        {
          type: 'table',
          rows: ['all'],
          columns: [{ label: 'A', property: 'owner' }],
        },
      ],
    })
    expect(result.success).toEqual(false)
    if (result.success) return
    expect(result.message).toInclude('At .blocks[1].columns[0].property:')
    expect(result.message).not.toInclude('Variant')
  })

  it('lists the block types for an unknown one', () => {
    const result = parseBoardSpec({ title: 'T', blocks: [{ type: 'chart' }] })
    expect(result).toEqual({
      success: false,
      message: 'At .blocks[0].type: a block is one of text, table, view, html',
    })
  })
})
