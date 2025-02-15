import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../discovery/ProjectDiscovery'
import type { BaseProject } from '../../../types'
import { DaCommitteeSecurityRisk } from '../common'
import { DaRelayerFailureRisk } from '../common/DaRelayerFailureRisk'
import { DaUpgradeabilityRisk } from '../common/DaUpgradeabilityRisk'
import { linkByDA } from '../common/linkByDA'

const discovery = new ProjectDiscovery('vector')

export const vector: BaseProject = {
  id: ProjectId('vector'),
  slug: 'vector',
  name: 'Vector',
  shortName: undefined,
  addedAt: new UnixTime(1725372159), // 2024-09-03T14:02:39Z
  // data
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    isUnderReview: false,
    isUnverified: false,
  },
  display: {
    description: `Vector is a data availability bridge using Zero-Knowledge proofs to verify Avail data availability attestations on Ethereum.`,
    links: {
      documentation: ['https://docs.succinct.xyz/'],
      repositories: ['https://github.com/succinctlabs/sp1-vector'],
    },
  },
  daBridge: {
    name: 'Vector',
    daLayer: ProjectId('avail'),
    technology: {
      description: ` 
      ## Architecture
        
      ![Avail vector architecture](/images/da-bridge-technology/avail/vector/architecture.png#center)
      
       The Vector bridge is a data availability bridge that facilitates data availability commitments to be bridged between Avail and Ethereum.
       The SP1 Vector bridge is composed of three main components: the **Vector** contract, the **Succinct Gateway** contracts, and the **Verifier** contracts.  <br /> 
       By default, Vector operates asynchronously, handling requests in a fulfillment-based manner. First, zero-knowledge proofs of Avail block ranges are requested for proving. Requests can be submitted either off-chain through the Succinct API, or onchain through the requestCall() method of the Succinct Gateway smart contract.
       Alternatively, it is possible to run an SP1 Vector operator with local proving, allowing for self-generating the proofs.
       Once a proving request is received, the off-chain prover generates the proof and relays it to the Vector contract. The Vector contract verifies the proof with the corresponding verifier contract and, if successful, stores the data commitment in storage. <br /> 
  
      By default, Vector on Ethereum is updated by the Succinct operator at a cadence of approximately 1.5 hours.
      `,
      references: [
        {
          title: 'SP1 Vector Operator',
          url: 'https://github.com/succinctlabs/sp1-vector/blob/a9689768ff4052e0933cc575b79001d4bcfa0cd5/script/bin/operator.rs',
        },
        {
          title: 'Succinct Gateway - Etherscan',
          url: 'https://etherscan.io/address/0x6c7a05e0AE641c6559fD76ac56641778B6eCd776#code#F1#L148',
        },
      ],
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the DA bridge accepts an incorrect or malicious data commitment provided by 2/3 of Avail validators.',
        },
        {
          category: 'Funds can be frozen if',
          text: 'excluding L2-specific DA fallback - the permissioned relayers are unable to submit DA commitments to the Vector contract.',
        },
      ],
    },
    usedIn: linkByDA({
      layer: ProjectId('avail'),
      bridge: ProjectId('vector'),
    }),
    risks: {
      committeeSecurity:
        DaCommitteeSecurityRisk.RobustAndDiverseCommittee('Validator set'),
      upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(), // 4/7 multisig w/ no delay
      relayerFailure: DaRelayerFailureRisk.NoMechanism,
    },
  },
  contracts: {
    addresses: {
      ethereum: discovery.getDiscoveredContracts(),
    },
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'the bridge contract or its dependencies receive a malicious code upgrade. There is no delay on code upgrades.',
      },
      {
        category: 'Funds can be frozen if',
        text: 'the bridge contract is frozen by the Guardian (AvailMultisig).',
      },
    ],
  },
  permissions: {
    ethereum: discovery.getDiscoveredPermissions(),
  },
}
