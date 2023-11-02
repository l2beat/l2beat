import {
  EthereumAddress,
  formatLargeNumberShared,
  ProjectId,
} from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { formatSeconds } from '../utils/formatSeconds'
import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
} from './common'
import { FORCE_TRANSACTIONS } from './common/forceTransactions'
import { RISK_VIEW } from './common/riskView'
import { getStage } from './common/stages/getStage'
import { STATE_CORRECTNESS } from './common/stateCorrectness'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('paradex')
const verifierAddress = discovery.getAddressFromValue('Paradex', 'verifier')

const upgradeDelaySeconds = discovery.getContractUpgradeabilityParam(
  'Paradex',
  'upgradeDelay',
)

const escrowUSDCDelaySeconds = discovery.getContractUpgradeabilityParam(
  'USDC Bridge',
  'upgradeDelay',
)

const minDelay = Math.min(upgradeDelaySeconds, escrowUSDCDelaySeconds)

function formatMaxTotalBalanceString(
  ticker: string,
  maxTotalBalance: number,
  decimals: number,
) {
  return `The current bridge cap is ${formatLargeNumberShared(
    maxTotalBalance / 10 ** decimals,
  )} ${ticker}.`
}

const escrowUSDCMaxTotalBalanceString = formatMaxTotalBalanceString(
  'USDC',
  discovery.getContractValue<number>('USDC Bridge', 'maxTotalBalance'),
  6,
)

export const paradex: Layer2 = {
  isUnderReview: true,
  type: 'layer2',
  id: ProjectId('paradex'),
  display: {
    name: 'Paradex',
    slug: 'paradex',
    description:
      'Paradex is a high-performance crypto-derivatives exchange built on a Starknet Appchain.',
    purpose: 'Exchange',
    category: 'ZK Rollup',
    links: {
      websites: ['https://www.paradex.trade/'],
      apps: ['https://app.paradex.trade'],
      documentation: ['https://docs.paradex.trade/'],
      explorers: [],
      repositories: ['https://github.com/tradeparadex'],
      socialMedia: ['https://twitter.com/tradeparadex'],
    },
  },
  stage: {
    stage: 'UnderReview',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3'),
        tokens: ['USDC'],
        upgradableBy: ['USDC Escrow owner'],
        upgradeDelay: formatSeconds(escrowUSDCDelaySeconds),
        description: 'Paradex USDC Escrow.',
      }),
    ],
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_ST,
      sources: [
        {
          contract: 'Paradex',
          references: [
            'https://etherscan.io/address/0xA964D693cd45FCBe4303524E0EFe0988cfF5ed08#code#F1#L218',
          ],
        },
      ],
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN_STATE_DIFFS,
      sources: [
        {
          contract: 'Paradex',
          references: [
            'https://etherscan.io/address/0xA964D693cd45FCBe4303524E0EFe0988cfF5ed08#code#F1#L213',
          ],
        },
      ],
    },
    upgradeability: RISK_VIEW.UPGRADE_DELAY_SECONDS(minDelay),
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_NO_MECHANISM(),
      sources: [
        {
          contract: 'Paradex',
          references: [
            'https://etherscan.io/address/0xA964D693cd45FCBe4303524E0EFe0988cfF5ed08#code#F1#L199',
          ],
        },
      ],
    },
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
    destinationToken: RISK_VIEW.CANONICAL_USDC,
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeSourceAvailable: 'UnderReview',
    },
    stage1: {
      stateVerificationOnL1: true,
      fraudProofSystemAtLeast5Outsiders: null,
      usersHave7DaysToExit: false,
      usersCanExitWithoutCooperation: false,
      securityCouncilProperlySetUp: null,
    },
    stage2: {
      proofSystemOverriddenOnlyInCaseOfABug: null,
      fraudProofSystemIsPermissionless: null,
      delayWith30DExitWindow: false,
    },
  }),
  technology: {
    stateCorrectness: STATE_CORRECTNESS.VALIDITY_PROOFS,
    newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
    dataAvailability: DATA_AVAILABILITY.STARKNET_ON_CHAIN,
    operator: OPERATOR.CENTRALIZED_OPERATOR,
    forceTransactions: {
      ...FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
      references: [
        {
          text: 'Censorship resistance of Starknet - Forum Discussion',
          href: 'https://community.starknet.io/t/censorship-resistance/196',
        },
      ],
    },
    exitMechanisms: EXITS.STARKNET,
  },
  contracts: CONTRACTS.UNDER_REVIEW,
}
