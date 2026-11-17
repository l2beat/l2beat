import type { ProjectLiquidStakingOperators } from '@l2beat/config'
import { shortenAddress } from '~/utils/project/contracts-and-permissions/shortenAddress'

/** Who runs a protocol's validators, as read from the beacon chain. */
export interface LiquidStakingOperators {
  /** Unix seconds of the beacon chain read. */
  timestamp: number
  /** Every operator with an active validator, counted one by one. */
  operatorCount: number
  /** The largest first. */
  operators: LiquidStakingOperator[]
}

export interface LiquidStakingOperator {
  /** The onchain name, or the shortened address when there is none. */
  name: string
  eth: number
  validators: number
  /** Of the protocol's own validators' stake: its part of the protocol's slice. */
  protocolShare: number
  /** Of all ETH staked on Ethereum. */
  stakedEthShare: number
  /** Set when the row sums several operators, such as a module's. */
  operatorCount?: number
}

export function getLiquidStakingOperators(
  snapshot: ProjectLiquidStakingOperators | undefined,
): LiquidStakingOperators | undefined {
  if (!snapshot || snapshot.eth === 0 || snapshot.totalEth === 0) {
    return undefined
  }
  return {
    timestamp: snapshot.timestamp,
    operatorCount: snapshot.operatorCount,
    operators: snapshot.operators.map((operator) => ({
      name:
        operator.address && operator.name === operator.address
          ? shortenAddress(operator.address)
          : operator.name,
      eth: operator.eth,
      validators: operator.validators,
      protocolShare: operator.eth / snapshot.eth,
      stakedEthShare: operator.eth / snapshot.totalEth,
      ...(operator.operatorCount !== undefined && {
        operatorCount: operator.operatorCount,
      }),
    })),
  }
}

/** The largest operator that is one operator, not a sum of several. */
export function getLargestOperator(
  operators: LiquidStakingOperator[],
): LiquidStakingOperator | undefined {
  return operators
    .filter((operator) => operator.operatorCount === undefined)
    .reduce<LiquidStakingOperator | undefined>(
      (largest, operator) =>
        !largest || operator.stakedEthShare > largest.stakedEthShare
          ? operator
          : largest,
      undefined,
    )
}
