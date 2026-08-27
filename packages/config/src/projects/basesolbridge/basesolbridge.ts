import { assert, formatSeconds, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('basesolbridge')

const baseThreshold = discovery.getContractValue<number>(
  'BridgeValidator',
  'getBaseThreshold',
)
const baseValidatorCount = discovery.getContractValue<number>(
  'BridgeValidator',
  'getBaseValidatorCount',
)
const partnerThreshold = discovery.getContractValue<number>(
  'BridgeValidator',
  'partnerValidatorThreshold',
)
const partnerSignerCount = discovery.getContractValue<number>(
  'SignerRegistry',
  'getSignerCount',
)
const guardianCount = discovery.getContractValue<string[]>(
  'Bridge',
  'guardians',
).length
const timelockDelay = formatSeconds(
  discovery.getContractValue<number>('RBACTimelock', 'getMinDelay'),
)

// "both signature quorums must be met": a partner threshold of 0 would
// disable the partner validator check in BridgeValidator entirely
assert(
  partnerThreshold > 0,
  'The partner validator quorum is disabled: update detailedDescription.md',
)

// "A single EOA is simultaneously the admin of the Bridge proxy, the owner
// of the Bridge, and the owner of both beacons"
const bridgeOwner = discovery.getAddressFromValue('Bridge', 'owner')
assert(
  bridgeOwner === discovery.getAddressFromValue('Bridge', '$admin') &&
    bridgeOwner === discovery.getAddressFromValue('TwinBeacon', 'owner') &&
    bridgeOwner ===
      discovery.getAddressFromValue('CrossChainERC20Beacon', 'owner') &&
    discovery.isEOA(bridgeOwner),
  'The owner/upgrade-admin setup changed: update detailedDescription.md and the description',
)

// "The BridgeValidator and CrossChainERC20Factory proxies have no admin and
// cannot be upgraded" (also backs the fixed-validator-set claim)
const ZERO = 'base:0x0000000000000000000000000000000000000000'
assert(
  discovery.getContractValue('BridgeValidator', '$admin') === ZERO &&
    discovery.getContractValue('CrossChainERC20Factory', '$admin') === ZERO,
  'The BridgeValidator or CrossChainERC20Factory gained a proxy admin: update detailedDescription.md',
)

export const basesolbridge: BaseProject = {
  id: ProjectId('basesolbridge'),
  slug: 'basesolbridge',
  name: 'Base Solana Bridge',
  shortName: undefined,
  addedAt: UnixTime(1787816042),
  interopConfig: {
    description: `Base's native lock-and-mint token and message bridge between Base and Solana. Messages from Solana are verified on Base solely by signatures: ${baseThreshold}-of-${baseValidatorCount} Base validators plus ${partnerThreshold}-of-${partnerSignerCount} partner signers managed by Chainlink's CCIP governance. The bridge escrow, all wrapped tokens and all Twin accounts are upgradable by a single EOA without delay.`,
    detailedDescription: readProjectMarkdown(
      'basesolbridge',
      'detailedDescription',
      {
        baseQuorum: `${baseThreshold} of ${baseValidatorCount}`,
        partnerQuorum: `${partnerThreshold} of ${partnerSignerCount}`,
        guardianCount,
        timelockDelay,
      },
    ),
    plugins: [
      {
        plugin: 'basesolbridge',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'canonical',
    // one-sided tracking: the Solana side is not a captured event source,
    // so transfer durations cannot be measured
    transfersTimeMode: 'unknown',
    permissions: generateDiscoveryDrivenPermissions([discovery]),
    contracts: {
      addresses: generateDiscoveryDrivenContracts([discovery]),
      risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    },
  },
}
