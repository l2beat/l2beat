import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  DaCommitteeSecurityRisk,
  DaRelayerFailureRisk,
  DaUpgradeabilityRisk,
} from '../../common'
import { linkByDA } from '../../common/linkByDA'
import type { BaseProject } from '../../types'

export const teeBridge: BaseProject = {
  id: ProjectId('tee-bridge'),
  slug: 'tee-bridge',
  name: 'TEE Bridge',
  shortName: undefined,
  addedAt: UnixTime(1755774275),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'The TEE Bridge utilizes Trusted Execution Environments to provide data availability attestations with hardware-based security guarantees.',
    links: {
      documentation: [],
      repositories: [],
    },
    badges: [],
  },
  daBridge: {
    name: 'TEE Bridge',
    daLayer: ProjectId('espresso'),
    usedIn: linkByDA({
      layer: ProjectId('espresso'),
      bridge: ProjectId('tee-bridge'),
    }),
    technology: {
      description: `
      ## Architecture
      
      The TEE Bridge leverages Trusted Execution Environments (TEEs) to provide hardware-based attestations for data availability. 
      TEEs create secure, isolated environments where data availability proofs can be generated and verified with cryptographic guarantees.
      
      The bridge operates by having TEE-enabled txs batcher attest to the availability of data on the Espresso DA layer. 
      These attestations are cryptographically signed within the secure enclave and can be verified on-chain.
      
      The TEE-based approach provides a different security model compared to traditional cryptographic or committee-based bridges, 
      relying on hardware security guarantees rather than economic incentives or cryptographic proofs.
      
      ## Security Considerations
      
      TEE-based systems face unique security challenges that differ from traditional cryptographic approaches:
      
      **Remote Attestation**: The bridge relies on Intel's Attestation Service (IAS) to verify that TEE nodes are running legitimate software on genuine hardware with up-to-date security patches. This creates a dependency on Intel's centralized infrastructure.
      
      **TCB Recovery**: When new TEE vulnerabilities are discovered (such as AepicLeak), the system must implement Trusted Computing Base (TCB) recovery procedures to block compromised nodes from joining the network before Intel updates their attestation requirements.
      
      **Key Management**: The bridge must carefully manage how cryptographic keys are sealed and migrated during software updates. Using MRSIGNER-based sealing (which allows any code signed by developers to access sealed data) creates potential backdoors, while MRENCLAVE-based sealing (binding to specific code hashes) makes upgrades more complex but more secure.
      `,
      references: [
        {
          title: 'TEE-based Smart Contracts and Sealing Pitfalls',
          url: 'https://medium.com/initc3org/tee-based-smart-contracts-and-sealing-pitfalls-eccd5d751329',
        },
      ],
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the TEE hardware is compromised or if there are vulnerabilities in the trusted execution environment.',
        },
        {
          category: 'Funds can be frozen if',
          text: 'Intel\'s Attestation Service becomes unavailable, TEE nodes fail remote attestation due to unpatched vulnerabilities, or if TCB recovery procedures block legitimate nodes.',
        },
      ],
    },
    risks: {
      committeeSecurity:
        DaCommitteeSecurityRisk.RobustAndDiverseCommittee('TEE nodes'),
      upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(0),
      relayerFailure: DaRelayerFailureRisk.NoMechanism,
    },
  },
}
