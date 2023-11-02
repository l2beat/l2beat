import {
  EthereumAddress,
  formatLargeNumberShared,
  ProjectId,
} from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { formatSeconds } from '../utils/formatSeconds'
import {
  CONTRACTS,
  makeBridgeCompatible,
  TECHNOLOGY,
  UNDER_REVIEW_RISK_VIEW,
} from './common'
import { Layer2 } from './types'
import { RISK_VIEW, STATE_ZKP_ST } from './common/riskView'

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
  }),
  technology: TECHNOLOGY.UNDER_REVIEW,
  contracts: CONTRACTS.UNDER_REVIEW,
}
