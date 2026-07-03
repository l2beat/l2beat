import { formatSeconds, ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  DaCommitteeSecurityRisk,
  DaRelayerFailureRisk,
  DaUpgradeabilityRisk,
} from '../../common'
import { linkByDA } from '../../common/linkByDA'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { BaseProject, ProjectPermissions } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('eigenda')

const EIGENUpgradeDelay = discovery.getContractValue<number>(
  'TimelockControllerOwning',
  'getMinDelay',
)

const totalNumberOfRegisteredOperators = discovery.getContractValue<string[]>(
  'RegistryCoordinator',
  'registeredOperators',
).length

const eigenDaAddresses = new Set(
  discovery.configReader
    .readDiscovery('eigenda')
    .entries.filter((e) => e.type !== 'Reference')
    .map((e) => e.address.toString()),
)

export const eigendaV2: BaseProject = {
  id: ProjectId('eigenda-v2'),
  slug: 'eigenda-v2',
  name: 'EigenDA V2',
  shortName: 'EigenDA V2',
  aliases: ['EigenLayer', 'EigenCloud'],
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
      socialMedia: [
        'https://x.com/eigen_da',
        'https://discord.com/invite/eigenlayer',
      ],
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
      description: readProjectMarkdown('eigenda-v2', 'daBridgeTechnology'),
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
  contracts: {
    addresses: filterToEigenDaOnly(discovery.getDiscoveredContracts()),
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'the EigenDACertVerifier or EigenDACertVerifierRouter contracts receive a malicious code upgrade and accept invalid certificates. There is no delay on code upgrades.',
      },
      {
        category: 'Funds can be lost if',
        text: 'the EigenDAServiceManager (BLS signature verifier) contract receives a malicious code upgrade. There is no delay on code upgrades.',
      },
      {
        category: 'Funds can be lost if',
        text: 'the EigenDA middleware contracts (StakeRegistry, BLSApkRegistry, RegistryCoordinator) receive a malicious code upgrade and report incorrect stake or keys to the cert verifier. There is no delay on code upgrades.',
      },
      {
        category: 'Funds can be lost if',
        text: `the EigenLayer EIGEN token contract receives a malicious code upgrade. There is a ${formatSeconds(EIGENUpgradeDelay)} delay on code upgrades.`,
      },
      {
        category: 'Funds can be lost if',
        text: 'the churn approver or ejectors act maliciously and eject EigenDA operators from a quorum without cause.',
      },
      {
        category: 'Funds can be lost if',
        text: 'a sequencer posts an incorrect or malicious DA certificate that is accepted by the verifier contract.',
      },
    ],
  },
  permissions: filterPermissionsToEigenDaOnly(
    discovery.getDiscoveredPermissions(),
  ),
}

function filterToEigenDaOnly<T extends { address: { toString(): string } }>(
  contracts: Record<string, T[]>,
): Record<string, T[]> {
  return Object.fromEntries(
    Object.entries(contracts).map(([chain, list]) => [
      chain,
      list.filter((c) => eigenDaAddresses.has(c.address.toString())),
    ]),
  )
}

function filterPermissionsToEigenDaOnly(
  permissions: Record<string, ProjectPermissions>,
): Record<string, ProjectPermissions> {
  return Object.fromEntries(
    Object.entries(permissions).map(([chain, p]) => [
      chain,
      {
        roles: p.roles?.map((role) => ({
          ...role,
          accounts: role.accounts.filter((a) =>
            eigenDaAddresses.has(a.address.toString()),
          ),
        })),
        actors: p.actors?.filter((actor) =>
          actor.accounts.some((a) =>
            eigenDaAddresses.has(a.address.toString()),
          ),
        ),
      },
    ]),
  )
}
