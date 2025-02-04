import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../discovery/ProjectDiscovery'
import type { DaBridge } from '../../../types'
import {
  DaCommitteeSecurityRisk,
  DaRelayerFailureRisk,
  DaUpgradeabilityRisk,
} from '../common'
import { linkByDA } from '../common/linkByDA'

const discovery = new ProjectDiscovery('espresso')
const updateInterval = 12 // hours

export const hotshot: DaBridge = {
  id: ProjectId('espresso'), // TODO: merge with main espresso project
  addedAt: new UnixTime(1725372159), // 2024-09-03T14:02:39Z
  display: {
    name: 'HotShot Light Client',
    slug: 'hotshot',
    description: `The HotShot Light Client is a data availability bridge using Zero-Knowledge proofs to verify Espresso HotShot data availability attestations on Ethereum.`,
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
    ],
  },
  technology: {
    description: `
    ## Architecture
    The Light Client contract serves as the DA bridge for the Espresso DA solution and is responsible for storing the HotShot consensus state on Ethereum.
    
    When HotShot nodes reach consensus, they sign the updated HotShot state using Schnorr signatures, which indicate agreement with the state of the proposed block. These signatures are stored locally on the DA layer nodes.
    
    A prover retrieves these signatures and generates a SNARK proof, which is sent to the LightClient contract's newFinalizedState function. The LightClient contract verifies this proof using its verifyProof method, which accepts the proof and a set of public inputs, such as the blockHeight and the Merkle root of all sequenced blocks. 
    
    The proof should contain the HotShot state, the stake table information, and the list of Schnorr signatures from the HotShot nodes that formed a quorum and reached consensus on the state, and the new state is accepted only if the proof passes verification.

    Currently, attestations are relayed to the Light Client every ${updateInterval} hours.
  `,
    references: [
      {
        title: 'Light Client Functionality',
        url: 'https://docs.espressosys.com/network/espresso-architecture/the-espresso-network/internal-functionality',
      },
      {
        title: 'Espresso Github Repository',
        url: 'https://github.com/EspressoSystems/espresso-sequencer/tree/main/contracts',
      },
    ],
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'the DA bridge accepts an incorrect or malicious data commitment provided by 2/3 of validators.',
      },
      {
        category: 'Funds can be frozen if',
        text: 'excluding L2-specific DA fallback - the permissioned relayers are unable to submit DA commitments to the Light Client contract.',
      },
    ],
  },
  permissions: {
    ethereum: discovery.getDiscoveredPermissions(),
  },
  dac: {
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
  },
  usedIn: linkByDA({
    layer: ProjectId('espressoDA'),
    bridge: ProjectId('espresso'),
  }),
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
