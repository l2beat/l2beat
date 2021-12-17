export interface ContractDescription {
  abi: AbiEntry[]
}

type AbiEntry = string | { type: 'array'; method: string }

export interface Config {
  [name: string]: ContractDescription
}

export const config: Config = {
  Rollup: {
    abi: [
      'function delayedBridge() view returns (address)',
      'function outbox() view returns (address)',
      'function rollupEventBridge() view returns (address)',
      'function sequencerBridge() view returns (address)',
      'function owner() view returns (address)',
      'function stakerCount() view returns (uint256)',
      'function paused() view returns (bool)',
      'function arbGasSpeedLimitPerBlock() view returns (uint256)',
      'function avmGasSpeedLimitPerBlock() view returns (uint256)',
      'function challengeFactory() view returns (address)',
      'function nodeFactory() view returns (address)',
    ],
  },
  L1GatewayRouter: {
    abi: [
      'function owner() view returns (address)',
      'function whitelist() view returns (address)',
      'function router() view returns (address)',
      'function inbox() view returns (address)',
    ],
  },
  L1ERC20Gateway: {
    abi: [
      'function whitelist() view returns (address)',
      'function router() view returns (address)',
      'function inbox() view returns (address)',
    ],
  },
  Bridge: {
    abi: [
      'function owner() view returns (address)',
      {
        type: 'array',
        method: 'function allowedInboxList(uint index) view returns(address)',
      },
      {
        type: 'array',
        method: 'function allowedOutboxList(uint index) view returns(address)',
      },
    ],
  },
  SequencerInbox: {
    abi: [
      'function maxDelaySeconds() view returns (uint256)',
      'function sequencer() view returns (address)',
      'function delayedInbox() view returns (address)',
      'function rollup() view returns (address)',
    ],
  },
  RollupEventBridge: {
    abi: [],
  },
  Outbox: {
    abi: [
      'function rollup() view returns (address)',
      'function bridge() view returns (address)',
    ],
  },
  OldOutbox: {
    abi: [
      'function rollup() view returns (address)',
      'function bridge() view returns (address)',
      'function beacon() view returns (address)',
    ],
  },
  ProxyAdmin: {
    abi: ['function owner() view returns (address)'],
  },
  Whitelist: {
    abi: ['function owner() view returns (address)'],
  },
  NodeFactory: {
    abi: ['function beacon() view returns (address)'],
  },
  ChallengeFactory: {
    abi: ['function beacon() view returns (address)'],
  },
  UpgradeableBeacon: {
    abi: [
      'function implementation() view returns (address)',
      'function owner() view returns (address)',
    ],
  },
  Inbox: {
    abi: [
      'function whitelist() view returns (address)',
      'function bridge() view returns (address)',
    ],
  },
  GnosisSafeProxy: {
    abi: [
      'function getThreshold() view returns (uint256)',
      'function getOwners() view returns (address[])',
    ],
  },
}
