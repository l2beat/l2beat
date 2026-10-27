import type { ReceivedPermission } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { ProjectEntry } from './entries'
import { matchesGlob, SelectorResolver } from './selectors'

const BRIDGE = ChainSpecificAddress(
  'eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
)
const ESCROW = ChainSpecificAddress(
  'eth:0x0F25c1DC2a9922304f2eac71DCa9B07E310e8E5a',
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
const SIGNER = ChainSpecificAddress(
  'eth:0x875573B973F7E9Ca54eb34a59180C70eE1128208',
)
const L2_TOKEN = ChainSpecificAddress(
  'arb1:0x912CE59144191C1204E64559FE8253a0e49E6548',
)

const upgrade = (from: ChainSpecificAddress): ReceivedPermission => ({
  permission: 'upgrade',
  from,
  via: [{ address: ADMIN }],
})

// The owner, a multisig the council signs for, upgrades the bridge through
// the admin.
const ENTRIES: ProjectEntry[] = [
  entry(BRIDGE, 'Bridge', {
    template: 'orbitstack/Bridge',
    category: 'Canonical Bridges',
  }),
  entry(ESCROW, 'wstETHEscrow', { category: 'External Bridges' }),
  entry(ADMIN, 'ProxyAdmin', { template: 'global/ProxyAdmin' }),
  entry(OWNER, 'Owner', {
    signers: { threshold: 2, members: [COUNCIL, SIGNER] },
    receivedPermissions: [upgrade(BRIDGE)],
  }),
  entry(COUNCIL, 'Security Council', {
    signers: { threshold: 1, members: [SIGNER] },
  }),
  entry(SIGNER, undefined, { isEOA: true }),
  entry(L2_TOKEN, 'L2Token', {}),
]

describe(SelectorResolver.name, () => {
  const resolver = new SelectorResolver(ENTRIES)

  it('resolves contracts, globs and kinds, any case', () => {
    expect(resolver.resolve('Bridge')).toEqual([BRIDGE])
    expect(resolver.resolve('name:*escrow*')).toEqual([ESCROW])
    expect(resolver.resolve('template:orbitstack/*')).toEqual([BRIDGE])
    expect(resolver.resolve('category:*Bridges')).toEqual([BRIDGE, ESCROW])
    expect(resolver.resolve('type:EOA')).toEqual([SIGNER])
    expect(resolver.resolve('type:multisig')).toEqual([OWNER, COUNCIL])
    expect(resolver.resolve('chain:arb1')).toEqual([L2_TOKEN])
    expect(resolver.resolve('all').length).toEqual(ENTRIES.length)
  })

  it('credits everyone on a control path and everyone who signs for its holder', () => {
    expect(resolver.resolve('upgradeableBy:Owner')).toEqual([BRIDGE])
    expect(resolver.resolve('upgradeableBy:ProxyAdmin')).toEqual([BRIDGE])
    expect(resolver.resolve('upgradeableBy:Security Council')).toEqual([BRIDGE])
    expect(resolver.resolve(`controlledBy:${SIGNER}`)).toEqual([BRIDGE])
    expect(resolver.resolve('upgradeableBy:Bridge')).toEqual([])
  })

  it('lists the values a selector could have matched', () => {
    expect(resolver.knownValues('category:core')).toEqual([
      'Canonical Bridges',
      'External Bridges',
    ])
    expect(resolver.knownValues('name:x')).toEqual([])
  })

  it('rejects an unknown type with the ones that exist', () => {
    expect(() => resolver.resolve('type:robot')).toThrow('Unknown type')
  })
})

describe(matchesGlob.name, () => {
  it('matches * anywhere, ignoring case', () => {
    expect(matchesGlob('L1ERC20Gateway', '*gateway')).toEqual(true)
    expect(matchesGlob('L1ERC20Gateway', 'L1*20*')).toEqual(true)
    expect(matchesGlob('Gateway', '*Gate*way*')).toEqual(true)
    expect(matchesGlob('Bridge', 'Bridg')).toEqual(false)
    expect(matchesGlob('ab', 'a*b*b')).toEqual(false)
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
