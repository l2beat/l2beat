import { UnixTime } from '@l2beat/shared-pure'
import { FEE_RULES, type FeeRules } from './feeRules'

export interface GasFeesChain {
  /** The gas fees page's chain id */
  id: string
  /** Dune's name for the chain: the schema of its tables */
  dune: string
  /** What its transactions pay */
  fees: FeeRules
  /**
   * From this day on, a day without the chain on Dune is read again later. Public
   * launch, so days before it are stored when Dune has them but never awaited
   */
  requiredFrom: UnixTime
}

const day = (date: string) => UnixTime.fromDate(new Date(`${date}T00:00:00Z`))

/**
 * A chain added later gets only its last 30 days, as a late chain does. To read
 * its history, bump the fees indexer's STORED_DATA_VERSION: every chain's days are read again.
 */
export const GAS_FEES_CHAINS: GasFeesChain[] = [
  {
    id: 'ethereum',
    dune: 'ethereum',
    fees: FEE_RULES.ethereum,
    requiredFrom: day('2015-08-08'),
  },
  {
    id: 'arbitrum',
    dune: 'arbitrum',
    fees: FEE_RULES.arbitrum,
    requiredFrom: day('2021-08-31'),
  },
  {
    id: 'base',
    dune: 'base',
    fees: FEE_RULES.l1FeeOnTop,
    requiredFrom: day('2023-08-09'),
  },
  // Dune's data starts at the regenesis of 11 Nov 2021
  {
    id: 'optimism',
    dune: 'optimism',
    fees: FEE_RULES.l1FeeOnTop,
    requiredFrom: day('2021-11-12'),
  },
  {
    id: 'zksync2',
    dune: 'zksync',
    fees: FEE_RULES.zkStack,
    requiredFrom: day('2023-03-24'),
  },
  {
    id: 'linea',
    dune: 'linea',
    fees: FEE_RULES.gasTimesPrice,
    requiredFrom: day('2023-08-08'),
  },
  {
    id: 'scroll',
    dune: 'scroll',
    fees: FEE_RULES.l1FeeOnTop,
    requiredFrom: day('2023-10-17'),
  },
  {
    id: 'unichain',
    dune: 'unichain',
    fees: FEE_RULES.l1FeeOnTop,
    requiredFrom: day('2025-02-11'),
  },
  {
    id: 'ink',
    dune: 'ink',
    fees: FEE_RULES.l1FeeOnTop,
    requiredFrom: day('2024-12-18'),
  },
  {
    id: 'abstract',
    dune: 'abstract',
    fees: FEE_RULES.zkStack,
    requiredFrom: day('2025-01-27'),
  },
  {
    id: 'taiko',
    dune: 'taiko',
    fees: FEE_RULES.taiko,
    requiredFrom: day('2024-06-01'),
  },
  {
    id: 'mantle',
    dune: 'mantle',
    fees: FEE_RULES.mantle,
    requiredFrom: day('2023-07-17'),
  },
]
