import { ProjectId, UnixTime, formatSeconds } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../discovery/ProjectDiscovery'
import type { DaBridge } from '../../../types'
import { DaCommitteeSecurityRisk, DaUpgradeabilityRisk } from '../common'
import { DaRelayerFailureRisk } from '../common/DaRelayerFailureRisk'

const discovery = new ProjectDiscovery('eigenda')

const EIGENUpgradeDelay = discovery.getContractValue<number>(
  'TimelockControllerOwning',
  'getMinDelay',
)

const quorumThresholds = discovery.getContractValue<string>(
  'EigenDAServiceManager',
  'quorumConfirmationThresholdPercentages',
)

const quorum1Threshold = parseInt(quorumThresholds.substring(2, 4), 16)
const quorum2Threshold = parseInt(quorumThresholds.substring(4, 6), 16)

const quorumAdversaryThresholds = discovery.getContractValue<string>(
  'EigenDAServiceManager',
  'quorumAdversaryThresholdPercentages',
)

const quorum1AdversaryThreshold = parseInt(
  quorumAdversaryThresholds.substring(2, 4),
  16,
)
const quorum2AdversaryThreshold = parseInt(
  quorumAdversaryThresholds.substring(4, 6),
  16,
)

const ejectionCooldown = discovery.getContractValue<number>(
  'RegistryCoordinator',
  'ejectionCooldown',
)

const ejectionRateLimitWindow = discovery.getContractValue<number[]>(
  'EjectionManager',
  'ejectionRateLimitWindow',
) // [0] for quorum 1. [1] for quorum 2.

const ejectableStakePercentParam = discovery.getContractValue<string>(
  'EjectionManager',
  'ejectableStakePercent',
)
const ejectableStakePercent = parseFloat(ejectableStakePercentParam) / 100

const operatorSetParamsQuorum1 = discovery.getContractValue<number[]>(
  'RegistryCoordinator',
  'operatorSetParamsQuorum1',
)

const operatorSetParamsQuorum2 = discovery.getContractValue<number[]>(
  'RegistryCoordinator',
  'operatorSetParamsQuorum2',
)

const totalNumberOfRegisteredOperators = discovery.getContractValue<string[]>(
  'RegistryCoordinator',
  'registeredOperators',
).length

export const eigenDAbridge: DaBridge = {
  id: ProjectId('eigenda'), // TODO: merge with main eigenda project
  addedAt: new UnixTime(1724426960), // 2024-08-23T15:29:20Z
  display: {
    name: 'ServiceManager',
    slug: 'bridge',
    description:
      'EigenDA DA attestations are bridged to Ethereum through the EigenDAServiceManager smart contract.',
  },
  contracts: {
    addresses: {
      ethereum: discovery.getDiscoveredContracts(),
    },
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'the bridge (EigenDAServiceManager) contract receives a malicious code upgrade. There is no delay on code upgrades.',
      },
      {
        category: 'Funds can be lost if',
        text: 'EigenLayer core contracts (DelegationManager, StrategyManager) receive a malicious code upgrade. There is no delay on code upgrades.',
      },
      {
        category: 'Funds can be lost if',
        text: `EigenLayer EIGEN token contract receives a malicious code upgrade. There is a ${formatSeconds(EIGENUpgradeDelay)} delay on code upgrades.`,
      },
      {
        category: 'Funds can be lost if',
        text: 'the churn approver or ejectors act maliciously and eject EigenDA operators from a quorum without cause.',
      },
      {
        category: 'Funds can be lost if',
        text: 'the bridge accepts an incorrect or malicious data commitment provided by node operators.',
      },
    ],
  },
  technology: {
    description: `
    ## Architecture

    ![EigenDA architecture once stored](/images/da-bridge-technology/eigenda/architecture1.png#center)

    The EigenDAServiceManager acts as a DA bridge smart contract verifying data availability claims from operators via signature verification.
    The checkSignatures() function checks that the signature of all signers plus non-signers is equal to the registered quorum aggregated public key from the BLS registry. The quorum aggregated public key gets updated every time an operator is registered.
    The bridge requires a threshold of signatures to be met before the data commitment is accepted. 
    To verify the threshold is met, the function takes the total stake at the reference block for the quorum from the StakeRegistry, and it subtracts the stake of non signers to get the signed stake.
    Finally, it checks that the signed stake over the total stake is more than the required stake threshold.

    ![EigenDA bridge architecture](/images/da-bridge-technology/eigenda/architecture2.png#center)

    Although thresholds are not enforced onchain by the confirmBatch method, the minimum thresholds that the disperser would need to reach before relaying the batch commitment to Ethereum are set to ${quorum1Threshold}% of the registered stake for the ETH quorum and ${quorum2Threshold}% for the EIGEN token quorum. Meeting these dispersal thresholds allows the system to tolerate up to ${quorum1AdversaryThreshold}% (quorum 1) and ${quorum2AdversaryThreshold}% (quorum 2) of the total stake being adversarial, achieving this with approximately 4.5 data redundancy.  
    The quorum thresholds are set on the EigenDAServiceManager contract and can be changed by the contract owner.
    There is a maximum of ${operatorSetParamsQuorum1[0]} operators that can register for the ETH quorum and ${operatorSetParamsQuorum2[0]} for the EIGEN token quorum. Once the cap is reached, new operators must have 10% more weight than the lowest-weighted operator to join the active set. Entering the quorum is subject to the approval of the churn approver. Operators can be ejected from a quorum by the ejectors without delay should they violate the Service Legal Agreement (SLA). \n

    Ejectors can eject maximum ${ejectableStakePercent}% of the total stake in a ${formatSeconds(ejectionRateLimitWindow[0])} window for the ETH quorum, and the same stake percentage over a ${formatSeconds(ejectionRateLimitWindow[1])} window for the EIGEN quorum.
    An ejected operator can rejoin the quorum after ${formatSeconds(ejectionCooldown)}. 
  `,
    references: [
      {
        title: 'EigenDA Registry Coordinator - Etherscan',
        url: 'https://etherscan.io/address/0xdcabf0be991d4609096cce316df08d091356e03f',
      },
      {
        title: 'EigenDA Service Manager - Etherscan',
        url: 'https://etherscan.io/address/0x58fDE694Db83e589ABb21A6Fe66cb20Ce5554a07',
      },
    ],
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'the relayer posts an invalid commitment and EigenDA operators do not make the data available for verification.',
      },
      {
        category: 'Funds can be frozen if',
        text: 'excluding L2-specific DA fallback - the permissioned relayers are unable to submit DA commitments to the bridge contract.',
      },
      {
        category: 'Funds can be frozen if',
        text: 'the bridge (EigenDAServiceManager) contract is paused by the pausers.',
      },
    ],
  },
  permissions: {
    ethereum: discovery.getDiscoveredPermissions(),
  },
  dac: {
    requiredMembers: 0, // currently 0 since threshold is not enforced
    membersCount: 400, // max allowed operators (quorum 1 + quorum 2)
  },
  usedIn: [],
  risks: {
    committeeSecurity: DaCommitteeSecurityRisk.LimitedCommitteeSecurity(
      'Permissioned',
      undefined,
      totalNumberOfRegisteredOperators,
    ),
    upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(0),
    relayerFailure: DaRelayerFailureRisk.NoMechanism,
  },
}
