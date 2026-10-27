import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { ProjectEntry } from './entries'
import { controlMapRequest, resolveView } from './views'

const BRIDGE = ChainSpecificAddress(
  'eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
)
const INBOX = ChainSpecificAddress(
  'eth:0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f',
)
const ADMIN = ChainSpecificAddress(
  'eth:0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD',
)
const OWNER = ChainSpecificAddress(
  'eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A',
)
const COUNCIL = ChainSpecificAddress(
  'eth:0xF06E95eF589D9c38af242a8AAee8375f14023F85',
)
const TIMELOCK = ChainSpecificAddress(
  'eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49',
)
const VERIFIER = ChainSpecificAddress(
  'eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840',
)
const SCROLL_ADMIN = ChainSpecificAddress(
  'eth:0xEB803eb3F501998126bf37bB823646Ed3D59d072',
)
const SCROLL_OWNER = ChainSpecificAddress(
  'eth:0x798576400F7D662961BA15C6b3F3d813447a26a6',
)
const SCROLL_CHAIN = ChainSpecificAddress(
  'eth:0xa13BAF47339d63B743e7Da8741db5456DAc1E556',
)

const ENTRIES: ProjectEntry[] = [
  entry(BRIDGE, 'Bridge'),
  entry(INBOX, 'Inbox'),
  entry(ADMIN, 'ProxyAdmin'),
  // A multisig that upgrades the bridge at once, with the council signing.
  entry(OWNER, 'Owner', {
    signers: { threshold: 1, members: [COUNCIL] },
    receivedPermissions: [
      { permission: 'upgrade', from: BRIDGE, via: [{ address: ADMIN }] },
    ],
  }),
  entry(COUNCIL, 'Council', { signers: { threshold: 9, members: [] } }),
  // A timelock that upgrades the inbox after eight days.
  entry(TIMELOCK, 'Timelock', {
    receivedPermissions: [
      { permission: 'upgrade', from: INBOX, delay: 8 * 86_400 },
    ],
  }),
  entry(VERIFIER, 'Verifier'),
  // The model stops at a ProxyAdmin owned by a role based contract.
  entry(SCROLL_ADMIN, 'ScrollProxyAdmin', {
    controllers: [SCROLL_OWNER],
    directPermissions: [{ permission: 'upgrade', from: SCROLL_CHAIN }],
  }),
  entry(SCROLL_OWNER, 'ScrollOwner'),
  entry(SCROLL_CHAIN, 'ScrollChain'),
]

describe(resolveView.name, () => {
  it('resolves every list, keeps a contract in its first group and defaults to lanes', () => {
    const { view, matches } = resolveView(ENTRIES, {
      project: 'test',
      title: 'Groups',
      hide: ['name:Verifier'],
      groups: [
        { name: 'Bridge side', contracts: ['Bridge', 'Inbox'] },
        { name: 'Again', color: 'red', contracts: ['Bridge', 'Owner'] },
      ],
    })
    expect(view.hide).toEqual([VERIFIER])
    expect(view.groups).toEqual([
      { name: 'Bridge side', color: 7, members: [BRIDGE, INBOX] },
      { name: 'Again', color: 1, members: [OWNER] },
    ])
    expect(view.arrange).toEqual('lanes')
    expect(matches.find((m) => m.selector === 'name:Verifier')?.count).toEqual(
      1,
    )
  })

  it('names what a selector could have matched when it matched nothing', () => {
    const { matches } = resolveView(ENTRIES, {
      project: 'test',
      title: 'Types',
      hide: ['type:eoa'],
    })
    expect(matches).toEqual([
      {
        selector: 'type:eoa',
        count: 0,
        known: ['eoa', 'multisig', 'contract'],
      },
    ])
  })

  it('rejects colors and arrangements DiscoUI does not have', () => {
    const view = (spec: object) =>
      resolveView(ENTRIES, { project: 'test', title: 'x', ...spec })
    expect(() => view({ colors: [{ color: 'grey', contracts: [] }] })).toThrow(
      'Unknown color',
    )
    expect(() => view({ arrange: 'grid' })).toThrow('Unknown arrangement')
  })
})

describe(controlMapRequest.name, () => {
  it('makes one lane per fastest way to upgrade, fastest first', () => {
    const request = controlMapRequest(ENTRIES, 'test')
    expect(request.groups?.map((g) => [g.name, g.color, g.contracts])).toEqual([
      ['Owner (1/1) · no delay', 'red', [OWNER, COUNCIL, BRIDGE]],
      [
        'ScrollProxyAdmin, owned by ScrollOwner · no delay',
        'red',
        [SCROLL_ADMIN, SCROLL_CHAIN],
      ],
      ['Timelock · 8d', 'green', [TIMELOCK, INBOX]],
      [
        'Not upgradeable',
        'teal',
        [ADMIN, OWNER, COUNCIL, TIMELOCK, VERIFIER, SCROLL_ADMIN, SCROLL_OWNER],
      ],
    ])
  })

  it('leaves out what the researcher asked to hide', () => {
    const request = controlMapRequest(
      ENTRIES,
      'test',
      new Set([VERIFIER, INBOX]),
    )
    expect(request.only ?? []).not.toInclude(VERIFIER)
    expect((request.groups ?? []).map((g) => g.name)).not.toInclude(
      'Timelock · 8d',
    )
  })
})

function entry(
  address: ChainSpecificAddress,
  name: string,
  fields: Partial<ProjectEntry> = {},
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
