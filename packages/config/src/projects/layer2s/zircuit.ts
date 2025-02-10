import { EthereumAddress, UnixTime, formatSeconds } from '@l2beat/shared-pure'
import { ESCROW, REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ProjectTechnologyChoice } from '../../types'
import type { Layer2 } from '../../types'
import { opStackL2 } from './templates/opStack'

const discovery = new ProjectDiscovery('zircuit')

const ZIRCUIT_FINALIZATION_PERIOD_SECONDS: number =
  discovery.getContractValue<number>(
    'L2OutputOracle',
    'FINALIZATION_PERIOD_SECONDS',
  )

const ZIRCUIT_STATE_CORRECTNESS: ProjectTechnologyChoice = {
  name: 'Validity proofs (when available) ensure state correctness, but not DA', // proof is the only input to the Verifier
  description:
    'Each update to the system state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Ethereum by a smart contract. Currently proofs are optional and state (by default) is considered optimistically to be valid. Moreover, the system doesn’t check that the transactions applied to the state are the ones published by the sequencer.',
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
      title: 'Verifier.sol - Etherscan source code',
      url: 'https://etherscan.io/address/0xa1f99E9E8D23B4945b62eAFF65eCf3D0dE6a0a5e#code#F1#L9',
    },
  ],
}

export const zircuit: Layer2 = opStackL2({
  addedAt: new UnixTime(1712559704), // 2024-04-08T07:01:44Z
  discovery,
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Zircuit',
    slug: 'zircuit',
    description:
      'Zircuit is a universal Rollup that aims to use zk proofs in the future. It is based on the Optimism Bedrock architecture, employing AI to identify and stop malicious transactions at the sequencer level.',
    links: {
      websites: ['https://zircuit.com/'],
      apps: ['https://bridge.zircuit.com/', 'https://app.zircuit.com/'],
      documentation: ['https://docs.zircuit.com/'],
      explorers: ['https://explorer.zircuit.com/'],
      repositories: ['https://github.com/zircuit-labs'],
      socialMedia: [
        'https://x.com/ZircuitL2',
        'https://discord.com/invite/zircuit',
        'https://zircuit.com/blog',
        'https://t.me/zircuitl2_bot',
      ],
    },
    architectureImage: 'zircuit',
  },
  genesisTimestamp: new UnixTime(1719936217),
  rpcUrl: 'https://zircuit1-mainnet.p2pify.com/', // other: https://zircuit1-mainnet.liquify.com, https://zircuit-mainnet.drpc.org/
  // Chain ID: 48900
  isNodeAvailable: 'UnderReview',
  nonTemplateTechnology: {
    stateCorrectness: ZIRCUIT_STATE_CORRECTNESS,
  },
  chainConfig: {
    name: 'zircuit',
    chainId: 48900,
    coingeckoPlatform: 'zircuit',
    minTimestampForTvl: new UnixTime(1719936217),
  },
  nonTemplateExcludedTokens: ['rswETH', 'rsETH'],
  l1StandardBridgePremintedTokens: ['ZRC'],
  associatedTokens: ['ZRC'],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0x912C7271a6A3622dfb8B218eb46a6122aB046C79'),
      tokens: ['wstETH'],
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'custom wstETH Vault controlled by Lido governance, using the canonical bridge for messaging.',
    }),
  ],
  nonTemplateTrackedTxs: [
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0x92Ef6Af472b39F1b363da45E35530c24619245A4'),
        selector: '0xa9efd6b8',
        functionSignature:
          'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1Blockhash, uint256 _l1BlockNumber, bytes _proof)',
        sinceTimestamp: new UnixTime(1720137600),
      },
    },
  ],
  milestones: [
    {
      title: 'Zircuit Mainnet Launch',
      url: 'https://www.zircuit.com/blog/mainnet-phase-1-is-live',
      date: '2024-08-05T00:00:00.00Z',
      description: 'Zircuit is live on mainnet.',
      type: 'general',
    },
  ],
})
