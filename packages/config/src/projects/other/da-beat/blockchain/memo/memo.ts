import { NO_BRIDGE } from '../../templates/no-bridge-template'
import { DaEconomicSecurityRisk } from '../../types/DaEconomicSecurityRisk'
import { DaFraudDetectionRisk } from '../../types/DaFraudDetectionRisk'
import { DaLayer } from '../../types/DaLayer'
import { linkByDA } from '../../utils/link-by-da'

export const memo: DaLayer = {
  id: 'memo',
  type: 'DaLayer',
  kind: 'PublicBlockchain',
  display: {
    name: 'Meeda',
    slug: 'memo',
    description: `Meeda (MemoDA) is a blockchain-based cloud storage protocol developed by MEMO Labs.`,
    links: {
      websites: ['https://www.memolabs.org/'],
      documentation: [
        'https://memolabs.gitbook.io/meeda',
      ],
      repositories: [
        'https://github.com/memoio',
      ],
      apps: [],
      explorers: ['https://scan.metamemo.one:8080/'],
      socialMedia: [
        'https://x.com/MemoLabsOrg',
        'https://discord.com/invite/YG4Ydv2E7X',
      ],
    },
  },
  consensusAlgorithm: {
    name: '',
    description: ``,
    blockTime: 0, // seconds average
    consensusFinality: 0, 
    unbondingPeriod: 0, 
  },
  technology: `
    ## Architecture
    Meeda's architecture consists of several components. 
    Storage Nodes store blob data and generate data availability commitments, with deployment available to all users. 
    Light Nodes are responsible for challenging storage nodes through on-chain verification, and their deployment is also open to all users. 
    The Operator, currently deployed by the project itself, handles the erasure coding of data and data chunks distribution, as well as the aggregation of KZG commitment proofs from Storage Nodes. 
    
    Storage Nodes, based on seed information generated periodically on the Memo chain, submit KZG data commitments to the Operator. 
    The Verification Contract is responsible for on-chain verification on Memo chain, and it will generate seed information through the VRF-Sampling (Verifiable Random Function) cycle to determine which files to select for verification.
    Not all data commitments are verified on-chain, but only a subset of data is verified, with the sampling determined by the random seed produced by the Verification Contract.
    The operator will then collect and aggregate the KZG commitments for the selected files from storage nodes, and submit the aggregate proof to the Verification Contract.
   
    Optimistic verification assumes that the aggregation commitment submitted by the operator node is correct and only requires checking the accuracy of the associated proof.
    If no light node challenges the commitment within the specified validity period, the proof of availability is considered successful.

    Submitting a fraud proof is expected to require multiple rounds of interaction, with pledges and rewards for both the challenger and the challenged.
    The proving smart contracts (FileProof, ControlFileProof, ProxyFileProof) are deployed to the Memo chain and their code is unverified.
    Their code is not public, so the logic and security of the proving contracts is not verifiable.
  `,
  bridges: [
    NO_BRIDGE({
      layer: 'MemoDA',
    }),
  ],
  usedIn: linkByDA({
    layer: (layer) => layer === 'MemoDA',
  }),
  pruningWindow: 0,
  risks: {
    economicSecurity: DaEconomicSecurityRisk.OnChainQuantifiable,
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
  economicSecurity: {
    type: 'MemoDA', //none
  },
}
