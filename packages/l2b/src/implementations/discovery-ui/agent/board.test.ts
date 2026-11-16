import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { boardBlocksSchema, describeBoard, resolveBoard } from './board'
import type { AgentEntry } from './resolveRef'
import { ToolError } from './toolError'

const BRIDGE = ChainSpecificAddress(
  'eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
)
const UNNAMED = ChainSpecificAddress(
  'eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840',
)
const ENTRIES: AgentEntry[] = [
  { address: BRIDGE, name: 'Bridge' },
  { address: UNNAMED, name: undefined },
]

describe(resolveBoard.name, () => {
  it('turns contract cells into addresses the tab selects', () => {
    const board = resolveBoard(ENTRIES, {
      id: 'b1',
      project: 'linea',
      title: 'Upgrades',
      blocks: [
        { type: 'text', text: 'From discovered.json' },
        {
          type: 'table',
          columns: ['Contract', 'Delay'],
          rows: [
            [{ contract: 'Bridge' }, '7d'],
            [{ contract: UNNAMED }, 'none'],
          ],
        },
      ],
    })
    expect(board.blocks[1]).toEqual({
      type: 'table',
      title: undefined,
      columns: ['Contract', 'Delay'],
      rows: [
        [
          { type: 'contract', address: BRIDGE, name: 'Bridge' },
          { type: 'text', text: '7d' },
        ],
        [
          { type: 'contract', address: UNNAMED },
          { type: 'text', text: 'none' },
        ],
      ],
    })
    expect(describeBoard(board)).toEqual([
      'Board "Upgrades" shown in DiscoUI\'s board panel. linea, 2 blocks:',
      '  text',
      '  table: 2 rows, 2 columns, 2 contract links',
    ])
  })

  it('names the table of a contract it cannot find', () => {
    const resolve = () =>
      resolveBoard(ENTRIES, {
        id: 'b1',
        project: 'linea',
        title: 'Upgrades',
        blocks: [
          { type: 'table', title: 'Admins', columns: ['A'], rows: [[]] },
          {
            type: 'table',
            title: 'Bridges',
            columns: ['Contract'],
            rows: [[{ contract: 'Brigde' }]],
          },
        ],
      })
    expect(resolve).toThrow(ToolError)
    try {
      resolve()
    } catch (error) {
      const text = (error as ToolError).describe()
      expect(text).toInclude('No contract with this name')
      expect(text).toInclude('block: 1 (Bridges)')
      expect(text).toInclude('Bridge')
    }
  })
})

describe('boardBlocksSchema', () => {
  it('takes rows with one cell per column only', () => {
    const table = (rows: string[][]) => [
      { type: 'table', columns: ['A', 'B'], rows },
    ]
    expect(boardBlocksSchema.safeParse(table([['1', '2']])).success).toEqual(
      true,
    )
    expect(boardBlocksSchema.safeParse(table([['1']])).success).toEqual(false)
  })

  it('takes typed cells only, not markup or numbers', () => {
    const table = (cell: unknown) => [
      { type: 'table', columns: ['A'], rows: [[cell]] },
    ]
    expect(boardBlocksSchema.safeParse(table({ html: '<b>' })).success).toEqual(
      false,
    )
    expect(boardBlocksSchema.safeParse(table(7)).success).toEqual(false)
  })
})
