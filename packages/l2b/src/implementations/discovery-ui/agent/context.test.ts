import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import { expect } from 'earl'
import type { CodeSource } from './codeAnchor'
import { describeContext } from './context'
import type { AgentEntry } from './resolveRef'

// Describes what a tab reports against one contract with one source, the
// way the agent reads it.
const BRIDGE = ChainSpecificAddress(
  'eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
)
const ENTRIES: AgentEntry[] = [{ address: BRIDGE, name: 'Bridge' }]
const SOURCE = [
  'contract Bridge {',
  '  uint256 public total;',
  '  function deposit(uint256 amount) external {',
  '    total += amount;',
  '  }',
  '}',
].join('\n')
const SOURCES: CodeSource[] = [{ name: 'Bridge.sol', code: SOURCE }]
const read = () => SOURCES
const SOURCE_HASH = createHash('sha256').update(SOURCE).digest('hex')

describe(describeContext.name, () => {
  it('names the selected contracts, marking ones it does not know', () => {
    const outside = 'eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd'
    const lines = describeContext(
      { project: 'linea', selected: [BRIDGE, outside] },
      ENTRIES,
      read,
    )
    expect(lines).toEqual([
      'DiscoUI shows linea.',
      `  selected: ${BRIDGE} (Bridge), ${outside} (not in the project)`,
    ])
  })

  it('prints the function around the selection with its lines', () => {
    const from = SOURCE.indexOf('total += amount')
    const lines = describeContext(
      {
        project: 'linea',
        selected: [BRIDGE],
        code: {
          address: BRIDGE,
          sourceName: 'Bridge.sol',
          sourceHash: SOURCE_HASH,
          from,
          to: from + 'total += amount'.length,
        },
        note: { index: 1, stepCount: 3 },
      },
      ENTRIES,
      read,
    )
    expect(lines.slice(2)).toEqual([
      '  code: selected Bridge.sol:4-4 in Bridge',
      '```',
      [
        '3    function deposit(uint256 amount) external {',
        '4      total += amount;',
        '5    }',
      ].join('\n'),
      '```',
      '  note: step 2 of 3 of your last show',
    ])
  })

  it('says when the code changed since the tab showed it', () => {
    const lines = describeContext(
      {
        project: 'linea',
        selected: [],
        code: {
          address: BRIDGE,
          sourceName: 'Bridge.sol',
          // The tab shows an older text of the same length.
          sourceHash: createHash('sha256')
            .update(SOURCE.replace('total', 'TOTAL'))
            .digest('hex'),
          from: 0,
          to: 5,
        },
      },
      ENTRIES,
      read,
    )
    expect(lines.at(-1)).toEqual(
      '  code: Bridge.sol of Bridge, changed since shown',
    )
  })
})
