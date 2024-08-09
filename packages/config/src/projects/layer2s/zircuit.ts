import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'
import { ScalingProjectTechnologyChoice } from '../../common'
import { UnixTime, formatSeconds } from '@l2beat/shared-pure'

const discovery = new ProjectDiscovery('zircuit')

const ZIRCUIT_FINALIZATION_PERIOD_SECONDS: number =
  discovery.getContractValue<number>(
    'L2OutputOracle',
    'FINALIZATION_PERIOD_SECONDS',
  )

const ZIRCUIT_STATE_CORRECTNESS: ScalingProjectTechnologyChoice = {
  name: 'Validity proofs (when available) ensure state correctness',
  description:
    'Each update to the system state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Ethereum by a smart contract. Currently proofs are optional and state (by default) is considered optimistically to be valid.',
  risks: [
    {
      category: 'Funds can be stolen if',
      text: `the published state is invalid and the Challenger does not react during the ${formatSeconds(
        ZIRCUIT_FINALIZATION_PERIOD_SECONDS,
      )} finalization window.`,
    },
  ],
  references: [
    {
      text: 'Verifier.sol - Etherscan source code',
      href: 'https://etherscan.io/address/0xa153ec874dab9e6590cfcf4dc3f5bb86ffac08b9#code#F1#L9',
    },
  ],
}

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

export const zircuit: Layer2 = opStackL2({
  discovery,
  display: {
    name: 'Zircuit',
    slug: 'zircuit',
    description:
      'Zircuit is a universal Rollup that aims to use zk proofs in the future. It is based on the Optimism Bedrock architecture, employing AI to identify and stop malicious transactions at the sequencer level.',
    purposes: ['Universal'],
    links: {
      websites: ['https://zircuit.com/'],
      apps: ['https://bridge.zircuit.com/'],
      documentation: ['https://docs.zircuit.com/'],
      explorers: ['https://explorer.zircuit.com/'],
      repositories: [],
      socialMedia: [
        'https://x.com/ZircuitL2',
        'https://discord.com/invite/zircuit',
        'https://zircuit.com/blog',
      ],
    },
    activityDataSource: 'Blockchain RPC',
    architectureImage: 'zircuit',
  },
  genesisTimestamp: new UnixTime(1719936217),
  rpcUrl: 'https://zircuit1-mainnet.p2pify.com/', // other: https://zircuit1-mainnet.liquify.com, https://zircuit-mainnet.drpc.org/
  // Chain ID: 48900
  usesBlobs: true,
  isNodeAvailable: 'UnderReview',
  // proof system currently with temporary backdoor
  nonTemplateTechnology: {
    stateCorrectness: ZIRCUIT_STATE_CORRECTNESS,
  },
  nonTemplateContracts: [
    discovery.getContractDetails('Verifier', {
      description:
        'This contract verifies zk proof (if provided). There is a temporary backdoor allowing to call this contract without the proof',
      ...upgradeability,
    }),
    discovery.getContractDetails('ZircuitSuperchainConfig', {
      description:
        'The SuperchainConfig contract is normally used to manage configuration values for multiple OP Chains, however this is a separate instance of the SuperChain contract. It manages the PAUSED_SLOT, a boolean value indicating whether the chain is paused, and GUARDIAN_SLOT, the address of the guardian which can pause and unpause the system.',
      ...upgradeability,
    }),
  ],
  milestones: [
    {
      name: 'Zircuit Mainnet Launch',
      link: 'https://www.zircuit.com/blog/mainnet-phase-1-is-live',
      date: '2024-08-05T00:00:00.00Z',
      description: 'Zircuit is live on mainnet.',
    },
  ],
})
