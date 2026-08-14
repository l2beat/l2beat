import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('debridge')

const minConfirmations = discovery.getContractValue<number>(
  'SignatureVerifier',
  'minConfirmations',
)
const validatorCount = discovery.getContractValue<string[]>(
  'SignatureVerifier',
  'oracleAddresses',
).length
const excessConfirmations = discovery.getContractValue<number>(
  'SignatureVerifier',
  'excessConfirmations',
)
const fixedNativeFee =
  Number(
    discovery.getContractValue<number>('DeBridgeGate', 'globalFixedNativeFee'),
  ) / 1e18
const transferFeeBps = discovery.getContractValue<number>(
  'DeBridgeGate',
  'globalTransferFeeBps',
)

// "every validator flagged as *required* has signed (currently none is flagged)"
assert(
  discovery.getContractValue<number>(
    'SignatureVerifier',
    'requiredOraclesCount',
  ) === 0,
  'Required validators are now flagged in the SignatureVerifier: update detailedDescription.md',
)
// "both elevated thresholds are set to N signatures — below the baseline
// quorum — so neither mechanism has any effect"
assert(
  discovery.getContractValue<number>('DeBridgeGate', 'excessConfirmations') ===
    excessConfirmations && excessConfirmations <= minConfirmations,
  'The elevated signature thresholds changed and may now be effective: update detailedDescription.md',
)
// "a `feeContractUpdater` slot that can adjust the flat protocol fee
// automatically (unset on Ethereum)"
assert(
  discovery.getContractValue<string>('DeBridgeGate', 'feeContractUpdater') ===
    'eth:0x0000000000000000000000000000000000000000',
  'The feeContractUpdater is now set on Ethereum: update detailedDescription.md',
)

export const debridge: BaseProject = {
  id: ProjectId('debridge'),
  slug: 'debridge',
  name: 'deBridge',
  shortName: undefined,
  addedAt: UnixTime(1673362295),
  // this is only the debridge messaging and token bridge
  interopConfig: {
    description: `deBridge is a message bridge and lock-and-mint token bridge. Cross-chain submissions are authorized by ECDSA signatures from a fixed validator set (${minConfirmations}-of-${validatorCount} on Ethereum) verified onchain; all core contracts are upgradable by a deBridge multisig without delay.`,
    detailedDescription: readProjectMarkdown(
      'debridge',
      'detailedDescription',
      {
        fixedNativeFee,
        transferFeeBps,
        quorum: `${minConfirmations} of ${validatorCount}`,
        excessConfirmations,
        minConfirmations,
        multisigStats: discovery.getMultisigStats('Admin Multisig'),
      },
    ),
    name: 'deBridge',
    plugins: [
      {
        plugin: 'debridge',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'other',
    permissions: generateDiscoveryDrivenPermissions([discovery]),
    contracts: {
      addresses: generateDiscoveryDrivenContracts([discovery]),
      risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    },
  },
}
