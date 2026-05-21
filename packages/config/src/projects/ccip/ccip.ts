import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import type { BaseProject } from '../../types'

const discovery = new ProjectDiscovery('ccip')

const ocrCommitN = discovery.getContractValue(
  'EthereumOffRamp_v1_6',
  'ocrCommitN',
)
const ocrCommitF = discovery.getContractValue(
  'EthereumOffRamp_v1_6',
  'ocrCommitF',
)

const permissionLessExecutionThresholdFmt = discovery.getContractValue(
  'EthereumOffRamp_v1_6',
  'permissionLessExecutionThresholdFmt',
)

export const ccip: BaseProject = {
  id: ProjectId('ccip'),
  slug: 'ccip',
  name: 'Chainlink CCIP',
  shortName: 'CCIP',
  addedAt: UnixTime(1769526436),
  interopConfig: {
    description:
      "Multichain token framework using the CCIP messaging protocol, validated by Chainlink's offchain reporting (OCR) and 'decentralised oracle network' (DON).",
    detailedDescription: `
    # v1.6 Architecture
    All crosschain messages in Chainlink CCIP are validated and signed by a fixed signer set (OCR), currently equivalent to a ${ocrCommitF}/${ocrCommitN} multisig. The router is the main entrypoint of the system, used to send message to other chains or receive them.
\n\n
    Outgoing messages go through an "OnRamp" contract, which is tasked to perform fee estimation through a "FeeQuoter" contract, and fetch the proper token pool to ultimately redirect funds to through a "TokenAdminRegistry" contract. The pool either locks or burns the funds, depending on the specific pool contract logic. The OnRamp might also enable "filterers" to exclude the relaying of messages based on sender or content.
\n\n
    Incoming messages go through an "OffRamp" contract, which checks whether they have been validated by the OCR set. Tokens are then either released or minted from the proper pool, depending on the specific pool contract logic. Standard non-token messages go through the main Router first before the external call is actually performed. Messages can only be executed by a set of permissioned "transmitters" within ${permissionLessExecutionThresholdFmt}, otherwise anyone can do it.

    # OCR set updates
    The OCR set corresponds to a ${ocrCommitF}/${ocrCommitN} multisig. The owner of the OffRamp can arbitrarily update the threshold and signers set used to validate messages, so trust in this permissioned actor is required. The actual permission structure behind this role is complex, see the Permission section for more details.

    # Fee estimation
    The FeeQuoter contract holds configuration for each destination chain such that whether the route is enabled, maximum message size, gas overheads, DA cost multipliers, default fee, min fee, network fee, gas multipliers etc. It also stores token prices and other chain gas prices to properly estimate fees. A whitelist of address is permissioned to update such prices.

    # Cursing
    The Risk Management Network (RMN) is a contract that allows to blacklist either all paths with a universal "curse" or specific paths with more targeted curses. The RMN is represented by its own timelock and set of multisigs that can either propose, cancel, or immediately execute, bypassing any delay. The network can both block incoming and outgoing messages concerning all or specific chains. See permission section for more details.

    # v1.5 Architecture
    While in v1.6 many source and destination chains can use share the same OnRamp and OffRamp, in v1.5 there is one OnRamp and one OffRamp for each active path. The current analysis only covers v1.6, but token pools can accept incoming messages from both v1.5 and v1.6 OffRamps at the same time. A complete risk assessment for a token requires looking into all OffRamps.`,
    plugins: [
      {
        plugin: 'ccip',
        bridgeType: 'lockAndMint',
      },
      {
        plugin: 'ccip',
        bridgeType: 'burnAndMint',
      },
      {
        plugin: 'ccip',
        bridgeType: 'nonMinting',
      },
    ],
    type: 'multichain',
    permissions: generateDiscoveryDrivenPermissions([discovery]),
    contracts: {
      addresses: generateDiscoveryDrivenContracts([discovery]),
      risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    },
  },
}
