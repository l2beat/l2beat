import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  CONTRACTS,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
  TECHNOLOGY,
} from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('jovay')

export const jovay: ScalingProject = {
  type: 'layer2',
  id: ProjectId('jovay'),
  capability: 'universal',
  addedAt: UnixTime(1754392609),
  hasTestnet: true,
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Jovay',
    slug: 'jovay',
    description:
      'Jovay, by Ant Digital Technologies, is an Ethereum Layer 2 blockchain built for real-world assets and users.',
    purposes: ['Universal', 'RWA'],
    links: {
      websites: ['https://jovay.io/'],
      documentation: ['https://docs.jovay.io/'],
      explorers: ['https://explorer.jovay.io/l2'],
      socialMedia: [
        'https://x.com/JovayNetwork',
        'https://discord.com/invite/8pYGeFAs44',
        'https://t.me/Jovay_Network',
      ],
      bridges: ['https://bridge.jovay.io/'],
      repositories: ['https://github.com/jovaynetwork'],
    },
  },
  proofSystem: undefined,
  dataAvailability: undefined,
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x922248db4a99bb542539ae7165fb9d7a546fb9f1'),
        sinceTimestamp: UnixTime(1754392609),
        tokens: ['ETH'],
        chain: 'ethereum',
      },
    ],
    activityConfig: {
      type: 'block',
      startBlock: 1,
    },
  },
  riskView: {
    stateValidation: {
      description:
    'A multi-proof system with a TEE verifier and a ZK verifier is configured . However, only the TEE verifier can currently be used to prove blocks.',
      sentiment: 'bad',
      value: 'TEE validation',
      executionDelay: 0,
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(false),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  chainConfig: {
    name: 'jovay',
    chainId: 5734951,
    explorerUrl: 'https://explorer.jovay.io/l2',
    gasTokens: ['ETH'],
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.jovay.io',
        callsPerMinute: 300,
      },
    ],
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
