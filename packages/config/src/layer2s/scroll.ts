import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS, TECHNOLOGY, UNDER_REVIEW_RISK_VIEW } from './common'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('scroll')

export const scroll: Layer2 = {
  type: 'layer2',
  id: ProjectId('scroll'),
  display: {
    name: 'Scroll',
    slug: 'scroll',
    description:
      'Scroll is an EVM compatible zkRollup that has been designed for use on the Ethereum network.',
    purpose: 'Universal',
    category: 'ZK Rollup',
    links: {
      websites: ['https://scroll.io'],
      apps: ['https://scroll.io/bridge', 'https://uniswap-v3.scroll.io'],
      documentation: ['https://docs.scroll.io/en/home/'],
      explorers: ['https://blockscout.scroll.io', 'https://scroll.unifra.xyz/'],
      repositories: [
        'https://github.com/scroll-tech/zkevm-circuits',
        'https://github.com/scroll-tech/zkevm-specs',
        'https://github.com/scroll-tech/scroll-zkevm',
        'https://github.com/scroll-tech/go-ethereum',
        'https://github.com/scroll-tech/frontends',
        'https://github.com/scroll-tech/scroll-contract-deploy-demo',
        'https://github.com/scroll-tech',
      ],
      socialMedia: [
        'https://discord.gg/scroll',
        'https://twitter.com/Scroll_ZKP',
      ],
    },
  },
  stage: {
    stage: 'UnderReview',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9'),
        tokens: '*',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367'),
        tokens: ['ETH'],
      }),
    ],
  },
  riskView: UNDER_REVIEW_RISK_VIEW,
  technology: TECHNOLOGY.UNDER_REVIEW,
  contracts: {
    addresses: [
      discovery.getContractDetails('ScrollChain', {
        description:
          'The main contract of the Scroll chain. Allows to post transaction data and state roots, along with proofs. Sequencing and proposing are behind a whitelist. L1 -> L2 message processing on L2 is not enforced.',
      }),
      discovery.getContractDetails('L1ScrollMessenger', {
        description:
          'Contract used to send L1 -> L2 and relay messages from L2. It allows to replay failed messages and to drop skipped messages. L1 -> L2 messages sent using this contract pay for L2 gas on L1 and will have the aliased address of this contract as the sender.',
      }),
      discovery.getContractDetails('L1MessageQueue', {
        description:
          'Contains the array of queued L1 -> L2 messages, either appended using the L1ScrollMessenger or the EnforcedTxGateway. The latter contract, which would allow users to send L2 messages from L1 with their own address as the sender, is not enabled yet.',
      }),
      discovery.getContractDetails('L2GasPriceOracle', {
        description:
          'Contract used to relay the L2 basefee on L1 in a trusted way using a whitelist. It is also used to store and update values related to intrinsic gas cost calculations.',
      }),
      discovery.getContractDetails('Whitelist', {
        description:
          'Contract used to store whitelists for the L2GasPriceOracle contract.',
      }),
      discovery.getContractDetails('ScrollOwner', {
        description:
          'Owner of all the proxies in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.',
      }),
    ],
    risks: [],
  },
}
