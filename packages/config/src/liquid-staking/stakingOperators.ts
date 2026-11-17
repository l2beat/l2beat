import type {
  ProjectLiquidStakingOperators,
  ProjectStakingOperator,
} from '../types'
import snapshot from './stakingOperators.json'

/**
 * Who runs the validators of each liquid staking protocol we can trace, read
 * from the beacon chain and the protocols' own contracts by
 * `pnpm --filter @l2beat/config liquid-staking:operators`.
 */
export interface StakingOperatorsSnapshot {
  /** The finalized beacon slot the validators were read at. */
  slot: number
  /** The execution block the contracts were read at, that slot's block. */
  blockNumber: number
  /** Unix seconds of that block. */
  timestamp: number
  /** Balance of every active validator at the slot, in ETH. */
  totalEth: number
  validators: number
  /** By project id. Protocols run by one company have no entry. */
  protocols: Record<string, ProtocolStakingOperators>
}

export interface ProtocolStakingOperators {
  eth: number
  validators: number
  operatorCount: number
  operators: ProjectStakingOperator[]
}

const STAKING_OPERATORS: StakingOperatorsSnapshot = snapshot

/** A protocol's operators, as the last snapshot read them. */
export function getValidatorOperators(
  projectId: string,
): ProjectLiquidStakingOperators | undefined {
  const protocol = STAKING_OPERATORS.protocols[projectId]
  if (!protocol) return undefined
  return {
    slot: STAKING_OPERATORS.slot,
    timestamp: STAKING_OPERATORS.timestamp,
    totalEth: STAKING_OPERATORS.totalEth,
    ...protocol,
  }
}
