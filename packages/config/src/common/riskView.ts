import { assert, formatSeconds, type ProjectId } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type {
  ProjectScalingRiskView,
  Sentiment,
  TableReadyValue,
  WarningWithSentiment,
} from '../types'
import { getDacSentiment } from './dataAvailability'

// State validation

export const STATE_NONE: TableReadyValue = {
  value: 'None',
  description:
    'Currently the system permits invalid state roots. More details in project overview.',
  sentiment: 'bad',
  orderHint: Number.NEGATIVE_INFINITY,
}

export const STATE_FP: TableReadyValue = {
  value: 'Fraud proofs',
  description:
    'Fraud proofs allow actors watching the chain to prove that the state is incorrect.',
  sentiment: 'good',
  orderHint: Number.POSITIVE_INFINITY,
}

export const STATE_FP_1R: TableReadyValue = {
  value: 'Fraud proofs (1R)',
  description:
    'Fraud proofs allow actors watching the chain to prove that the state is incorrect. Single round proofs (1R) only require a single transaction to resolve.',
  sentiment: 'good',
  orderHint: Number.POSITIVE_INFINITY,
}

export const STATE_FP_INT: TableReadyValue = {
  value: 'Fraud proofs (INT)',
  description:
    'Fraud proofs allow actors watching the chain to prove that the state is incorrect. Interactive proofs (INT) require multiple transactions over time to resolve.',
  sentiment: 'good',
  orderHint: Number.POSITIVE_INFINITY,
}

export const STATE_FP_INT_ZK: TableReadyValue = {
  value: 'Fraud proofs (INT, ZK)',
  description:
    'Fraud proofs allow actors watching the chain to prove that the state is incorrect. Interactive proofs (INT) require multiple transactions over time to resolve. ZK proofs are used to adjudicate the correctness of the last step.',
  sentiment: 'good',
  orderHint: Number.POSITIVE_INFINITY,
}

export const STATE_FP_1R_ZK: TableReadyValue = {
  value: 'Fraud proofs (1R, ZK)',
  description:
    'Fraud proofs allow actors watching the chain to prove that the state is incorrect. Single round proofs (1R) only require a single transaction to resolve. ZK proofs are used to prove the correctness of the state transition.',
  sentiment: 'good',
  orderHint: Number.POSITIVE_INFINITY,
}

export const STATE_FP_HYBRID_ZK: TableReadyValue = {
  value: 'Fraud proofs (1R, ZK)',
  description:
    'Fraud proofs allow actors watching the chain to prove that the state is incorrect. Single round proofs (1R) prove the validity of a state proposal, only requiring a single transaction to resolve. A fault proof eliminates a state proposal by proving that any intermediate state transition in the proposal results in a different state root. For either, a ZK proof is used.',
  sentiment: 'good',
  orderHint: Number.POSITIVE_INFINITY,
}

export const STATE_ZKP_SN: TableReadyValue = {
  value: 'ZK proofs (SN)',
  description:
    'SNARKs are zero knowledge proofs that ensure state correctness, but require trusted setup.',
  sentiment: 'good',
  orderHint: Number.POSITIVE_INFINITY,
}

export const STATE_ZKP_ST: TableReadyValue = {
  value: 'ZK proofs (ST)',
  description:
    'STARKs are zero knowledge proofs that ensure state correctness.',
  sentiment: 'good',
  orderHint: Number.POSITIVE_INFINITY,
}

export const STATE_ZKP_ST_SN_WRAP: TableReadyValue = {
  value: 'ZK proofs (ST, SN)',
  description:
    'STARKs and SNARKs are zero knowledge proofs that ensure state correctness. STARKs proofs are wrapped in SNARKs proofs for efficiency. SNARKs require a trusted setup.',
  sentiment: 'good',
  orderHint: Number.POSITIVE_INFINITY,
}

export function STATE_ZKP_L3(L2: string): TableReadyValue {
  return {
    value: 'ZK proofs',
    description: `Zero knowledge cryptography is used to ensure state correctness. Proofs are first verified on ${L2} and finally on Ethereum.`,
    sentiment: 'good',
    orderHint: Number.POSITIVE_INFINITY,
  }
}

export const STATE_EXITS_ONLY: TableReadyValue = {
  value: 'Exits only',
  description:
    'Exits from the network are subject to a period when they can be challenged. The internal network state is left unchecked.',
  sentiment: 'bad',
  orderHint: Number.NEGATIVE_INFINITY,
}

export function STATE_ARBITRUM_PERMISSIONED_FRAUD_PROOFS(
  nOfChallengers: number,
  hasAtLeastFiveExternalChallengers?: boolean,
  challengeWindowSeconds?: number,
): TableReadyValue {
  const challengePeriod = challengeWindowSeconds
    ? ` There is a ${formatSeconds(challengeWindowSeconds)} challenge period.`
    : ''

  let descriptionBase: string
  let sentiment: 'bad' | 'warning'

  if (nOfChallengers === 1) {
    descriptionBase =
      'No actor outside of the single Proposer can submit fraud proofs. ' +
      'Interactive proofs (INT) require multiple transactions over time to resolve. ' +
      'The challenge protocol can be subject to delay attacks.'
    sentiment = 'bad'
  } else if (nOfChallengers < 5) {
    descriptionBase =
      `Fraud proofs only allow ${nOfChallengers} WHITELISTED actors watching the chain to prove that the state is incorrect. ` +
      'Interactive proofs (INT) require multiple transactions over time to resolve. ' +
      'The challenge protocol can be subject to delay attacks.'
    sentiment = 'bad'
  } else if (hasAtLeastFiveExternalChallengers) {
    descriptionBase =
      `Fraud proofs allow ${nOfChallengers} WHITELISTED actors watching the chain to prove that the state is incorrect. At least 5 Challengers are external to the Operator. ` +
      'Interactive proofs (INT) require multiple transactions over time to resolve.'
    sentiment = 'warning'
  } else {
    descriptionBase =
      `Fraud proofs allow ${nOfChallengers} WHITELISTED actors watching the chain to prove that the state is incorrect. There are fewer than 5 Challengers external to the Operator among these. ` +
      'Interactive proofs (INT) require multiple transactions over time to resolve.'
    sentiment = 'bad'
  }

  return {
    value: 'Fraud proofs (INT)',
    description: descriptionBase + challengePeriod,
    sentiment: sentiment,
    orderHint: nOfChallengers,
  }
}

// Data availability

export const DATA_ON_CHAIN: TableReadyValue = {
  value: 'Onchain',
  description:
    'All of the data needed for proof construction is published on Ethereum L1.',
  sentiment: 'good',
  orderHint: Number.POSITIVE_INFINITY,
}

export const DATA_ON_CHAIN_L3: TableReadyValue = {
  value: 'Onchain',
  description:
    'All of the data needed for proof construction is published on the base chain, which ultimately gets published on Ethereum.',
  sentiment: 'good',
  orderHint: Number.POSITIVE_INFINITY,
}

export const DATA_ON_CHAIN_STATE_DIFFS: TableReadyValue = {
  value: 'Onchain (SD)',
  description:
    'All of the data (SD = state diffs) needed for proof construction is published onchain.',
  sentiment: 'good',
  orderHint: Number.POSITIVE_INFINITY,
}

export const DATA_MIXED: TableReadyValue = {
  value: 'Mixed',
  description:
    'Some of the data needed for proof construction is not published onchain.',
  sentiment: 'warning',
  orderHint: 0,
}

export const DATA_EXTERNAL_MEMO: TableReadyValue = {
  value: 'External (MEMO)',
  description: 'Transaction data is kept in MEMO decentralized storage.',
  sentiment: 'bad',
  orderHint: Number.NEGATIVE_INFINITY,
}

export function DATA_EXTERNAL_DAC(DAC?: {
  membersCount: number
  requiredSignatures: number
}): TableReadyValue {
  const additionalString =
    DAC !== undefined
      ? ` with a threshold of ${DAC.requiredSignatures}/${DAC.membersCount}`
      : ''

  return {
    value: 'External (DAC)',
    description: `Proof construction relies fully on data that is NOT published onchain. There exists a Data Availability Committee (DAC)${additionalString} that is tasked with protecting and supplying the data.`,
    sentiment: getDacSentiment(DAC),
    orderHint: DAC
      ? DAC.requiredSignatures / DAC.membersCount
      : Number.NEGATIVE_INFINITY,
  }
}

export const DATA_EXTERNAL: TableReadyValue = {
  value: 'External',
  description:
    'Proof construction and state derivation rely fully on data that is NOT published onchain.',
  sentiment: 'bad',
}

export const DATA_EXTERNAL_L3: TableReadyValue = {
  value: 'External',
  description:
    'Proof construction and state derivation rely fully on data that is ultimately NOT published on Ethereum.',
  sentiment: 'bad',
}

export const DATA_EXTERNAL_CHALLENGES: TableReadyValue = {
  value: 'External',
  description:
    'Proof construction and state derivation rely fully on data that is NOT published onchain. A custom data availability (DA) provider without attestations is used, but data unavailability can be challenged.',
  sentiment: 'bad',
}

export function DATA_CELESTIA(isUsingBlobstream: boolean): TableReadyValue {
  const additional = isUsingBlobstream
    ? ' Sequencer tx roots are checked against the Blobstream bridge data roots, signed off by Celestia validators.'
    : ' Sequencer tx roots are not checked against the Blobstream bridge data roots onchain, but L2 nodes can verify data availability by running a Celestia light client.'
  return {
    value: 'External',
    description:
      'Proof construction and state derivation fully rely on data that is posted on Celestia.' +
      additional,
    sentiment: isUsingBlobstream ? 'warning' : 'bad',
  }
}

export function DATA_AVAIL(isUsingVector: boolean): TableReadyValue {
  const additional = isUsingVector
    ? ' Transaction data is checked against the Vector bridge data roots, signed off by Avail validators.'
    : ' Transaction data is not checked against the Vector bridge data roots onchain, but L2 nodes can verify data availability by running an Avail light client.'
  return {
    value: 'External',
    description:
      'Proof construction and state derivation fully rely on data that is posted on Avail.' +
      additional,
    sentiment: isUsingVector ? 'warning' : 'bad',
  }
}

export function DATA_EIGENDA(isUsingServiceManager: boolean): TableReadyValue {
  const additional = isUsingServiceManager
    ? ' Sequencer transaction data roots are checked against the ServiceManager DA bridge data roots, signed off by EigenDA operators.'
    : ' Sequencer transaction data roots are not checked against the ServiceManager DA bridge data roots onchain.'
  return {
    value: 'External',
    description:
      'Proof construction and state derivation fully rely on data that is posted on EigenDA.' +
      additional,
    sentiment: 'bad',
  }
}

export const DATA_POS: TableReadyValue = {
  value: 'PoS network',
  description:
    'Data is guaranteed to be available by an external proof of stake network of validators. On Ethereum, DA is attested via signed block headers.',
  sentiment: 'warning',
}

// bridges

export const VALIDATED_BY_ETHEREUM: TableReadyValue = {
  value: 'Ethereum',
  description: 'Smart contracts on Ethereum validate all bridge transfers.',
  sentiment: 'good',
}

type L2sWithL3Support = ProjectId

export function VALIDATED_BY_L2(chain: L2sWithL3Support): TableReadyValue {
  return {
    value: capitalize(chain.toString()),
    description: `Smart contracts on ${chain.toString()} validate all bridge transfers. Additionally, the security of the system depends on the security of the base layer.`,
    sentiment: 'warning',
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function NATIVE_AND_CANONICAL(
  gasTokens = ['ETH'],
  isAre: 'is' | 'are' = 'is',
): TableReadyValue {
  return {
    value: 'Native & Canonical',
    description: `${gasTokens.join(', ')} transferred via this bridge ${isAre} used to pay for gas and other tokens transferred are considered canonical on the destination chain.`,
    sentiment: 'good',
  }
}

export const CANONICAL: TableReadyValue = {
  value: 'Canonical',
  description:
    'Tokens transferred are considered canonical on the destination chain.',
  sentiment: 'good',
}

export const CANONICAL_USDC: TableReadyValue = {
  value: 'Canonical',
  description:
    'USDC transferred is considered canonical as it is the basis of the perpetual protocol on the chain.',
  sentiment: 'good',
}

export const UPCOMING_RISK: TableReadyValue = {
  value: '',
  description: 'No information available.',
  sentiment: 'neutral',
}

export const UPCOMING_RISK_VIEW: ProjectScalingRiskView = {
  stateValidation: UPCOMING_RISK,
  dataAvailability: UPCOMING_RISK,
  exitWindow: UPCOMING_RISK,
  sequencerFailure: UPCOMING_RISK,
  proposerFailure: UPCOMING_RISK,
}

export const UNDER_REVIEW_RISK: TableReadyValue = {
  value: 'Under Review',
  description: 'This risk is currently under review.',
  sentiment: 'UnderReview',
}

export const UNDER_REVIEW_RISK_VIEW: ProjectScalingRiskView = {
  stateValidation: UNDER_REVIEW_RISK,
  dataAvailability: UNDER_REVIEW_RISK,
  exitWindow: UNDER_REVIEW_RISK,
  sequencerFailure: UNDER_REVIEW_RISK,
  proposerFailure: UNDER_REVIEW_RISK,
}

// SEQUENCER COLUMN

export function SEQUENCER_SELF_SEQUENCE(delay?: number): TableReadyValue {
  const delayString =
    delay !== undefined
      ? delay === 0
        ? ' There is no delay on this operation.'
        : ` There can be up to a ${formatSeconds(delay)} delay on this operation.`
      : ''
  return {
    value: 'Self sequence',
    description: `In the event of a sequencer failure, users can force transactions to be included in the project's chain by sending them to L1.${delayString}`,
    sentiment: 'good',
    orderHint: delay,
  }
}

const SEQUENCER_SELF_SEQUENCE_NO_SEQUENCER: TableReadyValue = {
  value: 'Self sequence',
  description:
    'Users can self sequence transactions by sending them on L1. There is no privileged operator.',
  sentiment: 'good',
}

export function SEQUENCER_SELF_SEQUENCE_ZK(delay?: number): TableReadyValue {
  return {
    ...SEQUENCER_SELF_SEQUENCE(delay),
    description:
      SEQUENCER_SELF_SEQUENCE(delay).description +
      ' Proposing new blocks requires creating ZK proofs.',
  }
}

export function SEQUENCER_FORCE_VIA_L1(delay?: number): TableReadyValue {
  const delayString =
    delay !== undefined ? ' for more than ' + formatSeconds(delay) : ''
  return {
    value: 'Force via L1',
    description: `Users can force the sequencer to include a withdrawal transaction by submitting a request through L1. If the sequencer censors or is down for ${delayString}, users can use the exit hatch to withdraw their funds.`,
    sentiment: 'good',
    orderHint: delay,
  }
}

export function SEQUENCER_FORCE_VIA_L1_STARKEX_PERPETUAL(
  delay: number,
): TableReadyValue {
  const delayString = formatSeconds(delay)
  return {
    value: 'Force via L1',
    description: `Users can force the sequencer to include a trade or a withdrawal transaction by submitting a request through L1. If the sequencer censors or is down for ${delayString}, users can use the exit hatch to withdraw their funds. Users are required to find a counterparty for the trade by out of system means.`,
    sentiment: 'good',
    orderHint: delay,
  }
}

export function SEQUENCER_FORCE_VIA_L1_LOOPRING(
  delay: number,
  forcedWithdrawalFee: number,
  maxAgeDepositUntilWithdrawable: number,
): TableReadyValue {
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
    orderHint: delay,
  }
}

export function SEQUENCER_ENQUEUE_VIA(layer: 'L1' | 'L2'): TableReadyValue {
  return {
    value: `Enqueue via ${layer}`,
    description: `Users can submit transactions to an ${layer} queue, but can't force them. The sequencers cannot selectively skip transactions but can stop processing the queue entirely. In other words, if the sequencers censor or are down, they are so for everyone.`,
    sentiment: 'warning',
  }
}

export function SEQUENCER_CAN_SKIP(layer: 'L1' | 'L2'): TableReadyValue {
  return {
    value: `Log via ${layer}`,
    description: `Users can submit transactions to an ${layer} map, but can't force them. When users “complain” that their transaction is stuck on L1 and not picked up by the sequencer, the Security Council minority can bypass the sequencer by posting a state root that includes it.`,
    sentiment: 'warning',
  }
}

export function SEQUENCER_NO_MECHANISM(
  isItThereButJustDisabled?: boolean,
): TableReadyValue {
  const additional =
    isItThereButJustDisabled === true
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

export const PROPOSER_CANNOT_WITHDRAW: TableReadyValue = {
  value: 'Cannot withdraw',
  description:
    'Only the whitelisted proposers can publish state roots on L1, so in the event of failure the withdrawals are frozen.',
  sentiment: 'bad',
  orderHint: Number.NEGATIVE_INFINITY,
}

export const PROPOSER_WHITELIST_GOVERNANCE: TableReadyValue = {
  value: 'Replace proposer',
  description:
    'Only the whitelisted proposers can publish state roots on L1, so in the event of failure the withdrawals are frozen. There is a decentralized Governance system that can attempt changing Proposers with an upgrade.',
  sentiment: 'warning',
  orderHint: Number.NEGATIVE_INFINITY,
}

export const PROPOSER_WHITELIST_SECURITY_COUNCIL: TableReadyValue = {
  value: 'Security Council minority',
  description:
    'Only the whitelisted proposer can update state roots on L1, so in the event of failure the withdrawals are frozen. The Security Council minority can be alerted to enforce censorship resistance because they are a permissioned Operator.',
  sentiment: 'warning',
  orderHint: Number.NEGATIVE_INFINITY,
}

export const PROPOSER_USE_ESCAPE_HATCH_ZK: TableReadyValue = {
  value: 'Use escape hatch',
  description:
    'Users are able to trustlessly exit by submitting a zero knowledge proof of funds.',
  sentiment: 'good',
  orderHint: Number.POSITIVE_INFINITY,
}

export const PROPOSER_USE_ESCAPE_HATCH_MP: TableReadyValue = {
  value: 'Use escape hatch',
  description:
    'Users are able to trustlessly exit by submitting a Merkle proof of funds.',
  sentiment: 'good',
  orderHint: Number.POSITIVE_INFINITY,
}

export const PROPOSER_USE_ESCAPE_HATCH_MP_NFT: TableReadyValue = {
  ...PROPOSER_USE_ESCAPE_HATCH_MP,
  description:
    PROPOSER_USE_ESCAPE_HATCH_MP.description +
    ' NFTs will be minted on L1 to exit.',
  orderHint: Number.POSITIVE_INFINITY,
}

export const PROPOSER_USE_ESCAPE_HATCH_MP_AVGPRICE: TableReadyValue = {
  ...PROPOSER_USE_ESCAPE_HATCH_MP,
  description:
    PROPOSER_USE_ESCAPE_HATCH_MP.description +
    ' Positions will be closed using the average price from the last batch state update.',
  orderHint: Number.POSITIVE_INFINITY,
}

export function PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED(
  delay: number,
): TableReadyValue {
  const delayString = formatSeconds(delay)
  return {
    value: 'Self propose',
    description: `Anyone can become a Proposer after ${delayString} of inactivity from the currently whitelisted Proposers.`,
    sentiment: 'good',
    orderHint: delay,
  }
}

export function PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED_ZK(
  delay: number,
): TableReadyValue {
  const delayString = formatSeconds(delay)
  return {
    value: 'Self propose',
    description: `The primary whitelisted proposer has an optimistic advantage, letting them win by default if no conflicting proposals are made. This privilege is dropped after ${delayString} of inactivity, and anyone can leverage the source available zk prover to prove a fault or a conflicting valid proposal to win against the privileged proposer and/or supply a bond and make a counter proposal at any time.`,
    sentiment: 'good',
    orderHint: delay,
  }
}

export const PROPOSER_SELF_PROPOSE_ZK: TableReadyValue = {
  value: 'Self propose',
  description:
    'If the Proposer fails, users can leverage the source available prover to submit proofs to the L1 bridge.',
  sentiment: 'good',
}

export const PROPOSER_SELF_PROPOSE_ROOTS: TableReadyValue = {
  value: 'Self propose',
  description:
    'Anyone can be a Proposer and propose new roots to the L1 bridge.',
  sentiment: 'good',
  orderHint: 0,
}

function PROPOSER_POS(
  stakedValidatorSetSize: number,
  validatorSetSizeCap: number,
): TableReadyValue {
  return {
    value: 'Cannot withdraw',
    description: `The PoS network is composed of ${stakedValidatorSetSize} validators. Blocks are included in the chain only if signed by 2/3+1 of the network stake. It's currently not possible to join the set if the validator cap is reached. The current validator cap is set to ${validatorSetSizeCap}. In the event of a failure in reaching consensus, withdrawals are frozen.`,
    sentiment: 'warning',
  }
}

export function EXIT_WINDOW(
  upgradeDelay: number,
  exitDelay: number,
  options: {
    upgradeDelay2?: number
    existsBlocklist?: boolean
    multisig?: { threshold: number; count: number }
  } = {},
): TableReadyValue & { seconds?: number } {
  let window: number = upgradeDelay - exitDelay
  const windowText = window <= 0 ? 'None' : formatSeconds(window)
  if (options.upgradeDelay2 !== undefined) {
    const window2: number = options.upgradeDelay2 - exitDelay
    const windowString2 = window2 <= 0 ? 'None' : formatSeconds(window2)
    if (windowText !== windowString2) {
      window = Math.min(window, window2)
    }
  }
  let sentiment: Sentiment
  if (window < 7 * 24 * 60 * 60) {
    sentiment = 'bad'
  } else if (window < 30 * 24 * 60 * 60) {
    sentiment = 'warning'
  } else {
    sentiment = 'good'
  }
  const instantlyUpgradable =
    upgradeDelay === 0 ? ' since contracts are instantly upgradable' : ''
  const description =
    (windowText === 'None'
      ? `There is no window for users to exit in case of an unwanted regular upgrade${instantlyUpgradable}.`
      : `Users have ${windowText} to exit funds in case of an unwanted regular upgrade. There is a ${formatSeconds(
          upgradeDelay,
        )} delay before a regular upgrade is applied${instantlyUpgradable}, and withdrawals can take up to ${formatSeconds(
          exitDelay,
        )} to be processed.`) +
    (options.existsBlocklist
      ? ' Users can be explicitly censored from withdrawing (Blocklist on L1).'
      : '')

  return {
    value: windowText,
    description: description,
    secondLine: options.multisig
      ? `${options.multisig.threshold}/${options.multisig.count} Multisig`
      : undefined,
    sentiment,
    orderHint: window,
  }
}

export function EXIT_WINDOW_ZKSTACK(upgradeDelay: number): TableReadyValue {
  return {
    value: 'None',
    sentiment: 'bad',
    description: `There is no window for users to exit in case of an unwanted standard upgrade because the central operator can censor withdrawal transactions by implementing a TransactionFilterer with no delay. The standard upgrade delay is ${formatSeconds(
      upgradeDelay,
    )}.`,
  }
}

export function EXIT_WINDOW_NITRO(
  l2TimelockDelay: number,
  selfSequencingDelay: number,
  challengeWindowSeconds: number,
  validatorAfkTime: number,
  l1TimelockDelay: number,
  isPostBoLD: boolean,
): TableReadyValue {
  const description = `Non-emergency upgrades are initiated on L2 and go through a ${formatSeconds(
    l2TimelockDelay,
  )} delay. Since there is a ${formatSeconds(
    selfSequencingDelay,
  )} delay to force a tx (forcing the inclusion in the following state update), users have only ${formatSeconds(
    l2TimelockDelay - selfSequencingDelay,
  )} to exit. 
    
  If users post a tx after that time, they would only be able to self propose a state root ${formatSeconds(
    isPostBoLD ? validatorAfkTime : challengeWindowSeconds + validatorAfkTime, // see `_validatorIsAfk()` https://etherscan.io/address/0xA0Ed0562629D45B88A34a342f20dEb58c46C15ff#code#F1#L43
  )} after the last state root was proposed and then wait for the ${formatSeconds(
    challengeWindowSeconds,
  )} challenge window, while the upgrade would be confirmed just after the ${formatSeconds(
    challengeWindowSeconds,
  )} challenge window and the ${formatSeconds(l1TimelockDelay)} L1 timelock.`
  const warning: WarningWithSentiment = {
    value: 'The Security Council can upgrade with no delay.',
    sentiment: 'bad',
  }
  return {
    ...EXIT_WINDOW(l2TimelockDelay, selfSequencingDelay),
    description: description,
    warning: warning,
  }
}

export function EXIT_WINDOW_PERMISSIONLESS_BOLD(
  l2TimelockDelay: number,
  selfSequencingDelay: number,
  l1TimelockDelay: number,
): TableReadyValue {
  const description = `Non-emergency upgrades are initiated on L2 and go through a ${formatSeconds(l2TimelockDelay)} delay on L2 and a ${formatSeconds(l1TimelockDelay)} delay on L1. Since there is a ${formatSeconds(selfSequencingDelay)} delay to force a tx (forcing the inclusion in the following state update), users have ${formatSeconds(l2TimelockDelay + l1TimelockDelay - selfSequencingDelay)} to exit.`
  const warning: WarningWithSentiment = {
    value: 'The Security Council can upgrade with no delay.',
    sentiment: 'bad',
  }
  return {
    ...EXIT_WINDOW(l2TimelockDelay + l1TimelockDelay, selfSequencingDelay),
    description: description,
    warning: warning,
  }
}

export const EXIT_WINDOW_NON_UPGRADABLE: TableReadyValue = {
  value: '∞',
  description:
    'Users can exit funds at any time because contracts are not upgradeable.',
  sentiment: 'good',
  orderHint: Number.POSITIVE_INFINITY,
}

export const EXIT_WINDOW_UNKNOWN: TableReadyValue = {
  value: 'Unknown',
  description:
    'Some contracts are not verified, so there is no way to assess the exit window.',
  sentiment: 'bad',
  orderHint: Number.NEGATIVE_INFINITY,
}

export function EXIT_WINDOW_STARKNET(upgradeDelay: number): TableReadyValue {
  const scReactionTime = 60 * 60 * 24 * 1 // time needed for the sc minority to be alerted and prove/propose a new state root
  const value = formatSeconds(upgradeDelay - scReactionTime)
  return {
    value,
    sentiment: 'warning',
    description: `Standard upgrades are initiated on L1 and go through a ${formatSeconds(upgradeDelay)} delay. In case users are censored, the Security Council minority can be alerted to enforce censorship resistance by submitting a new state root. This process is assumed to take ${formatSeconds(scReactionTime)}.`,
    warning: {
      value: 'The Security Council can upgrade with no delay.',
      sentiment: 'bad',
    },
  }
}

export const RISK_VIEW = {
  // stateValidation
  STATE_NONE,
  STATE_FP,
  STATE_FP_1R,
  STATE_FP_INT,
  STATE_FP_INT_ZK,
  STATE_FP_1R_ZK,
  STATE_FP_HYBRID_ZK,
  STATE_ZKP_SN,
  STATE_ZKP_ST,
  STATE_ZKP_ST_SN_WRAP,
  STATE_ZKP_L3,
  STATE_EXITS_ONLY,
  STATE_ARBITRUM_PERMISSIONED_FRAUD_PROOFS,

  // dataAvailability
  DATA_ON_CHAIN,
  DATA_ON_CHAIN_STATE_DIFFS,
  DATA_ON_CHAIN_L3,
  DATA_MIXED,
  DATA_EXTERNAL_DAC,
  DATA_EXTERNAL_MEMO,
  DATA_EXTERNAL,
  DATA_EXTERNAL_L3,
  DATA_EXTERNAL_CHALLENGES,
  DATA_CELESTIA,
  DATA_AVAIL,
  DATA_EIGENDA,
  DATA_POS,

  // validatedBy
  VALIDATED_BY_ETHEREUM,
  VALIDATED_BY_L2,

  // destinationToken
  NATIVE_AND_CANONICAL,
  CANONICAL,
  CANONICAL_USDC,

  // sequencerFailure
  SEQUENCER_SELF_SEQUENCE,
  SEQUENCER_SELF_SEQUENCE_ZK,
  SEQUENCER_SELF_SEQUENCE_NO_SEQUENCER,
  SEQUENCER_FORCE_VIA_L1,
  SEQUENCER_FORCE_VIA_L1_STARKEX_PERPETUAL,
  SEQUENCER_FORCE_VIA_L1_LOOPRING,
  SEQUENCER_ENQUEUE_VIA,
  SEQUENCER_CAN_SKIP,
  SEQUENCER_NO_MECHANISM,

  // proposerFailure
  PROPOSER_CANNOT_WITHDRAW,
  PROPOSER_WHITELIST_GOVERNANCE,
  PROPOSER_WHITELIST_SECURITY_COUNCIL,
  PROPOSER_USE_ESCAPE_HATCH_ZK,
  PROPOSER_USE_ESCAPE_HATCH_MP,
  PROPOSER_USE_ESCAPE_HATCH_MP_NFT,
  PROPOSER_USE_ESCAPE_HATCH_MP_AVGPRICE,
  PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED,
  PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED_ZK,
  PROPOSER_SELF_PROPOSE_ZK,
  PROPOSER_SELF_PROPOSE_ROOTS,
  PROPOSER_POS,

  // exitWindow
  EXIT_WINDOW,
  EXIT_WINDOW_NITRO,
  EXIT_WINDOW_PERMISSIONLESS_BOLD,
  EXIT_WINDOW_ZKSTACK,
  EXIT_WINDOW_NON_UPGRADABLE,
  EXIT_WINDOW_UNKNOWN,
  EXIT_WINDOW_STARKNET,

  UNDER_REVIEW_RISK,
}

export function pickWorseRisk(
  a: TableReadyValue,
  b: TableReadyValue,
): TableReadyValue {
  const sentimentValue: Record<Sentiment, number> = {
    good: 0,
    neutral: 1,
    warning: 2,
    bad: 3,
    UnderReview: 4,
  }

  const aVal = sentimentValue[a.sentiment ?? 'neutral']
  const bVal = sentimentValue[b.sentiment ?? 'neutral']
  if (aVal === bVal) {
    assert(
      a.orderHint !== undefined && b.orderHint !== undefined,
      'Unable to pick worse risk without a defining metric',
    )
    return a.orderHint < b.orderHint ? a : b
  }
  if (aVal > bVal) {
    return a
  }

  return b
}

export function sumRisk(
  a: TableReadyValue,
  b: TableReadyValue,
  formattingFunction: (delay: number) => TableReadyValue,
): TableReadyValue {
  if (
    a.sentiment !== 'bad' &&
    b.sentiment !== 'bad' &&
    a.sentiment === b.sentiment
  ) {
    assert(
      a.orderHint !== undefined && b.orderHint !== undefined,
      'Cannot sum good risks without delaySeconds',
    )
    return formattingFunction(a.orderHint + b.orderHint)
  }

  return pickWorseRisk(a, b)
}
