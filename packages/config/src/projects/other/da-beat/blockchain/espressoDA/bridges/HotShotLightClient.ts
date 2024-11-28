import { ChainId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../../../../../discovery/ProjectDiscovery'
import { DaCommitteeSecurityRisk } from '../../../types'
import { DaBridge } from '../../../types/DaBridge'
import { DaRelayerFailureRisk } from '../../../types/DaRelayerFailureRisk'
import { DaUpgradeabilityRisk } from '../../../types/DaUpgradeabilityRisk'
import { DacTransactionDataType } from '../../../types/DacTransactionDataType'

const discovery = new ProjectDiscovery('espresso')
const updateInterval = 12 // hours

export const HotShotLightClient = {
  id: 'HotShotLightClient',
  createdAt: new UnixTime(1725372159), // 2024-09-03T14:02:39Z
  type: 'DAC',
  chain: ChainId.ETHEREUM,
  display: {
    name: 'HotShot Light Client',
    slug: 'hotshot',
    description: `The HotShot Light Client is a data availability bridge using Zero-Knowledge proofs to verify Espresso HotShot data availability attestations on Ethereum.`,
    links: {
      websites: [],
      documentation: [
        'https://docs.espressosys.com/network/espresso-architecture/the-espresso-network/internal-functionality/light-client',
      ],
      repositories: [
        'https://github.com/EspressoSystems/espresso-sequencer/tree/main/contracts',
      ],
      apps: [],
      explorers: [],
      socialMedia: [],
    },
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails('HotShotLightClient', {
          description: `The DA bridge contract that stores and verifies HotShot state commitments on Ethereum.
          `,
        }),
      ],
    },
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'the bridge contract or its dependencies receive a malicious code upgrade. There is no delay on code upgrades.',
      },
    ],
  },
  technology: {
    description: `
    ## Architecture
    The Light Client contract serves as the DA bridge for the Espresso Tiramisu DA solution and is responsible for storing the HotShot consensus state on Ethereum.
    
    When HotShot nodes reach consensus, they sign the updated HotShot state using Schnorr signatures, which indicate agreement with the state of the proposed block. These signatures are stored locally on the DA layer nodes.
    
    A prover retrieves these signatures and generates a SNARK proof, which is sent to the LightClient contract's newFinalizedState function. The LightClient contract verifies this proof using its verifyProof method, which accepts the proof and a set of public inputs, such as the blockHeight and the Merkle root of all sequenced blocks. 
    
    The proof should contain the HotShot state, the stake table information, and the list of Schnorr signatures from the HotShot nodes that formed a quorum and reached consensus on the state, and the new state is accepted only if the proof passes verification.

    Currently, attestations are relayed to the Light Client every ${updateInterval} hours.

    Please note that the Light Client implementation is unverified, the information provided is based on Espresso Github repository and Espresso documentation. 
  `,
    references: [
      {
        text: 'Light Client Functionality',
        href: 'https://docs.espressosys.com/network/espresso-architecture/the-espresso-network/internal-functionality',
      },
      {
        text: 'Espresso Github Repository',
        href: 'https://github.com/EspressoSystems/espresso-sequencer/tree/main/contracts',
      },
    ],
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'the DA bridge accepts an incorrect or malicious data commitment provided by 2/3 of validators.',
      },
      {
        category: 'Funds can be frozen if',
        text: 'the permissioned relayers are unable to submit DA commitments to the Light Client contract.',
      },
    ],
  },
  permissions: {
    ethereum: [],
  },
  requiredMembers: 67, // 2/3 + 1
  membersCount: 100, // max allowed node operators
  knownMembers: [
    // key mapping: https://docs.google.com/spreadsheets/d/1GB9HYE7T25QLJQoa2TuA4c43oHk-t8uWkychRNuMcpg/edit?gid=0#gid=0
    {
      external: true,
      name: '01node Validator',
      href: 'https://x.com/EspressoSys/status/1861106651471978614',
    },
    {
      external: true,
      name: 'Blockdaemon',
      href: 'https://x.com/EspressoSys/status/1861106663354442095',
    },
    {
      external: true,
      name: 'BlockPI',
      href: 'https://x.com/EspressoSys/status/1861106675278848329',
    },
    {
      external: true,
      name: 'ChorusOne',
      href: 'https://x.com/EspressoSys/status/1861106687115173990',
    },
    {
      external: true,
      name: 'deNodes',
      href: 'https://x.com/EspressoSys/status/1861106698825670830',
    },
    {
      external: true,
      name: '01node Validator',
      href: 'https://x.com/EspressoSys/status/1861106651471978614',
    },
    {
      external: true,
      name: 'Figment',
      href: 'https://x.com/EspressoSys/status/1861106639690178610',
    },
    {
      external: true,
      name: 'Finoa Consensus Services (FCS)',
      href: 'https://x.com/EspressoSys/status/1861106639690178610',
    },
    {
      external: true,
      name: 'Imperator.co',
      href: 'https://x.com/EspressoSys/status/1861106639690178610',
    },
    {
      external: true,
      name: 'Informal Systems',
      href: 'https://x.com/EspressoSys/status/1861106639690178610',
    },
    {
      external: true,
      name: 'Kiln',
      href: 'https://x.com/EspressoSys/status/1861106639690178610',
    },
    {
      external: true,
      name: 'KudasaiJP',
      href: 'https://x.com/EspressoSys/status/1861106639690178610',
    },
    {
      external: true,
      name: 'LinkPool',
      href: 'https://x.com/EspressoSys/status/1861106639690178610',
    },
    {
      external: true,
      name: 'Luganodes',
      href: 'https://x.com/EspressoSys/status/1861106639690178610',
    },
    {
      external: true,
      name: 'Nethermind',
      href: 'https://x.com/EspressoSys/status/1861106639690178610',
    },
    {
      external: true,
      name: 'Node Guardians',
      href: 'https://x.com/EspressoSys/status/1861106639690178610',
    },
    {
      external: true,
      name: 'P2P Validator',
      href: 'https://x.com/EspressoSys/status/1861106639690178610',
    },
    {
      external: true,
      name: 'Pier Two',
      href: 'https://x.com/EspressoSys/status/1861106639690178610',
    },
    {
      external: true,
      name: 'Staked',
      href: 'https://x.com/EspressoSys/status/1861106639690178610',
    },
    {
      external: true,
      name: 'Sub7',
      href: 'https://x.com/EspressoSys/status/1861106639690178610',
    },
    {
      external: true,
      name: 'Treasure DAO',
      href: 'https://x.com/EspressoSys/status/1861106639690178610',
    },
    {
      external: true,
      name: 'Unit 410',
      href: 'https://x.com/EspressoSys/status/1861106639690178610',
    },
    {
      external: true,
      name: 'Validation Cloud',
      href: 'https://x.com/EspressoSys/status/1861106639690178610',
    },
    {
      external: true,
      name: 'ZKV',
      href: 'https://x.com/EspressoSys/status/1861106639690178610',
    },
  ],
  transactionDataType: DacTransactionDataType.TransactionData,
  usedIn: [],
  risks: {
    committeeSecurity: DaCommitteeSecurityRisk.LimitedCommitteeSecurity(
      'Permissioned',
      undefined,
      100,
    ),
    upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(),
    relayerFailure: DaRelayerFailureRisk.NoMechanism,
  },
} satisfies DaBridge
