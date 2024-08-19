import { BigNumber, utils } from 'ethers/lib/ethers'
import { ProjectDiscovery } from '../../../../discovery/ProjectDiscovery'
import { DaEconomicSecurityRisk, DaFraudDetectionRisk } from '../types'
import { DaLayer } from '../types/DaLayer'
import { mantleDABridge } from './bridges/mantleDABridge'

const discovery = new ProjectDiscovery('mantle')

const committeeMembers = discovery.getContractValue<number>(
  'BLSRegistry',
  'numOperators',
)

const totalStakeArray = discovery.getContractValue<number[]>(
  'BLSRegistry',
  'totalStake',
)

const totalStake = BigNumber.from(totalStakeArray[0])
const requiredStake = totalStake.div(committeeMembers)

const requiredStakeFormatted = parseFloat(
  utils.formatEther(requiredStake),
).toLocaleString()

export const mantleDA: DaLayer = {
  id: 'dac',
  type: 'DaLayer',
  kind: 'DAC',
  display: {
    name: 'MantleDA',
    slug: 'mantle',
    description:
      'MantleDA is a data availability solution built on EigenDA contracts, which have been forked and significantly modified.',
    links: {
      websites: ['https://mantle.xyz'],
      documentation: ['https://docs-v2.mantle.xyz/intro/risk-management/da'],
      repositories: ['https://github.com/mantlenetworkio'],
      apps: [],
      explorers: ['https://explorer.mantle.xyz/mantle-da'],
      socialMedia: [
        'https://twitter.com/0xMantle',
        'https://t.me/mantlenetwork',
      ],
    },
  },
  technology: `
    ## Architecture

    MantleDA is an independent DA module that is built on top of an early version of EigenDA smart contracts.
    The system is made up of two main component: onchain smart contracts for storing and verifying data committments, and an offchain network of permissioned nodes storing the data.
    The permissioned set of nodes is tasked with providing data availability to the Mantle network. 
    They receive Mantle network transaction data, sign it using a BLS signature scheme, and send back signatures to the sequencer to post commitments to the DataLayrServiceManager (DA Bridge) contract on Ethereum.
    The DA DataLayrServiceManager acts as a verifier smart contract,  verifying that the signatures provided by the sequencer are indeed from node operators who have agreed to be in the quorum.
    To become members of the DA network, node operators are required to stake ${requiredStakeFormatted} MNT tokens, and can only be registered by an authorized entity. There is no slashing mechanism in place for misbehaving nodes.
    `,
  bridges: [mantleDABridge],
  usedIn: [...mantleDABridge.usedIn],
  risks: {
    economicSecurity: DaEconomicSecurityRisk.OnChainNotSlashable('MNT'),
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
}
