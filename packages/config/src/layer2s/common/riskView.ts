import { utils } from 'ethers'

import { ProjectRiskViewEntry } from '../../common'
import { formatSeconds } from '../../utils/formatSeconds'
import { roundSeconds } from '../../utils/roundSeconds'
import { Layer2RiskView } from '../types'
import { DANGER_DELAY_THRESHOLD_SECONDS } from './constants'

export function makeBridgeCompatible(
  entry: Omit<Layer2RiskView, 'sourceUpgradeability'>,
): Layer2RiskView {
  return {
    ...entry,
    sourceUpgradeability: entry.upgradeability,
  }
}

// State validation

export const STATE_FP: ProjectRiskViewEntry = {
  value: 'Fraud proofs',
  description:
    'Fraud proofs allow actors watching the chain to prove that the state is incorrect.',
  sentiment: 'good',
}

export const STATE_FP_1R: ProjectRiskViewEntry = {
  value: 'Fraud proofs (1R)',
  description:
    'Fraud proofs allow actors watching the chain to prove that the state is incorrect. Single round proofs (1R) only require a single transaction to resolve.',
  sentiment: 'good',
}

export const STATE_FP_INT: ProjectRiskViewEntry = {
  value: 'Fraud proofs (INT)',
  description:
    'Fraud proofs allow actors watching the chain to prove that the state is incorrect. Interactive proofs (INT) require multiple transactions over time to resolve.',
  sentiment: 'good',
}

export const STATE_ZKP_SN: ProjectRiskViewEntry = {
  value: 'ZK proofs (SN)',
  description:
    'ZK-SNARKS are zero knowledge proofs that ensure state correctness, but require trusted setup.',
  sentiment: 'good',
}

export const STATE_ZKP_ST: ProjectRiskViewEntry = {
  value: 'ZK proofs (ST)',
  description:
    'ZK-STARKS are zero knowledge proofs that ensure state correctness.',
  sentiment: 'good',
}

export const STATE_EXITS_ONLY: ProjectRiskViewEntry = {
  value: 'Exits only',
  description:
    'Exits from the network are subject to a period when they can be challenged. The internal network state is left unchecked.',
  sentiment: 'bad',
}

// Data availability

export const DATA_ON_CHAIN: ProjectRiskViewEntry = {
  value: 'On chain',
  description:
    'All of the data needed for proof construction is published on chain.',
  sentiment: 'good',
}

export const DATA_ON_CHAIN_STATE_DIFFS: ProjectRiskViewEntry = {
  value: 'On chain (SD)',
  description:
    'All of the data (SD = state diffs) needed for proof construction is published on chain.',
  sentiment: 'good',
}

export const DATA_MIXED: ProjectRiskViewEntry = {
  value: 'Mixed',
  description:
    'Some of the data needed for proof construction is not published on chain.',
  sentiment: 'warning',
}

export const DATA_EXTERNAL_MEMO: ProjectRiskViewEntry = {
  value: 'Optimistic (MEMO)',
  description:
    'Transaction data is kept in MEMO decentralized storage. Validators can force Sequencer to make data available on-chain via L1 contract call if they find that Sequencer did not push tx data to MEMO. \
    Challenge mechanizm is not yet fully implemented.',
  sentiment: 'warning',
}

export const DATA_EXTERNAL_DAC: ProjectRiskViewEntry = {
  value: 'External (DAC)',
  description:
    'Proof construction relies fully on data that is NOT published on chain. There exists a data availability committee (DAC) that is tasked with protecting and supplying the data.',
  sentiment: 'warning',
}

export const DATA_EXTERNAL: ProjectRiskViewEntry = {
  value: 'External',
  description:
    'Proof construction relies fully on data that is NOT published on chain.',
  sentiment: 'bad',
}

// Upgradable

export const UPGRADABLE_YES: ProjectRiskViewEntry = {
  value: 'Yes',
  description:
    'The code that secures the system can be changed arbitrarily and without notice.',
  sentiment: 'bad',
}

export function UPGRADABLE_ARBITRUM(delay: number): ProjectRiskViewEntry {
  const delayString = formatSeconds(delay)
  const delayStringRounded = '~' + formatSeconds(roundSeconds(delay, 60 * 60)) // round to nearest hour
  return {
    value: `${delayStringRounded} or no delay`,
    description: `There is a ${delayString} delay for upgrades initiated by the DAO that can be canceled by the Security Council multisig. This multisig can also upgrade with no delay.`,
    sentiment: 'warning',
  }
}

export function UPGRADABLE_POLYGON_ZKEVM(
  delay: string,
  rollupEmergencyState: boolean,
  bridgeEmergencyState: boolean,
): ProjectRiskViewEntry {
  return {
    value: `${delay} or no delay`,
    description: `There is a ${delay} delay for upgrades initiated by the Admin. The Security Council can switch on EmergencyState in which there is no upgrade delay. Currently rollup emergency state is set to ${rollupEmergencyState.toString()}, bridge emergency state is set to ${bridgeEmergencyState.toString()}.`,
    sentiment: 'warning',
  }
}

export function UPGRADABLE_ZKSYNC(
  delay: string,
  securityCouncil: string,
): ProjectRiskViewEntry {
  return {
    value: `${delay} or no delay`,
    description: `There is ${delay} for upgrades initiated by ZkSync Multisig. The ${securityCouncil} Security Council can override the delay and allow instant upgrade. Some system components can be changed with no delay but that do not impede the ability for users to withdraw permissionlessly.`,
    sentiment: 'warning',
  }
}

export function UPGRADE_DELAY(delay: string): ProjectRiskViewEntry {
  return {
    value: `${delay} delay`,
    description:
      'The code that secures the system can be changed arbitrarily but users have some time to react.',
    sentiment: 'warning',
  }
}

function UPGRADE_DELAY_SECONDS(delay: number): ProjectRiskViewEntry {
  if (delay < DANGER_DELAY_THRESHOLD_SECONDS) {
    return UPGRADABLE_YES
  }
  const delayString = formatSeconds(delay)
  return UPGRADE_DELAY(delayString)
}

export const UPGRADABLE_NO: ProjectRiskViewEntry = {
  value: 'No',
  description: 'The code that secures the system can never change.',
  sentiment: 'good',
}

// bridges

export const VALIDATED_BY_ETHEREUM: ProjectRiskViewEntry = {
  value: 'Ethereum',
  description: 'Smart contracts on Ethereum validate all bridge transfers.',
  sentiment: 'good',
}

export function NATIVE_AND_CANONICAL(
  nativeTokens = 'ETH',
  isAre: 'is' | 'are' = 'is',
): ProjectRiskViewEntry {
  return {
    value: 'Native & Canonical',
    description: `${nativeTokens} transferred via this bridge ${isAre} used to pay for gas and other tokens transferred are considered canonical on the destination chain.`,
    sentiment: 'good',
  }
}

export const CANONICAL: ProjectRiskViewEntry = {
  value: 'Canonical',
  description:
    'Tokens transferred are considered canonical on the destination chain.',
  sentiment: 'good',
}

export const CANONICAL_USDC: ProjectRiskViewEntry = {
  value: 'Canonical',
  description:
    'USDC transferred is considered canonical as it is the basis of the perpetual protocol on the chain.',
  sentiment: 'good',
}

export const UPCOMING_RISK: ProjectRiskViewEntry = {
  value: '',
  description: 'No information available.',
  sentiment: 'neutral',
}

export const UPCOMING_RISK_VIEW: Layer2RiskView = makeBridgeCompatible({
  stateValidation: UPCOMING_RISK,
  dataAvailability: UPCOMING_RISK,
  upgradeability: UPCOMING_RISK,
  sequencerFailure: UPCOMING_RISK,
  proposerFailure: UPCOMING_RISK,
  destinationToken: UPCOMING_RISK,
  validatedBy: UPCOMING_RISK,
})

export const UNDER_REVIEW_RISK: ProjectRiskViewEntry = {
  value: 'Under Review',
  description: 'This risk is currently under review.',
  sentiment: 'UnderReview',
}

export const UNDER_REVIEW_RISK_VIEW: Layer2RiskView = makeBridgeCompatible({
  stateValidation: UNDER_REVIEW_RISK,
  dataAvailability: UNDER_REVIEW_RISK,
  upgradeability: UNDER_REVIEW_RISK,
  sequencerFailure: UNDER_REVIEW_RISK,
  proposerFailure: UNDER_REVIEW_RISK,
  destinationToken: UNDER_REVIEW_RISK,
  validatedBy: UNDER_REVIEW_RISK,
})

/* New risks for stages */

// SEQUENCER COLUMN

export function SEQUENCER_SELF_SEQUENCE(delay?: number): ProjectRiskViewEntry {
  const delayString =
    delay !== undefined
      ? delay === 0
        ? ' There is no delay on this operation.'
        : ` There is a ${formatSeconds(delay)} delay on this operation.`
      : ''
  return {
    value: 'Self sequence',
    description: `In the event of a sequencer failure, users can force transactions to be included in the L2 chain by sending them to L1.${delayString}`,
    sentiment: 'good',
  }
}

export function SEQUENCER_SELF_SEQUENCE_ZK(
  delay?: number,
): ProjectRiskViewEntry {
  return {
    ...SEQUENCER_SELF_SEQUENCE(delay),
    description:
      SEQUENCER_SELF_SEQUENCE(delay).description +
      ' Proposing new blocks requires creating ZK proofs.',
  }
}

export function SEQUENCER_FORCE_VIA_L1(delay?: number): ProjectRiskViewEntry {
  const delayString =
    delay !== undefined ? ' for more than ' + formatSeconds(delay) : ''
  return {
    value: 'Force via L1',
    description: `Users can force the sequencer to include a withdrawal transaction by submitting a request through L1. If the sequencer censors or is down for ${delayString}, users can use the exit hatch to withdraw their funds.`,
    sentiment: 'good',
  }
}

export function SEQUENCER_FORCE_VIA_L1_STARKEX_PERPETUAL(
  delay: number,
): ProjectRiskViewEntry {
  const delayString = formatSeconds(delay)
  return {
    value: 'Force via L1',
    description: `Users can force the sequencer to include a trade or a withdrawal transaction by submitting a request through L1. If the sequencer censors or is down for ${delayString}, users can use the exit hatch to withdraw their funds. Users are required to find a counterparty for the trade by out of system means.`,
    sentiment: 'good',
  }
}

export function SEQUENCER_FORCE_VIA_L1_LOOPRING(
  delay: number,
  forcedWithdrawalFee: number,
  maxAgeDepositUntilWithdrawable: number,
): ProjectRiskViewEntry {
  const delayString = formatSeconds(delay)
  const maxAgeDepositUntilWithdrawableString = formatSeconds(
    maxAgeDepositUntilWithdrawable,
  )
  const forcedWithdrawalFeeString = `${utils.formatEther(
    forcedWithdrawalFee,
  )} ETH`
  return {
    value: 'Force via L1',
    description: `Users can force the sequencer to include a withdrawal transaction by submitting a request through L1 with a ${forcedWithdrawalFeeString} fee. If the sequencer is down for more than ${delayString}, users can use the exit hatch to withdraw their funds. The sequencer can censor individual deposits, but in such case after ${maxAgeDepositUntilWithdrawableString} users can get their funds back.`,
    sentiment: 'good',
  }
}

export const SEQUENCER_ENQUEUE_VIA_L1: ProjectRiskViewEntry = {
  value: 'Enqueue via L1',
  description:
    "Users can submit transactions to an L1 queue, but can't force them. The sequencer cannot selectively skip transactions but can stop processing the queue entirely. In other words, if the sequencer censors or is down, it is so for everyone.",
  sentiment: 'warning',
}

export function SEQUENCER_NO_MECHANISM(
  disabled?: boolean,
): ProjectRiskViewEntry {
  const additional =
    disabled === true
      ? ' Although the functionality exists in the code, it is currently disabled.'
      : ''
  return {
    value: 'No mechanism',
    description:
      'There is no mechanism to have transactions be included if the sequencer is down or censoring.' +
      additional,
    sentiment: 'bad',
  }
}

// PROPOSER COLUMN

export const PROPOSER_CANNOT_WITHDRAW: ProjectRiskViewEntry = {
  value: 'Cannot withdraw',
  description:
    'Only the whitelisted proposers can publish L2 state roots on L1, so in the event of failure the withdrawals are frozen.',
  sentiment: 'bad',
}

export const PROPOSER_USE_ESCAPE_HATCH_ZK: ProjectRiskViewEntry = {
  value: 'Use escape hatch',
  description:
    'Users are able to trustlessly exit by submitting a zero knowledge proof of funds.',
  sentiment: 'good',
}

export const PROPOSER_USE_ESCAPE_HATCH_MP: ProjectRiskViewEntry = {
  value: 'Use escape hatch',
  description:
    'Users are able to trustlessly exit by submitting a Merkle proof of funds.',
  sentiment: 'good',
}

export const PROPOSER_USE_ESCAPE_HATCH_MP_NFT: ProjectRiskViewEntry = {
  ...PROPOSER_USE_ESCAPE_HATCH_MP,
  description:
    PROPOSER_USE_ESCAPE_HATCH_MP.description +
    ' NFTs will be minted on L1 to exit.',
}

export const PROPOSER_USE_ESCAPE_HATCH_MP_AVGPRICE: ProjectRiskViewEntry = {
  ...PROPOSER_USE_ESCAPE_HATCH_MP,
  description:
    PROPOSER_USE_ESCAPE_HATCH_MP.description +
    ' Positions will be closed using the average price from the last batch state update.',
}

export function PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED(
  delay: number,
): ProjectRiskViewEntry {
  const delayString = formatSeconds(delay)
  return {
    value: 'Self propose',
    description: `Anyone can become a Proposer after ${delayString} of inactivity from the currently whitelisted Proposers.`,
    sentiment: 'good',
  }
}

export const PROPOSER_SELF_PROPOSE_ZK: ProjectRiskViewEntry = {
  value: 'Self propose',
  description:
    'If the Proposer fails, users can leverage the open source prover to submit proofs to the L1 bridge.',
  sentiment: 'good',
}

export const PROPOSER_SELF_PROPOSE_ROOTS: ProjectRiskViewEntry = {
  value: 'Self propose',
  description:
    'Anyone can be a Proposer and propose new roots to the L1 bridge.',
  sentiment: 'good',
}

export const RISK_VIEW = {
  STATE_FP,
  STATE_FP_1R,
  STATE_FP_INT,
  STATE_ZKP_SN,
  STATE_ZKP_ST,
  STATE_EXITS_ONLY,
  DATA_ON_CHAIN,
  DATA_ON_CHAIN_STATE_DIFFS,
  DATA_MIXED,
  DATA_EXTERNAL_DAC,
  DATA_EXTERNAL_MEMO,
  DATA_EXTERNAL,
  UPGRADABLE_YES,
  UPGRADABLE_ARBITRUM,
  UPGRADABLE_POLYGON_ZKEVM,
  UPGRADABLE_ZKSYNC,
  UPGRADE_DELAY,
  UPGRADE_DELAY_SECONDS,
  UPGRADABLE_NO,
  VALIDATED_BY_ETHEREUM,
  NATIVE_AND_CANONICAL,
  CANONICAL,
  CANONICAL_USDC,
  SEQUENCER_SELF_SEQUENCE,
  SEQUENCER_SELF_SEQUENCE_ZK,
  SEQUENCER_FORCE_VIA_L1,
  SEQUENCER_FORCE_VIA_L1_STARKEX_PERPETUAL,
  SEQUENCER_FORCE_VIA_L1_LOOPRING,
  SEQUENCER_ENQUEUE_VIA_L1,
  SEQUENCER_NO_MECHANISM,
  PROPOSER_CANNOT_WITHDRAW,
  PROPOSER_USE_ESCAPE_HATCH_ZK,
  PROPOSER_USE_ESCAPE_HATCH_MP,
  PROPOSER_USE_ESCAPE_HATCH_MP_NFT,
  PROPOSER_USE_ESCAPE_HATCH_MP_AVGPRICE,
  PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED,
  PROPOSER_SELF_PROPOSE_ZK,
  PROPOSER_SELF_PROPOSE_ROOTS,
  UNDER_REVIEW_RISK,
}
