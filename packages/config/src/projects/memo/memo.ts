import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { DaEconomicSecurityRisk, DaFraudDetectionRisk } from '../../common'
import { linkByDA } from '../../common/linkByDA'
import type { BaseProject } from '../../types'

export const memo: BaseProject = {
  id: ProjectId('memo'),
  slug: 'memo',
  name: 'Meeda',
  shortName: undefined,
  archivedAt: UnixTime.fromDate(new Date('2025-06-03')),
  addedAt: UnixTime.fromDate(new Date('2024-09-03')),
  // tags
  isDaLayer: true,
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
      'Meeda (MemoDA) is a blockchain-based cloud storage protocol developed by MEMO Labs.',
    links: {
      websites: ['https://www.memolabs.org/'],
      documentation: ['https://memolabs.gitbook.io/meeda'],
      repositories: ['https://github.com/memoio'],
      explorers: ['https://scan.metamemo.one/'],
      socialMedia: [
        'https://x.com/MemoLabsOrg',
        'https://discord.com/invite/YG4Ydv2E7X',
      ],
    },
    badges: [],
  },
  daLayer: {
    type: 'Public Blockchain',
    systemCategory: 'public',
    consensusAlgorithm: {
      name: '',
      description: '',
      blockTime: 0, // seconds average
      consensusFinality: 0,
      unbondingPeriod: 0,
    },
    technology: {
      description: `
    ## Architecture

    ![Meeda architecture](/images/da-layer-technology/meeda/architecture.png#center)

    Meeda's architecture consists of several components. 
    Storage Nodes store blob data and generate data availability commitments, with node deployment available to all users. 
    Light Nodes are responsible for challenging storage nodes through onchain verification, and their deployment is also open to all users. 
    The Operator, currently deployed by the project itself, handles the erasure coding of data and data chunks distribution, as well as the aggregation of KZG commitment proofs from Storage Nodes. 
    
    Storage Nodes, based on seed information generated periodically on the Memo chain, submit KZG data commitments to the Operator. 
    The Verification Contract is responsible for onchain verification on Memo chain, and it will generate seed information through the VRF-Sampling (Verifiable Random Function) cycle to determine which files to select for verification.
    Not all data commitments are verified onchain, but only a subset of data is verified, with the sampling determined by the random seed produced by the Verification Contract.
    The operator will then collect and aggregate the KZG commitments for the selected files from storage nodes, and submit the aggregate proof to the Verification Contract.
   
    Optimistic verification assumes that the aggregation commitment submitted by the operator node is correct and only requires checking the accuracy of the associated proof.
    If no light node challenges the commitment within the specified validity period, the proof of availability is considered successful. <br/>

    Submitting a fraud proof is expected to require multiple rounds of interaction, with pledges and rewards for both the challenger and the challenged.
    The proving smart contracts (FileProof, ControlFileProof, ProxyFileProof) are deployed to the Memo chain and their code is not public, so the logic and security of the proving contracts is not verifiable.

    ## L2s Data Availability
    L2s can upload transaction data to Meeda through the MemoDA RPC, and the Meeda operator will generate an aggregated KZG polynomial commitment based on the transaction data. 
    Nodes can request transaction data on Meeda based on the commitment value of the transaction data.
  `,
      references: [
        {
          title: 'Meeda Documentation - Architecture',
          url: 'https://memolabs.gitbook.io/meeda/readme/overview-of-meeda/whats-meeda',
        },
        {
          title: 'Meeda FileProof contract - Metamemo Scan',
          url: 'https://scan.metamemo.one:8080/address/0x58C3Ab98546879a859EDBa3252A9d38E43C9cbee/',
        },
        {
          title: 'Meeda ControlFileProof contract - Metamemo Scan',
          url: 'https://scan.metamemo.one:8080/address/0x6eEc7578dBAD9dcc1CA159A9Df0A73233548b89a/',
        },
        {
          title: 'Meeda ProxyFileProof contract - Metamemo Scan',
          url: 'https://scan.metamemo.one:8080/address/0x0c7B5A9Ce5e33B4fa1BcFaF9e8722B1c1c23243B/',
        },
      ],
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'Memo storage nodes do not make the data available.',
        },
      ],
    },
    usedWithoutBridgeIn: linkByDA({
      layer: ProjectId('memo'),
      bridge: undefined,
    }),
    pruningWindow: 0,
    risks: {
      economicSecurity: DaEconomicSecurityRisk.OnChainNotSlashable('MEMO'),
      fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
    },
  },
  milestones: [
    {
      title: 'MEMO Megrez Network launch',
      url: 'https://memolabs.medium.com/memo-megrez-network-went-live-on-october-15-b99c187e041c',
      date: '2022-10-15T00:00:00Z',
      description:
        'MemoMegrez Network is the underlying storage network of the MEMO storage system.',
      type: 'general',
    },
  ],
}
