import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  DaCommitteeSecurityRisk,
  DaRelayerFailureRisk,
  DaUpgradeabilityRisk,
} from '../../common'
import { linkByDA } from '../../common/linkByDA'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { BaseProject } from '../../types'

const discovery = new ProjectDiscovery('eigenda')

const totalNumberOfRegisteredOperators = discovery.getContractValue<string[]>(
  'RegistryCoordinator',
  'registeredOperators',
).length

export const eigendaV2: BaseProject = {
  id: ProjectId('eigenda-v2'),
  slug: 'eigenda-v2',
  name: 'EigenDA V2',
  shortName: 'EigenDA V2',
  addedAt: UnixTime.fromDate(new Date('2025-10-22')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'EigenDA V2 DACert Verifier provides certificate verification for EigenDA V2 with improved architecture where the sequencer acts as relayer.',
    links: {
      websites: ['https://www.eigenda.xyz/'],
      documentation: ['https://docs.eigenda.xyz/overview'],
      repositories: ['https://github.com/Layr-Labs/eigenda'],
      explorers: ['https://blobs.eigenda.xyz/'],
      socialMedia: ['https://x.com/eigen_da'],
    },
    badges: [],
  },
  daBridge: {
    name: 'DACert Verifier (EigenDA V2)',
    daLayer: ProjectId('eigenda'),
    relayerType: {
      value: 'SelfRelay',
      sentiment: 'good',
      description:
        'In EigenDA V2 secure integrations, the rollup batcher includes the DA certificate on L1, no separate third-party relayer is required.',
    },
    validationType: {
      value: 'BLS Signature',
      description:
        'EigenDA V2 certificates require onchain BLS signatures verification through dedicated DACert Verifier contracts. Each certificate version corresponds to a specific verifier that validates the certificate format and proofs.',
    },
    usedIn: linkByDA({
      layer: ProjectId('eigenda'),
      bridge: ProjectId('eigenda-v2'),
    }),
    technology: {
      description: `
## EigenDA V2 Architecture

EigenDA V2 introduces a more efficient architecture where the L2 sequencer acts as the relayer, eliminating the need for separate permissioned relayers:

### Key Improvements
- **Sequencer as Relayer**: The sequencer acts as the relayer, eliminating the need for separate permissioned relayers
- **Direct Certificate Verification**: Multiple DACert Verifier contracts handle different certificate versions (V2, V3). These contracts read operator/state metadata via EigenDA and EigenLayer core contracts (incl. ServiceManager components) and verify signatures and stake thresholds.
- **Version-Specific Verification**: Each certificate version has a corresponding verifier contract that validates the specific certificate format and cryptographic proofs

### Certificate Types and Verifiers
EigenDA V2 supports multiple certificate formats:

- **V2 Certificates**: Contain blob inclusion info, batch headers, and non-signer stakes with signatures. Verified through EigenDACertVerifierV2 contracts.
- **V3 Certificates**: Similar structure to V2 but with reordered fields for optimization. Verified through EigenDACertVerifierV3 contracts.

### Verification Process
1. **Certificate Construction**: The EigenDA client constructs certificates from BlobStatusReply data received from the disperser
2. **Version Detection**: The certificate version is determined from the commitment structure  
3. **Verifier Selection**: The appropriate DACert Verifier contract is selected based on the certificate version using the EigenDACertVerifierRouter
4. **Onchain Verification**: The verifier contract's checkDACert function validates the certificate against operator signatures and stake thresholds

### Secure Dispersal Flow
Based on the [EigenDA Integration Spec](https://layr-labs.github.io/eigenda/integration/spec/5-lifecycle-phases.html#secure-dispersal):

1. EigenDA Client converts raw payload bytes into a blob
2. Client fetches the appropriate EigenDACertVerifier contract address using the router
3. Client submits blob request to disperser and polls for BlobStatusReply
4. Once confirmation thresholds are met, client constructs the DACert from the reply
5. Client calls the verifier's checkDACert function for onchain verification
6. Based on verification status, client either returns the certificate or initiates failover

### Router-Based Verifier Selection
EigenDA V2 uses the EigenDACertVerifierRouter to dynamically select the appropriate verifier contract:
- The router maps certificate versions to their corresponding verifier contracts
- This allows for seamless upgrades and support for multiple certificate formats
- The client queries the router using the latest block number to get the verifier for the reference block

This architecture provides improved throughput and eliminates single points of failure while maintaining the same security guarantees as V1.
      `,
      references: [
        {
          title: 'EigenDA Integration Spec - Lifecycle Phases',
          url: 'https://layr-labs.github.io/eigenda/integration/spec/5-lifecycle-phases.html#secure-dispersal',
        },
        {
          title: 'EigenDA - Documentation',
          url: 'https://docs.eigenda.xyz/overview',
        },
        {
          title: 'EigenDA Disperser - Source Code',
          url: 'https://github.com/Layr-Labs/eigenda/blob/2ed86a0c1dd730b56c8235031c19e08a9837bde8/disperser/batcher/batcher.go',
        },
      ],
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the sequencer posts an invalid certificate and EigenDA operators do not make the data available for verification.',
        },
        {
          category: 'Funds can be frozen if',
          text: 'the EigenDACertVerifierRouter fails to provide correct verifier contract addresses.',
        },
      ],
    },
    risks: {
      committeeSecurity: DaCommitteeSecurityRisk.LimitedCommitteeSecurity(
        'Permissioned',
        undefined,
        totalNumberOfRegisteredOperators,
      ),
      upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(0),
      relayerFailure: DaRelayerFailureRisk.SelfPropose,
    },
  },
}
