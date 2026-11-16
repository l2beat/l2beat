import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { ApiAgentGraph, ApiAgentLayout } from '../types'
import { describeGraph, describeLayout, resolveLanes } from './nodeView'
import type { AgentEntry } from './resolveRef'
import { ToolError } from './toolError'

const BRIDGE = ChainSpecificAddress(
  'eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
)
const INBOX = ChainSpecificAddress(
  'eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840',
)
const ADMIN = ChainSpecificAddress(
  'eth:0x6B175474E89094C44Da98b954EedeAC495271d0F',
)
const UNNAMED = ChainSpecificAddress(
  'eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
)
const ENTRIES: AgentEntry[] = [
  { address: BRIDGE, name: 'Bridge' },
  { address: INBOX, name: 'Inbox' },
  { address: ADMIN, name: 'ProxyAdmin' },
  { address: UNNAMED, name: undefined },
]

describe(resolveLanes.name, () => {
  it('turns the refs of every column into addresses, in order', () => {
    const lanes = resolveLanes(ENTRIES, [
      { columns: [['Bridge'], ['Inbox', UNNAMED]] },
      { columns: [['ProxyAdmin']] },
    ])
    expect(lanes).toEqual([[[BRIDGE], [INBOX, UNNAMED]], [[ADMIN]]])
  })

  it('refuses a contract named twice, saying where', () => {
    const error = catchToolError(() =>
      resolveLanes(ENTRIES, [{ columns: [['Bridge'], [BRIDGE]] }]),
    )
    expect(error.message).toEqual('Contract named twice')
    expect(error.details).toEqual({
      at: 'lanes[0].columns[1]',
      ref: BRIDGE,
      'same contract as': 'Bridge',
    })
  })

  it('says which column holds a name it cannot find', () => {
    const error = catchToolError(() =>
      resolveLanes(ENTRIES, [
        { columns: [['Bridge']] },
        { columns: [['Inbx']] },
      ]),
    )
    expect(error.message).toEqual('No contract with this name')
    expect(error.details.at).toEqual('lanes[1].columns[0]')
  })
})

describe(describeGraph.name, () => {
  const graph: Extract<ApiAgentGraph, { status: 'loaded' }> = {
    status: 'loaded',
    items: [
      { id: BRIDGE, name: 'Bridge', x: 10.4, y: -20.6, width: 200, height: 86 },
      {
        id: 'group:1',
        name: 'Admins',
        x: 300,
        y: 0,
        width: 248,
        height: 140,
        members: [ADMIN, UNNAMED],
      },
      { id: INBOX, name: 'Inbox', x: 600, y: 0, width: 200, height: 50 },
    ],
    links: [
      [0, 2, 'inbox'],
      [0, 2, 'allowedInboxes'],
      [0, 1, 'admin'],
      [0, 2, 'sequencerInbox'],
      [0, 2, 'delayedInbox'],
      [1, 0, 'upgradeable'],
    ],
    hidden: [{ id: UNNAMED, name: 'eth:0xA0b8…eB48' }],
  }

  it('prints each item with its box and its links grouped by target', () => {
    const lines = describeGraph('linea', graph, ENTRIES, 10_000)
    expect(lines).toEqual([
      'linea node view: 3 drawn, 1 hidden, 6 links. Positions are x,y w×h in canvas pixels.',
      [
        'Bridge at 10,-21 200×86',
        '  → Inbox (inbox, allowedInboxes, sequencerInbox, +1), Admins (admin)',
        `group "Admins" at 300,0 248×140: ProxyAdmin, ${UNNAMED}`,
        '  → Bridge (upgradeable)',
        'Inbox at 600,0 200×50',
        `Hidden: ${UNNAMED}`,
      ].join('\n'),
    ])
  })

  it('cuts at the limit and says so', () => {
    const lines = describeGraph('linea', graph, ENTRIES, 60)
    expect(lines.at(-1)).toEqual(
      '(cut at the size limit, the rest is not listed)',
    )
    expect((lines[1] ?? '').length <= 60).toEqual(true)
  })
})

describe(describeLayout.name, () => {
  const layout: Extract<ApiAgentLayout, { status: 'arranged' }> = {
    status: 'arranged',
    placed: [BRIDGE, INBOX],
    below: [{ id: 'group:1', name: 'Admins' }],
    notDrawn: [ADMIN],
  }

  it('names what went below and what is not drawn', () => {
    const text = describeLayout(
      { project: 'linea', laneCount: 1, hideOthers: false },
      layout,
      ENTRIES,
      10_000,
    ).join('\n')
    expect(text).toInclude('Lanes: 1, items placed: 2.')
    expect(text).toInclude('Arranged automatically below the lanes: Admins.')
    expect(text).toInclude('Not drawn, so not placed: ProxyAdmin.')
    expect(text).toInclude('one undo')
  })

  // Names that repeat must come back as refs resolveRef takes: chain:Name
  // while that is unique, else the address.
  it('prints repeated names as refs that resolve', () => {
    const l2Safe = ChainSpecificAddress(
      'arb1:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
    )
    const entries: AgentEntry[] = [
      { address: BRIDGE, name: 'Safe' },
      { address: INBOX, name: 'Safe' },
      { address: l2Safe, name: 'Safe' },
    ]
    const text = describeLayout(
      { project: 'linea', laneCount: 1, hideOthers: false },
      {
        status: 'arranged',
        placed: [],
        below: [
          { id: BRIDGE, name: 'Safe' },
          { id: l2Safe, name: 'Safe' },
        ],
        notDrawn: [],
      },
      entries,
      10_000,
    ).join('\n')
    expect(text).toInclude(`below the lanes: ${BRIDGE} (Safe), arb1:Safe.`)
  })

  it('counts a long list of kept items instead of naming them', () => {
    const below = Array.from({ length: 31 }, (_, index) => ({
      id: `group:${index}`,
      name: `Group ${index}`,
    }))
    const text = describeLayout(
      { project: 'linea', laneCount: 1, hideOthers: false },
      { status: 'arranged', placed: [BRIDGE], below, notDrawn: [] },
      ENTRIES,
      10_000,
    ).join('\n')
    expect(text).toInclude('The 31 drawn items the lanes do not name')
    expect(text).not.toInclude('Group 3')
  })

  it('says why hiding the others left some drawn and took some away', () => {
    const text = describeLayout(
      { project: 'linea', laneCount: 1, hideOthers: true },
      layout,
      ENTRIES,
      10_000,
    ).join('\n')
    expect(text).toInclude('Could not be hidden, so arranged below the lanes')
    expect(text).toInclude('initial contracts and contracts nothing links to')
    expect(text).toInclude('name one that links to them')
  })
})

function catchToolError(run: () => unknown): ToolError {
  try {
    run()
  } catch (error) {
    if (error instanceof ToolError) {
      return error
    }
    throw error
  }
  throw new Error('Expected a ToolError')
}
