import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  DaCommitteeSecurityRisk,
  DaRelayerFailureRisk,
  DaUpgradeabilityRisk,
} from '../../common'
import { linkByDA } from '../../common/linkByDA'
import { PROGRAM_HASHES } from '../../common/programHashes'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { getSP1Verifiers } from '../../templates/opStack'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('blobstream')

export const blobstream: BaseProject = {
  id: ProjectId('blobstream'),
  slug: 'blobstream',
  name: 'Blobstream',
  shortName: undefined,
  aliases: ['Celestia'],
  addedAt: UnixTime(1729253328), // 2024-10-18T12:08:48Z
  // data
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'The Blobstream bridge serves as a ZK light client, enabling the bridging of data availability commitments between Celestia and destination chains.',
    links: {
      documentation: [
        'https://docs.celestia.org/operate/blobstream/install-binary/#how-to-run',
        'https://hackmd.io/@succinctlabs/HJE7XRrup',
      ],
      repositories: [
        'https://github.com/succinctlabs/sp1-blobstream',
        'https://github.com/succinctlabs/blobstreamx',
      ],
    },
    badges: [],
  },
  trackedTxsConfig: [
    {
      projectId: ProjectId('blobstream'),
      sinceTimestamp: 1724648927,
      type: 'liveness',
      eventIdentity: { type: 'transactionHash' },
      subtype: 'proofSubmissions',
      params: {
        formula: 'functionCall',
        address: EthereumAddress('0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe'),
        selector: '0x8455a3cf',
        signature:
          'function commitHeaderRange(bytes proof, bytes publicValues)',
      },
    },
    {
      projectId: ProjectId('blobstream'),
      sinceTimestamp: 1724648927,
      type: 'l2costs',
      subtype: 'proofSubmissions',
      params: {
        formula: 'functionCall',
        address: EthereumAddress('0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe'),
        selector: '0x8455a3cf',
        signature:
          'function commitHeaderRange(bytes proof, bytes publicValues)',
      },
    },
  ],
  daBridge: {
    name: 'Blobstream',
    daLayer: ProjectId('celestia'),
    relayerType: {
      value: 'Permissioned',
      sentiment: 'warning',
      description:
        'Only whitelisted relayers can post attestations to this bridge.',
    },
    validationType: {
      value: 'Validity Proof',
      description:
        'The DA attestation requires onchain SNARK proof verification to be accepted by the bridge. Operators signatures and their corresponding stake are verified as part of the proof.',
      zkCatalogId: ProjectId('sp1hypercube'),
    },
    usedIn: linkByDA({
      layer: ProjectId('celestia'),
      bridge: ProjectId('blobstream'),
    }),
    technology: {
      description: readProjectMarkdown('blobstream', 'daBridgeTechnology'),
      references: [
        {
          title: 'SP1 Blobstream Operator',
          url: 'https://github.com/succinctlabs/sp1-blobstream/blob/b35c92bfcfc9a1711ea014cc871d6dd610dd5392/script/bin/operator.rs',
        },
        {
          title: 'Succinct Gateway - Etherscan',
          url: 'https://etherscan.io/address/0x6c7a05e0AE641c6559fD76ac56641778B6eCd776#code#F1#L148',
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
    risks: {
      committeeSecurity:
        DaCommitteeSecurityRisk.RobustAndDiverseCommittee('Validator set'),
      upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(0), // TIMELOCK_ROLE is 4/6 multisig
      relayerFailure: DaRelayerFailureRisk.NoMechanism,
    },
  },
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
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
    programHashes: getBlobstreamVKeys().map((el) => PROGRAM_HASHES(el)),
    zkVerifiers: getSP1Verifiers(discovery),
  },
  milestones: [
    {
      title: 'Plonky3 vulnerability patch',
      url: 'https://x.com/SuccinctLabs/status/1929773028034204121',
      date: '2025-06-04T00:00:00.00Z',
      description:
        'SP1 verifier is patched to fix critical vulnerability in Plonky3 proof system (SP1 dependency).',
      type: 'incident',
    },
  ],
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  discoveryInfo: getDiscoveryInfo([discovery]),
}

function getBlobstreamVKeys(): string[] {
  const blobstreamProgramHashes = new Set<string>()

  blobstreamProgramHashes.add(
    discovery.getContractValue<string>(
      'ArbitrumBlobstream',
      'blobstreamProgramVkey',
    ),
  )

  blobstreamProgramHashes.add(
    discovery.getContractValue<string>(
      'EthereumBlobstream',
      'blobstreamProgramVkey',
    ),
  )

  blobstreamProgramHashes.add(
    discovery.getContractValue<string>(
      'BaseBlobstream',
      'blobstreamProgramVkey',
    ),
  )
  return Array.from(blobstreamProgramHashes)
}
