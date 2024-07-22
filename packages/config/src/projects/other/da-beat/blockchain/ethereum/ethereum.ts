import { DaEconomicSecurityRisk } from '../../types/DaEconomicSecurityRisk'
import { DaFraudDetectionRisk } from '../../types/DaFraudDetectionRisk'
import { DaLayer } from '../../types/DaLayer'
import { enshrinedBridge } from './bridges/enshrinedBridge'

export const ethereum: DaLayer = {
  id: 'ethereum',
  type: 'DaLayer',
  kind: 'PublicBlockchain',
  display: {
    name: 'Ethereum (EIP-4844)',
    slug: 'ethereum',
    description: `Ethereum is a Proof of Stake (PoS) network that enables the creation and execution of smart contracts and decentralized applications (dApps) using its native cryptocurrency, Ether (ETH).
      EIP-4844 allows for blob-carrying transactions containing large amounts of data on the consensus layer, and whose commitment can be accessed by the EVM on the execution layer.`,
    links: {
      websites: ['https://immutablex.xyz/'],
      documentation: ['https://docs.immutablex.xyz/'],
      repositories: ['https://github.com/Immutablex/immutablex'],
      apps: ['https://app.immutable.com/'],
      explorers: ['https://explorer.immutable.com/'],
      socialMedia: ['https://twitter.com/Immutable'],
    },
  },
  technology:
    'Minim quis labore minim fugiat ullamco ipsum eiusmod occaecat occaecat. Incididunt esse veniam duis sunt non anim proident. Nostrud dolore irure Lorem culpa ut incididunt et elit pariatur ullamco adipisicing magna duis. Duis sunt do aliqua et. Tempor mollit non cupidatat magna est labore qui culpa consectetur voluptate quis.',
  bridges: [enshrinedBridge],
  usedIn: enshrinedBridge.usedIn,
  consensusAlgorithm: {
    name: 'Gasper',
    description: `Ethereum's consensus protocol combines two separate consensus protocols, LMD GHOST and Casper FFG.
    LMD GHOST is a fork choice rule that essentially provides liveness to the chain. On the other hand, Casper FFG provides finality to the chain, protecting it from deep reversions.
    LMD GHOST provides the core of the chain fork choice rule, by selecting the Greedy Heaviest-Observed Sub-Tree (GHOST) and considering only the validators
    most recent vote (Latest Message Driven, LMD). Casper FFG is a finality gadget, it modifies the fork choice by making some of the chain branches inaccessible.
    Together they are known as "Gasper".`,
    blockTime: 12, // seconds per slot
    consensusFinality: 768, // seconds, two epochs of 32 slots each
    unbondingPeriod: 777600, // current value from validatorqueue.com. Technically it is the sum of 1) Exit Queue (variable) 2) fixed waiting time (27.3 hours), 3) Validator Sweep (variable).
  },
  pruningWindow: 86400 * 18, // 18 days in seconds
  risks: {
    economicSecurity: DaEconomicSecurityRisk.OnChainQuantifiable,
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
  economicSecurity: {
    type: 'Ethereum',
  },
}
