import type { EntryParameters } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describePermissions, formatDelay } from './permissions'

// A council multisig upgrades the bridge through a timelock and a proxy
// admin, the shape most permission answers have.
const BRIDGE = ChainSpecificAddress(
  'eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
)
const ADMIN = ChainSpecificAddress(
  'eth:0x875573B973F7E9Ca54eb34a59180C70eE1128208',
)
const TIMELOCK = ChainSpecificAddress(
  'eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840',
)
const COUNCIL = ChainSpecificAddress(
  'eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd',
)
const ENTRIES = [
  { type: 'Contract', address: BRIDGE, name: 'Bridge' },
  {
    type: 'Contract',
    address: ADMIN,
    name: 'ProxyAdmin',
    directlyReceivedPermissions: [{ permission: 'upgrade', from: BRIDGE }],
  },
  { type: 'Contract', address: TIMELOCK, name: 'Timelock' },
  {
    type: 'Contract',
    address: COUNCIL,
    name: 'Council',
    values: { $threshold: 9, $members: Array(12).fill(BRIDGE) },
    receivedPermissions: [
      {
        permission: 'upgrade',
        from: BRIDGE,
        delay: 259_200,
        description: 'upgrade the bridge.',
        // From the target's side, as the model stores it.
        via: [{ address: ADMIN }, { address: TIMELOCK, delay: 259_200 }],
      },
    ],
  },
] as unknown as EntryParameters[]

describe(describePermissions.name, () => {
  it('lists the ultimate holder with its route and the direct grant', () => {
    expect(describePermissions(ENTRIES, BRIDGE).slice(0, 6)).toEqual([
      `Permissions on ${BRIDGE} (Bridge):`,
      '',
      'Ultimately held by (holder first, through each via):',
      `  upgrade: ${COUNCIL} (Council, 9/12 multisig), via ${TIMELOCK} (Timelock) +3d -> ${ADMIN} (ProxyAdmin), delay 3d. upgrade the bridge.`,
      '',
      'Granted directly to:',
    ])
  })

  it('says when nothing is modelled on a contract', () => {
    expect(describePermissions(ENTRIES, COUNCIL)).toEqual([
      `No permissions are modelled on ${COUNCIL} (Council, 9/12 multisig).`,
    ])
  })
})

describe(formatDelay.name, () => {
  it('prints days down to seconds, skipping zero units', () => {
    expect(formatDelay(691_200)).toEqual('8d')
    expect(formatDelay(90_061)).toEqual('1d 1h 1m 1s')
    expect(formatDelay(0)).toEqual('0s')
  })
})
