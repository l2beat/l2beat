import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  DaCommitteeSecurityRisk,
  DaRelayerFailureRisk,
  DaUpgradeabilityRisk,
} from '../../common'
import { linkByDA } from '../../common/linkByDA'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

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
      description: readProjectMarkdown('tee-bridge', 'daBridgeTechnology'),
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
