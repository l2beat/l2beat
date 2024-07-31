import { DaEconomicSecurityRisk, DaFraudDetectionRisk } from '../types'
import { DaLayer } from '../types/DaLayer'
import { mantleDABridge } from './bridges/mantleDABridge'



export const mantleDA: DaLayer = {
  id: 'dac',
  type: 'DaLayer',
  kind: 'DAC',
  display: {
    name: 'MantleDA',
    slug: 'mantle-da',
    description:
      'MantleDA is a data availability solution built on EigenDA contracts, which have been forked and significantly modified.',
    links: {
      websites: ['https://mantle.xyz'],
      documentation: [
        'https://docs-v2.mantle.xyz/intro/risk-management/da'
      ],
      repositories: [
        'https://github.com/mantlenetworkio'
      ],
      apps: [],
      explorers: ['https://explorer.mantle.xyz/mantle-da'],
      socialMedia: ['https://twitter.com/0xMantle', 'https://t.me/mantlenetwork'],
    },
  },
  technology:
    `
    ## Architecture

    MantleDA is an independent DA module that is built on top of an early version of EigenDA smart contracts.
    The system is made up of two main component: onchain smart contracts for storing and verifying data committments, and an offchain network of permissioned nodes storing the data.
    The permissioned set of nodes is tasked with providing data availability to the Mantle network. 
    They receive Mantke network transaction data, sign it using a BLS signature scheme, and send back signatures to the sequencer to post commitments to the DataLayrServiceManager contract on Ethereum.
    The DataLayrServiceManager acts as a verifier smart contract,  verifying that the signatures provided by the sequencer are indeed from node operators who have agreed to be in the quorum.
    To become members of the DA network, node operators are required to stake ${} MANTLE tokens, and can only be registered by an authorized entity. There is no slashing mechanism in place for misbehaving nodes.

    ### L2s Data Availability

    The Mantle sequencer posts the data hash as a commitment to the DataLayrServiceManager contract on Ethereum thorugh an InitDataStore() transaction.
    Once the commitment is posted, the sequencer sends the data to the permissioned set of nodes, who sign the data and send back the signatures to the sequencer.
    The sequencer then posts the signatures to the DataLayrServiceManager contract on Ethereum through a confirmDataStore() transaction.
    The confirmDataStore() function verify the signatures and if the quorum is reached, the data is considered available.
    `,
  bridges: [mantleDABridge],
  usedIn: [...mantleDABridge.usedIn],
  risks: {
    economicSecurity: DaEconomicSecurityRisk.Unknown,
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
}
