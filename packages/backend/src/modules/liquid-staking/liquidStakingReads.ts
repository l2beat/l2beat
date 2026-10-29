import type { ProjectLiquidStakingContracts } from '@l2beat/config'
import type { LiquidStakingSnapshotRecord } from '@l2beat/database'
import type { CallParameters } from '@l2beat/shared'
import { Bytes, ChainSpecificAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'

export type LiquidStakingState = Pick<
  LiquidStakingSnapshotRecord,
  | 'exchangeRate'
  | 'lastRequestId'
  | 'lastFinalizedRequestId'
  | 'instantExitEth'
  | 'lockTime'
>

export interface LiquidStakingReads {
  /** View calls that each return one unsigned integer. */
  calls: CallParameters[]
  /** Maps the decoded results, in call order, onto a snapshot. */
  toState: (values: bigint[]) => LiquidStakingState
}

const abi = new utils.Interface([
  'function getPooledEthByShares(uint256 sharesAmount) view returns (uint256)',
  'function getLastRequestId() view returns (uint256)',
  'function getLastFinalizedRequestId() view returns (uint256)',
  'function getExchangeRate() view returns (uint256)',
  'function getTotalCollateral() view returns (uint256)',
  'function getRate() view returns (uint256)',
  'function nextRequestId() view returns (uint32)',
  'function lastFinalizedRequestId() view returns (uint32)',
  'function exchangeRate() view returns (uint256)',
  'function lockTime() view returns (uint256)',
])

const EMPTY_EXIT = {
  lastRequestId: null,
  lastFinalizedRequestId: null,
  instantExitEth: null,
  lockTime: null,
}

/** Every getter exists on each implementation live since the start of 2024. */
export function getLiquidStakingReads(
  config: ProjectLiquidStakingContracts,
): LiquidStakingReads {
  switch (config.type) {
    case 'lido':
      return {
        calls: [
          // ETH per share, which is ETH per wstETH: stETH itself stays at
          // one ETH and rebases.
          call(config.stETH, 'getPooledEthByShares', [10n ** 18n]),
          call(config.withdrawalQueue, 'getLastRequestId'),
          call(config.withdrawalQueue, 'getLastFinalizedRequestId'),
        ],
        toState: ([rate, lastRequest, lastFinalized]) => ({
          ...EMPTY_EXIT,
          exchangeRate: rate,
          lastRequestId: Number(lastRequest),
          lastFinalizedRequestId: Number(lastFinalized),
        }),
      }
    case 'rocketpool':
      return {
        calls: [
          call(config.rETH, 'getExchangeRate'),
          call(config.rETH, 'getTotalCollateral'),
        ],
        toState: ([rate, collateral]) => ({
          ...EMPTY_EXIT,
          exchangeRate: rate,
          instantExitEth: collateral,
        }),
      }
    case 'etherfi':
      return {
        calls: [
          call(config.weETH, 'getRate'),
          call(config.withdrawRequestNft, 'nextRequestId'),
          call(config.withdrawRequestNft, 'lastFinalizedRequestId'),
        ],
        toState: ([rate, nextRequest, lastFinalized]) => ({
          ...EMPTY_EXIT,
          exchangeRate: rate,
          // nextRequestId points one past the newest request.
          lastRequestId: Number(nextRequest) - 1,
          lastFinalizedRequestId: Number(lastFinalized),
        }),
      }
    case 'wbeth':
      return {
        calls: [
          call(config.wBETH, 'exchangeRate'),
          call(config.unwrapToken, 'lockTime'),
        ],
        toState: ([rate, lockTime]) => ({
          ...EMPTY_EXIT,
          exchangeRate: rate,
          lockTime: Number(lockTime),
        }),
      }
  }
}

/** Every read returns one unsigned integer, whatever its width. */
export function decodeUint(data: Bytes): bigint {
  const [value] = utils.defaultAbiCoder.decode(['uint256'], data.toString())
  return BigInt(value.toString())
}

function call(
  address: ChainSpecificAddress,
  functionName: string,
  args: bigint[] = [],
): CallParameters {
  return {
    to: ChainSpecificAddress.address(address),
    input: Bytes.fromHex(abi.encodeFunctionData(functionName, args)),
  }
}
