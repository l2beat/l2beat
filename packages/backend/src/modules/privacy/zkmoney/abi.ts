import { utils } from 'ethers'

/** Events and views of the portal, the SIPA clones and the SIPA factory. */
export const zkMoneyInterface = new utils.Interface([
  'event Deposit(bytes32 indexed recipientCommitment, uint256 amount, bytes32 key, uint256 index)',
  'event WithdrawalOrRefund(uint8 indexed flow, bytes32 indexed nullifier, address indexed executor, uint256 executionAmount)',
  'event Sweep(uint256 index, uint256 amount)',
  'event Recovered(address indexed token, address indexed target, uint256 amount)',
  'function cloneImplementation(address clone) view returns (address)',
  'function sipaIntentOf(address sipa) view returns (uint8)',
])

export const DEPOSIT_TOPIC = zkMoneyInterface.getEventTopic('Deposit')
export const WITHDRAWAL_TOPIC =
  zkMoneyInterface.getEventTopic('WithdrawalOrRefund')
export const SWEEP_TOPIC = zkMoneyInterface.getEventTopic('Sweep')
export const RECOVERED_TOPIC = zkMoneyInterface.getEventTopic('Recovered')
