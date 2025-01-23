import { UnixTime } from '@l2beat/shared-pure'

import { DA_BRIDGES, DA_LAYERS } from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import {
  DaCommitteeSecurityRisk,
  DaEconomicSecurityRisk,
  DaFraudDetectionRisk,
  DaRelayerFailureRisk,
  DaUpgradeabilityRisk,
} from '../da-beat/types'
import { opStackL2 } from './templates/opStack'
import type { Layer2 } from './types'

const discovery = new ProjectDiscovery('fraxtal')

export const fraxtal: Layer2 = opStackL2({
  createdAt: new UnixTime(1708511622), // 2024-02-21T10:33:42Z
  additionalBadges: [Badge.DA.CustomDA, Badge.Infra.Superchain],
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
          text: 'Fraxtal documentation',
          href: 'https://docs.frax.com/fraxtal',
        },
        {
          text: 'On-Chain Inbox',
          href: 'https://etherscan.io/address/0xff000000000000000000000000000000000420fc',
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
  },
  associatedTokens: ['FXS', 'FPIS'],
  discovery,
  display: {
    reasonsForBeingOther: [
      REASON_FOR_BEING_OTHER.NO_PROOFS,
      REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
    ],
    name: 'Fraxtal',
    slug: 'fraxtal',
    description:
      'Fraxtal is an EVM equivalent Optimium utilizing the OP stack as its smart contract platform and execution environment.',
    links: {
      websites: ['https://frax.com/'],
      apps: ['https://app.frax.finance/'],
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
  rpcUrl: 'https://rpc.frax.com',
  genesisTimestamp: new UnixTime(1706811599),
  isNodeAvailable: true,
  chainConfig: {
    name: 'fraxtal',
    chainId: 252,
    explorerUrl: 'https://fraxscan.com/',
    explorerApi: {
      url: 'https://api.fraxscan.com/api',
      type: 'etherscan',
    },
    // ~ Timestamp of block number 1
    minTimestampForTvl: new UnixTime(1706810713),
    coingeckoPlatform: 'fraxtal',
  },
  nonTemplateEscrows: [],
  nonTemplateOptimismPortalEscrowTokens: ['frxETH'],
  discoveryDrivenData: true,
  dataAvailabilitySolution: {
    type: 'DaLayer',
    kind: 'No DAC',
    display: {
      name: 'FraxtalDA',
      description:
        'FraxtalDA is a custom data availability solution built by the Fraxtal team.',
    },
    systemCategory: 'custom',
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
      `,
      references: [
        {
          text: 'FraxtalDA Documentation',
          href: 'https://docs.frax.com/fraxtal/network/data-availability',
        },
        {
          text: 'Fraxtal DA Follower - Source Code',
          href: 'https://github.com/FraxFinance/fraxtal-da-follower/blob/791e849b41465e1e00377f57c8f0c49d4b13caa8/main.go',
        },
      ],
      risks: [
        {
          category: 'Funds can be lost if',
          text: `the sequencer posts an invalid data availability commitment.`,
        },
      ],
    },
    bridge: {
      createdAt: new UnixTime(1723022143), // 2024-04-03T10:08:59Z
      type: 'NoDacBridge',
      technology: {
        description: `The SequencerInbox only stores IPFS hash commitments posted by the sequencer. It is not possible to verify blob inclusion against the data commitments onchain.
      Projects not integrating with a functional DA bridge rely only on the data availability attestation of the sequencer.There is no committee attesting to the availability of the data. For L2 chain derivation, the system relies on sequencer commitments to an L1 onchain inbox. See DA layer technology section for more details.\n`,
      },
      risks: {
        committeeSecurity: DaCommitteeSecurityRisk.NoBridge,
        upgradeability: DaUpgradeabilityRisk.NoBridge,
        relayerFailure: DaRelayerFailureRisk.NoBridge,
      },
    },
    risks: {
      economicSecurity: DaEconomicSecurityRisk.Unknown,
      fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
    },
  },
})
