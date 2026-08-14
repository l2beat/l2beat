import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

// shared discovery with the deBridge messaging protocol (project 'debridge'):
// DLN is built on top of it and governed by the same actors
const discovery = new ProjectDiscovery('debridge')

const minConfirmations = discovery.getContractValue<number>(
  'SignatureVerifier',
  'minConfirmations',
)
const validatorCount = discovery.getContractValue<string[]>(
  'SignatureVerifier',
  'oracleAddresses',
).length
const fixedNativeFee =
  Number(
    discovery.getContractValue<number>('DlnSource', 'globalFixedNativeFee'),
  ) / 1e18
const transferFeeBps = discovery.getContractValue<number>(
  'DlnSource',
  'globalTransferFeeBps',
)
// chains with a currently configured (non-empty) DlnDestination routing entry
const activeDestinationChains = Object.values(
  discovery.getContractValue<Record<string, string>>(
    'DlnSource',
    'dlnDestinationAddressesMap',
  ),
).filter((address) => address !== '0x').length

// "a single EOA is simultaneously the admin of `DeBridgeIntentManager` and
// `DeBridgeAllowanceHolder` and the owner of the ProxyAdmin that can upgrade
// the intent manager"
const intentManagerAdmin = discovery.getContractValue<string[]>(
  'DeBridgeIntentManager',
  'defaultAdminAC',
)[0]
const allowanceHolderAdmin = discovery.getContractValue<string[]>(
  'DeBridgeAllowanceHolder',
  'defaultAdminAC',
)[0]
const intentManagerProxyAdminOwner = discovery.getContractValue<string>(
  discovery.getContractValue<string>('DeBridgeIntentManager', '$admin'),
  'owner',
)
assert(
  intentManagerAdmin === allowanceHolderAdmin &&
    intentManagerAdmin === intentManagerProxyAdminOwner,
  'The intent-manager admin setup changed: update detailedDescription.md',
)
// "Several satellite contracts (including the `ExternalCallExecutor`) have
// unverified source code"
assert(
  discovery.getContract('ExternalCallExecutor').unverified === true,
  'The ExternalCallExecutor is now verified: update detailedDescription.md',
)

export const debridgeDln: BaseProject = {
  id: ProjectId('debridge-dln'),
  slug: 'debridge-dln',
  name: 'Debridge DLN',
  shortName: undefined,
  addedAt: UnixTime(1768915493),
  interopConfig: {
    description:
      'Intent framework built on top of the deBridge messaging protocol. Maker funds are escrowed in the DlnSource contract on the source chain and released to takers on unlock messages attested by the deBridge validator set.',
    detailedDescription: readProjectMarkdown(
      'debridge-dln',
      'detailedDescription',
      {
        fixedNativeFee,
        transferFeeBps,
        activeDestinationChains,
        quorum: `${minConfirmations} of ${validatorCount}`,
        multisigStats: discovery.getMultisigStats('Admin Multisig'),
      },
    ),
    intent: {
      color: '#F97316',
      intentModel: {
        value: 'Intent framework',
        description: 'Users create orders that takers can fulfill.',
      },
      userRecovery: {
        value: 'Order cancellation',
        description: 'Unfilled orders can be cancelled through the DLN flow.',
      },
      solverAccess: {
        value: 'Permissionless',
        description: 'Order fulfillment is designed around independent takers.',
      },
      settlement: {
        value: 'deBridge messaging',
        description: 'Order state and settlement use deBridge infrastructure.',
      },
    },
    plugins: [
      {
        plugin: 'debridge-dln',
        bridgeType: 'nonMinting',
      },
    ],
    type: 'intent',
    permissions: generateDiscoveryDrivenPermissions([discovery]),
    contracts: {
      addresses: generateDiscoveryDrivenContracts([discovery]),
      risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    },
  },
}
