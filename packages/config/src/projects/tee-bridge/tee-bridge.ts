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
  shortName: 'TEE Bridge',
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
      'The TEE Bridge utilizes a Trusted Execution Environment (TEE) to provide data availability attestations with hardware-based security guarantees.',
    links: {
      documentation: [
        'https://docs.espressosys.com/network/guides/using-the-espresso-network/using-the-espresso-network-as-an-arbitrum-orbit-chain/arbitrum-nitro-integration-overview/using-tee-with-nitro',
      ],
      repositories: [
        'https://github.com/EspressoSystems/nitro-espresso-integration/blob/7ddcc6c036fa05cc47560552c85f30b5adedf32c/arbnode/batch_poster.go#L574',
      ],
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
      
      ### Arbitrum Nitro Integration
      
      The primary implementation runs the Arbitrum Nitro batch poster (batcher) inside a TEE environment, specifically Intel SGX. The integration process involves:
      
      1. **Transaction Flow**: The sequencer provides soft-confirmations while simultaneously sending transactions to the Espresso Network for stronger BFT consensus-backed confirmations.
      
      2. **TEE Batch Poster**: The batcher operates within the TEE and must honor Espresso Network confirmations. It cannot reorder transactions or equivocate, providing strong guarantees that transactions will be included and finalized (unless the escape hatch mechanism is enabled).
      
      3. **Batch Consistency Verification**: Before posting to L1, the TEE batcher performs two critical checks:
         - **Namespace Validation**: Ensures transactions correspond to the correct Arbitrum Nitro/Orbit chain namespace
         - **Merkle Proof Verification**: Confirms the batch maps to a valid HotShot block in the Merkle tree maintained by the light client contract
      
      4. **Signature Generation**: The batcher computes blob hashes and signs the combined hash along with calldata, including this signature in the L1 transaction for on-chain verification.
      
      The TEE-based approach provides accountability for sequencers while maintaining the existing Arbitrum Nitro rollup design with minimal changes.
      
      ## Security Considerations
      
      TEE-based systems face unique security challenges that differ from traditional cryptographic approaches:
      
      **Remote Attestation**: The bridge relies on Intel's Attestation Service (IAS) to verify that TEE nodes are running legitimate software on genuine hardware with up-to-date security patches. This creates a dependency on Intel's centralized infrastructure.
      
      **TCB Recovery**: When new TEE vulnerabilities are discovered (such as AepicLeak or the WireTap attack), the system must implement Trusted Computing Base (TCB) recovery procedures to block compromised nodes from joining the network before Intel updates their attestation requirements. Research has shown that many applications fail to take appropriate action after TCB recovery announcements, often not implementing necessary security updates or node blocking mechanisms in a timely manner.

      **Physical Hardware Attacks**: Recent research has demonstrated that SGX attestation keys can be extracted through physical DRAM bus interposition attacks using relatively inexpensive equipment (under $1000). The WireTap attack shows how attackers can build devices to physically inspect memory traffic and exploit deterministic encryption in Intel's Total Memory Encryption to recover SGX secret attestation keys. This allows attackers to forge SGX attestation quotes.
      
      **Key Management**: The bridge uses on-chain key registration and verification rather than relying solely on TEE sealing mechanisms. TEE attestation keys are registered on-chain through verifier contracts that track valid MRENCLAVE hashes, MRSIGNER values, and authorized signers. This provides transparency and governance control over which TEE configurations are trusted, eliminating the "developer key backdoor" risk present in systems that rely purely on MRSIGNER-based sealing. However, initial key registration still requires Intel's remote attestation to verify TEE authenticity.


      **Governance and TCB Recovery**: TEE-based bridges face unique governance challenges around TEE configuration management and vulnerability response. The on-chain verifier contracts allow governance to manage valid MRENCLAVE hashes and authorized signers, providing transparency and control over trusted TEE configurations. However, compromised TEE keys can sign false availability attestations during the time window before governance can detect and revoke them. When new TEE vulnerabilities are discovered, governance must coordinate extremely rapid responses to revoke compromised configurations before they can be exploited to attest to unavailable data.

      ## Implementation Details

      **TEE Environment**: The implementation uses Intel SGX with Gramine LibOS for stability and maturity. Remote Attestation is supported through RA-TLS certificates that embed SGX attestation reports, allowing anyone to verify the TEE's integrity.

      
      **Escape Hatch Mechanism**: The batch poster includes a liveness check mechanism that calls IsHotshotLive on the Light Client Contract before posting batches. Operators can configure two behaviors: (1) wait for HotShot to be live before posting, or (2) proceed without HotShot consistency checks if the network is unavailable, effectively bypassing Espresso consensus validation. This flexibility prevents the bridge from becoming permanently stuck while maintaining security when possible.
      `,
      references: [
        {
          title: 'TEE-based Smart Contracts and Sealing Pitfalls',
          url: 'https://medium.com/initc3org/tee-based-smart-contracts-and-sealing-pitfalls-eccd5d751329',
        },
        {
          title:
            'SGXonerated: Finding (and Exploiting) SGX Enclave Bugs with Symbolic Execution',
          url: 'https://eprint.iacr.org/2023/378',
        },
        {
          title: 'SGX.fail - A website documenting SGX security research',
          url: 'https://sgx.fail/',
        },
        {
          title:
            'Secret Network v1.18 Upgrade: Due Process vs Bricking Risk Discussion',
          url: 'https://forum.scrt.network/t/secret-network-v-1-18-upgrade-proposal/7720',
        },
        {
          title: 'WireTap: Breaking Server SGX via DRAM Bus Interposition',
          url: 'https://wiretap.fail/',
        },
      ],
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the TEE hardware is compromised through physical attacks, if there are vulnerabilities in the trusted execution environment, or if compromised TEE keys are used to sign false availability attestations before governance can revoke them from the on-chain verifier contracts.',
        },
        {
          category: 'Funds can be frozen if',
          text: "Intel's Attestation Service becomes unavailable, new TEE nodes fail remote attestation due to unpatched vulnerabilities, or if TCB recovery procedures block legitimate nodes.",
        },
        {
          category: 'Funds can be frozen if',
          text: 'governance fails to revoke compromised TEE configurations from on-chain verifier contracts.',
        },
      ],
    },
    risks: {
      committeeSecurity: DaCommitteeSecurityRisk.TeeCommitteeSecurity(),
      upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(0),
      relayerFailure: DaRelayerFailureRisk.NoMechanism,
    },
  },
}
