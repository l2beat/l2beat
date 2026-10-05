import type {
  ZkMoneyDepositPayoutParams,
  ZkMoneyFundingParams,
  ZkMoneyWithdrawalPayoutParams,
} from '@l2beat/config'
import type { IRpcClient } from '@l2beat/shared'
import { Bytes, EthereumAddress, type Log } from '@l2beat/shared-pure'
import { mockFn, mockObject } from 'earl'
import { utils } from 'ethers'
import { erc20Interface } from '../../utils/erc20'
import { zkMoneyInterface } from '../abi'

// Synthetic logs encoded with the real ABIs. Amounts follow one convention:
// a portal deposit credits 100, so its funding transfer is 100 + FUNDING_CUT.

export const TX_HASH = `0x${'a1'.repeat(32)}`
export const BLOCK_NUMBER = 20

export const DAI = address(1)
export const SIPA = address(2)
export const PORTAL = address(3)
export const ALICE = address(4)
export const BOB = address(5)
export const CURVE_3POOL = address(6)
export const USDC = address(7)
export const USDT = address(8)
export const WITHDRAWAL_EXECUTOR = address(9)
export const OPERATION_EXECUTOR = address(10)
export const FACTORY = address(11)
export const DEPOSIT_IMPLEMENTATION = address(12)
export const REGISTRATION_IMPLEMENTATION = address(13)

export const CREDITED = 100n
export const FUNDING_CUT = 1n
export const FUNDED = CREDITED + FUNDING_CUT
export const DEPOSIT_FEE = 2n

const depositParams = {
  tokenAddress: DAI,
  fundingCut: FUNDING_CUT.toString(),
  factoryAddress: FACTORY,
  depositImplementation: DEPOSIT_IMPLEMENTATION,
  registrationImplementation: REGISTRATION_IMPLEMENTATION,
}

export const FUNDING_PARAMS: ZkMoneyFundingParams = {
  ...depositParams,
  fundingTokens: [DAI, USDC, USDT],
  exchangeAddress: CURVE_3POOL,
  historyFromBlock: 10,
}

export const DEPOSIT_PAYOUT_PARAMS: ZkMoneyDepositPayoutParams = {
  ...depositParams,
  depositFee: DEPOSIT_FEE.toString(),
  registrationSweepFee: '5',
  operationExecutor: OPERATION_EXECUTOR,
}

export const WITHDRAWAL_PAYOUT_PARAMS: ZkMoneyWithdrawalPayoutParams = {
  tokenAddress: DAI,
  executorAddress: WITHDRAWAL_EXECUTOR,
  operationExecutor: OPERATION_EXECUTOR,
}

interface LogPosition {
  logIndex: number
  blockNumber?: number
  transactionHash?: string
}

export function transfer(
  from: EthereumAddress,
  to: EthereumAddress,
  amount: bigint,
  position: LogPosition,
  token = DAI,
): Log {
  return encodeLog(
    erc20Interface,
    'Transfer',
    token,
    [from, to, amount],
    position,
  )
}

export function portalDeposit(index: number, position: LogPosition): Log {
  return encodeLog(
    zkMoneyInterface,
    'Deposit',
    PORTAL,
    [
      utils.hexZeroPad('0x01', 32),
      CREDITED,
      utils.hexZeroPad('0x02', 32),
      index,
    ],
    position,
  )
}

export function sweep(index: number, position: LogPosition): Log {
  return encodeLog(zkMoneyInterface, 'Sweep', SIPA, [index, CREDITED], position)
}

export function recovered(
  token: EthereumAddress,
  target: EthereumAddress,
  amount: bigint,
  position: LogPosition,
): Log {
  return encodeLog(
    zkMoneyInterface,
    'Recovered',
    SIPA,
    [token, target, amount],
    position,
  )
}

export function withdrawal(
  nullifier: number,
  position: LogPosition,
  executor = WITHDRAWAL_EXECUTOR,
): Log {
  return encodeLog(
    zkMoneyInterface,
    'WithdrawalOrRefund',
    PORTAL,
    [0, utils.hexZeroPad(utils.hexlify(nullifier), 32), executor, CREDITED],
    position,
  )
}

/**
 * Serves one receipt for every transaction and answers the factory as if
 * every sender were a clone of `implementation` with the given intent.
 * Balance reads return the SIPA balance of the called token.
 */
export function mockZkMoneyRpc({
  receipt = [],
  implementation = DEPOSIT_IMPLEMENTATION,
  intent = 1,
  balances = new Map(),
}: {
  receipt?: Log[]
  implementation?: EthereumAddress
  intent?: number
  balances?: Map<EthereumAddress, bigint>
}) {
  return mockObject<IRpcClient>({
    getTransactionReceipt: mockFn().resolvesTo({ logs: receipt }),
    isMulticallDeployed: mockFn().returns(false),
    call: mockFn<IRpcClient['call']>().executes(async ({ to, input }) => {
      const selector = input.toString().slice(0, 10)
      if (selector === zkMoneyInterface.getSighash('cloneImplementation')) {
        return encodeResult(zkMoneyInterface, 'cloneImplementation', [
          implementation,
        ])
      }
      if (selector === zkMoneyInterface.getSighash('sipaIntentOf')) {
        return encodeResult(zkMoneyInterface, 'sipaIntentOf', [intent])
      }
      return encodeResult(erc20Interface, 'balanceOf', [
        balances.get(EthereumAddress(to)) ?? 0n,
      ])
    }),
  })
}

function encodeLog(
  iface: utils.Interface,
  name: string,
  emitter: EthereumAddress,
  args: unknown[],
  position: LogPosition,
): Log {
  return {
    ...iface.encodeEventLog(name, args),
    address: emitter.toString(),
    blockNumber: position.blockNumber ?? BLOCK_NUMBER,
    blockHash: `0x${'b2'.repeat(32)}`,
    transactionHash: position.transactionHash ?? TX_HASH,
    logIndex: position.logIndex,
  }
}

function encodeResult(
  iface: utils.Interface,
  method: string,
  values: unknown[],
): Bytes {
  return Bytes.fromHex(iface.encodeFunctionResult(method, values))
}

function address(n: number): EthereumAddress {
  return EthereumAddress(`0x${n.toString(16).padStart(40, '0')}`)
}
