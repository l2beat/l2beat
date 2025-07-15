import { UnixTime } from '@l2beat/shared-pure'
import {
  DA_BRIDGES,
  DA_LAYERS,
  DaEconomicSecurityRisk,
  DaFraudDetectionRisk,
  REASON_FOR_BEING_OTHER,
} from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('fraxtal')

export const fraxtal: ScalingProject = opStackL2({
  addedAt: UnixTime(1708511622), // 2024-02-21T10:33:42Z
  daProvider: {
    layer: DA_LAYERS.FRAXTAL_DA,
    riskView: {
      value: 'External',
      description:
        'Proof construction and state derivation rely fully on data that is NOT published on chain. Fraxtal uses a separate data availability module developed by the Frax Core Team, and data availability attestations are not published on chain.',
      sentiment: 'bad',
    },
    technology: {
      name: 'Data required to compute fraud proof is not published on chain, and currently not publicly accessible',
      description:
        'Fraxtal uses a separate data availability module developed by the Frax Core Team. Data is posted off chain, and only hashes of blob data is published on an on chain inbox.',
      references: [
        {
          title: 'Fraxtal documentation',
          url: 'https://docs.frax.com/fraxtal',
        },
        {
          title: 'On-Chain Inbox',
          url: 'https://etherscan.io/address/0xff000000000000000000000000000000000420fc',
        },
      ],
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the data is not made available on the external provider.',
          isCritical: true,
        },
        {
          category: 'Funds can be lost if',
          text: 'the sequencer posts an unavailable or malicious transaction root.',
          isCritical: true,
        },
      ],
    },
    bridge: DA_BRIDGES.NONE,
    badge: BADGES.DA.CustomDA,
  },
  associatedTokens: ['FRAX', 'FPIS'],
  discovery,
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'Fraxtal',
    slug: 'fraxtal',
    description:
      'Fraxtal is an EVM equivalent Optimium utilizing the OP stack as its smart contract platform and execution environment.',
    links: {
      websites: ['https://frax.com/'],
      bridges: ['https://app.frax.finance/'],
      documentation: ['https://docs.frax.com/'],
      explorers: ['https://fraxscan.com/'],
      repositories: ['https://github.com/FraxFinance'],
      socialMedia: [
        'https://discord.com/invite/UJVtDTFRaA',
        'https://twitter.com/fraxfinance',
        'https://t.me/fraxfinance',
      ],
    },
  },
  genesisTimestamp: UnixTime(1706811599),
  isNodeAvailable: true,
  chainConfig: {
    name: 'fraxtal',
    chainId: 252,
    explorerUrl: 'https://fraxscan.com',
    // ~ Timestamp of block number 1
    sinceTimestamp: UnixTime(1706810713),
    coingeckoPlatform: 'fraxtal',
    gasTokens: ['FRAX'],
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.frax.com',
        callsPerMinute: 1500,
      },
      {
        type: 'etherscan',
        chainId: 252,
      },
    ],
  },
  nonTemplateEscrows: [],
  nonTemplateOptimismPortalEscrowTokens: ['frxETH', 'FRAX'],
  customDa: {
    type: 'Custom',
    name: 'FraxtalDA',
    description:
      'FraxtalDA is a custom data availability solution built by the Fraxtal team.',
    technology: {
      description: `
## Architecture
FraxtalDA is a custom data availability solution built by the Fraxtal team. 
The data is posted by the OP batcher to three separate locations: AWS, IPFS, and Cloudfare R2. 
The IPFS hash is then submitted to the onchain inbox contract on Ethereum.
FraxtalDA relies on a single DA endpoint to manage data posting between the three different locations. 

![FraxtalDA](/images/da-layer-technology/fraxtalDA/FraxtalDA.png#center)

The sequencer attests to data availability by posting an IPFS hash to an onchain inbox contract on Ethereum. L2 nodes derive the L2 chain from the L1 by reading transactions commitments from this sequencer inbox.
When reading from the inbox, the op-node verifies that the commitment hash is a valid IPFS CID. If the data corresponding to the hash is missing from IPFS, the op-node will halt, preventing further derivation of the L2 chain. 

## DA Bridge
The SequencerInbox only stores IPFS hash commitments posted by the sequencer. It is not possible to verify blob inclusion against the data commitments onchain.
Projects not integrating with a functional DA bridge rely only on the data availability attestation of the sequencer.There is no committee attesting to the availability of the data. For L2 chain derivation, the system relies on sequencer commitments to an L1 onchain inbox. See DA layer technology section for more details.
      `,
      references: [
        {
          title: 'FraxtalDA Documentation',
          url: 'https://docs.frax.com/fraxtal/network/data-availability',
        },
        {
          title: 'Fraxtal DA Follower - Source Code',
          url: 'https://github.com/FraxFinance/fraxtal-da-follower/blob/791e849b41465e1e00377f57c8f0c49d4b13caa8/main.go',
        },
      ],
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the sequencer posts an invalid data availability commitment.',
        },
      ],
    },
    risks: {
      economicSecurity: DaEconomicSecurityRisk.Unknown,
      fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
      isNoBridge: true,
    },
  },
})
