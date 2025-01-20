import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../../../discovery/ProjectDiscovery'
import { DaCommitteeSecurityRisk } from '../../../../types/DaCommitteeSecurityRisk'
import { DaRelayerFailureRisk } from '../../../../types/DaRelayerFailureRisk'
import { DaUpgradeabilityRisk } from '../../../../types/DaUpgradeabilityRisk'
import { CELESTIA_BLOBSTREAM } from './template'

const ethereumDiscovery = new ProjectDiscovery('blobstream')
const arbitrumDiscovery = new ProjectDiscovery('blobstream', 'arbitrum')
const baseDiscovery = new ProjectDiscovery('blobstream', 'base')

const ethereumUpdateInterval = 4 // hours
const arbitrumUpdateInterval = 1 // hours
const baseUpdateInterval = 1 // hours

export const SP1Blobstream = CELESTIA_BLOBSTREAM({
  createdAt: new UnixTime(1729253328), // 2024-10-18T12:08:48Z
  usedIn: [
    {
      id: ProjectId('rari'),
      name: 'RARI Chain',
      slug: 'rari',
    },
  ],
  display: {
    links: {
      websites: [],
      documentation: ['https://docs.celestia.org/developers/blobstream'],
      repositories: ['https://github.com/succinctlabs/sp1-blobstream'],
      apps: [],
      explorers: ['https://etherscan.io/'],
      socialMedia: [],
    },
  },

  technology: {
    description: `

    ## Architecture
      
    ![Celestia blobstream architecture](/images/da-bridge-technology/celestia/blobstream/architecture.png#center)
    
     The Blobstream bridge is a data availability bridge that facilitates data availability commitments to be bridged between Celestia and Ethereum.
     The Blobstream bridge is composed of three main components: the **Blobstream** contract, the **Succinct Gateway** contracts, and the **Verifier** contracts.  <br /> 
     By default, Blobstream operates asynchronously, handling requests in a fulfillment-based manner. First, zero-knowledge proofs of Celestia block ranges are requested for proving. Requests can be submitted either off-chain through the Succinct API, or onchain through the requestCall() method of the Succinct Gateway smart contract.
     Alternatively, it is possible to run an SP1 Blobstream operator with local proving, allowing for self-generating the proofs.
     Once a proving request is received, the off-chain prover generates the proof and relays it to Blobstream contract. The Blobstream contract verifies the proof with the corresponding verifier contract and, if successful, stores the data commitment in storage. <br /> 

     Verifying a header range includes verifying tendermint consensus (header signatures are 2/3 of stake) and verifying the data commitment root.
      By default, Blobstream on Ethereum is updated by the Succinct operator at a regular cadence of ${ethereumUpdateInterval} hour.
      For Blobstream on Arbitrum, the update interval is ${arbitrumUpdateInterval} hour, and for Blobstream on Base, the update interval is ${baseUpdateInterval} hour.
    `,
    references: [
      {
        text: 'SP1 Blobstream Operator',
        href: 'https://github.com/succinctlabs/sp1-blobstream/blob/b35c92bfcfc9a1711ea014cc871d6dd610dd5392/script/bin/operator.rs',
      },
      {
        text: 'Succinct Gateway - Etherscan',
        href: 'https://etherscan.io/address/0x6c7a05e0AE641c6559fD76ac56641778B6eCd776#code#F1#L148',
      },
    ],
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'the DA bridge accepts an incorrect or malicious data commitment provided by 2/3 of Celestia validators.',
      },
      {
        category: 'Funds can be frozen if',
        text: 'excluding L2-specific DA fallback - the permissioned relayers are unable to submit DA commitments to the Blobstream contract.',
      },
    ],
  },
  contracts: {
    addresses: {
      ethereum: ethereumDiscovery.getDiscoveredContracts(),
      arbitrum: arbitrumDiscovery.getDiscoveredContracts(),
      base: baseDiscovery.getDiscoveredContracts(),
    },
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'the bridge contract or its dependencies receive a malicious code upgrade. There is no delay on code upgrades.',
      },
      {
        category: 'Funds can be frozen if',
        text: 'the bridge contract is frozen by the Guardian (BlobstreamMultisig).',
      },
    ],
  },
  permissions: {
    ethereum: ethereumDiscovery.getDiscoveredPermissions(),
    arbitrum: arbitrumDiscovery.getDiscoveredPermissions(),
    base: baseDiscovery.getDiscoveredPermissions(),
  },
  risks: {
    committeeSecurity:
      DaCommitteeSecurityRisk.RobustAndDiverseCommittee('Validator set'),
    upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(0), // TIMELOCK_ROLE is 4/6 multisig
    relayerFailure: DaRelayerFailureRisk.NoMechanism,
  },
})
