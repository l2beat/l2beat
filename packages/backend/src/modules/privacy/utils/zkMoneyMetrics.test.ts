import type { ZkMoneyDepositConfig } from '@l2beat/config'
import type { IRpcClient, LogsProvider } from '@l2beat/shared'
import { Bytes, EthereumAddress, type Log } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'
import { attributeZkMoneyFunders } from './attributeZkMoneyFunders'
import { eventKey, tokenInterface, zkMoneyInterface } from './zkMoneyEvents'
import {
  extractZkMoneyWithdrawalPayout,
  locateZkMoneyDeposit,
  ZkMoneyMetrics,
} from './zkMoneyMetrics'

const address = (n: number) =>
  EthereumAddress(`0x${n.toString(16).padStart(40, '0')}`)
const TOKEN = address(1)
const SIPA = address(2)
const PORTAL = address(3)
const ALICE = address(4)
const BOB = address(5)
const EXCHANGE = address(6)
const USDC = address(7)
const USDT = address(8)
const EXECUTOR = address(9)
const HELPER = address(10)
const params: ZkMoneyDepositConfig = {
  tokenAddress: TOKEN,
  factoryAddress: address(11),
  depositImplementation: address(12),
  registrationImplementation: address(13),
  fundingTokens: [TOKEN, USDC, USDT],
  exchangeAddress: EXCHANGE,
  historyFromBlock: 10,
  fundingCut: '1',
  depositFee: '2',
  registrationSweepFee: '5',
  operationExecutor: HELPER,
}
function event(
  iface: utils.Interface,
  name: string,
  contract: string,
  args: unknown[],
  index: number,
): Log {
  return {
    ...iface.encodeEventLog(name, args),
    address: contract,
    blockNumber: 20,
    blockHash: '0xblock',
    transactionHash: '0xtx',
    logIndex: index,
  }
}
const transfer = (
  from: string,
  to: string,
  amount: bigint,
  index: number,
  token = TOKEN,
) => event(tokenInterface, 'Transfer', token, [from, to, amount], index)
const sweep = (index: number) =>
  event(zkMoneyInterface, 'Sweep', SIPA, [index, 100], index)
const deposit = (index: number) =>
  event(
    zkMoneyInterface,
    'Deposit',
    PORTAL,
    [utils.hexZeroPad('0x01', 32), 100, utils.hexZeroPad('0x02', 32), index],
    index,
  )
const withdrawal = (index: number, executor = EXECUTOR) =>
  event(
    zkMoneyInterface,
    'WithdrawalOrRefund',
    PORTAL,
    [0, utils.hexZeroPad(utils.hexlify(index), 32), executor, 100],
    index,
  )
function replay(
  logs: Log[],
  initial = new Map([
    [TOKEN, 0n],
    [USDC, 0n],
    [USDT, 0n],
  ]),
) {
  return attributeZkMoneyFunders(logs, initial, SIPA, TOKEN, PORTAL, EXCHANGE)
}

describe('zk.money funding attribution', () => {
  it('resets after a sweep and ignores zero-value and later same-block transfers', () => {
    const logs = [
      transfer(ALICE, SIPA, 103n, 1),
      transfer(SIPA, BOB, 2n, 2),
      transfer(SIPA, PORTAL, 101n, 3),
      sweep(4),
      transfer(BOB, SIPA, 0n, 5),
      transfer(BOB, SIPA, 103n, 6),
      transfer(SIPA, ALICE, 2n, 7),
      transfer(SIPA, PORTAL, 101n, 8),
      sweep(9),
      transfer(ALICE, SIPA, 103n, 10),
    ]
    expect(replay([...logs].reverse())).toEqual(
      new Map([
        ['0xtx:3', ALICE.toLowerCase()],
        ['0xtx:8', BOB.toLowerCase()],
      ]),
    )
  })
  it('excludes mixed funding until the balance is emptied', () => {
    const logs = [
      transfer(ALICE, SIPA, 50n, 1),
      transfer(BOB, SIPA, 53n, 2),
      transfer(SIPA, ALICE, 2n, 3),
      transfer(SIPA, PORTAL, 101n, 4),
      sweep(5),
      transfer(ALICE, SIPA, 103n, 6),
      transfer(SIPA, PORTAL, 103n, 7),
    ]
    expect(replay(logs)).toEqual(new Map([['0xtx:7', ALICE.toLowerCase()]]))
  })
  it('carries swap provenance into DAI without counting 3pool or untouched tokens', () => {
    const logs = [
      transfer(BOB, SIPA, 999n, 1, USDT),
      transfer(ALICE, SIPA, 100n, 2, USDC),
      transfer(SIPA, EXCHANGE, 100n, 3, USDC),
      transfer(EXCHANGE, SIPA, 103n, 4),
      transfer(SIPA, BOB, 2n, 5),
      transfer(SIPA, PORTAL, 101n, 6),
    ]
    expect(replay(logs)).toEqual(new Map([['0xtx:6', ALICE.toLowerCase()]]))
    expect(replay([transfer(BOB, SIPA, 1n, 0), ...logs])).toEqual(new Map())
  })
  it('excludes pre-existing balances until recovery empties them', () => {
    const initial = new Map([
      [TOKEN, 10n],
      [USDC, 0n],
      [USDT, 0n],
    ])
    expect(
      replay(
        [transfer(ALICE, SIPA, 93n, 1), transfer(SIPA, PORTAL, 103n, 2)],
        initial,
      ),
    ).toEqual(new Map())
    const recovered = event(
      zkMoneyInterface,
      'Recovered',
      SIPA,
      [TOKEN, ALICE, 10],
      2,
    )
    expect(
      replay(
        [
          transfer(SIPA, ALICE, 10n, 1),
          recovered,
          transfer(BOB, SIPA, 103n, 3),
          transfer(SIPA, PORTAL, 103n, 4),
        ],
        initial,
      ),
    ).toEqual(new Map([['0xtx:4', BOB.toLowerCase()]]))
  })
  it('does not infer funders from an unpaired swap output', () => {
    expect(
      replay([
        transfer(EXCHANGE, SIPA, 103n, 1),
        transfer(SIPA, PORTAL, 103n, 2),
      ]),
    ).toEqual(new Map())
  })
})

const depositReceipt = () => [
  transfer(SIPA, BOB, 2n, 1),
  transfer(SIPA, PORTAL, 101n, 2),
  transfer(PORTAL, BOB, 1n, 3),
  deposit(4),
  event(zkMoneyInterface, 'Sweep', SIPA, [4, 100], 5),
]
function makeMetrics(intent = 1, receipt = depositReceipt()) {
  const rpc = mockObject<IRpcClient>({
    getTransactionReceipt: mockFn().resolvesTo({ logs: receipt }),
    isMulticallDeployed: mockFn().returns(false),
    call: mockFn<IRpcClient['call']>().executes(async ({ input }) => {
      const selector = input.toString().slice(0, 10)
      if (selector === zkMoneyInterface.getSighash('cloneImplementation'))
        return Bytes.fromHex(
          zkMoneyInterface.encodeFunctionResult('cloneImplementation', [
            params.depositImplementation,
          ]),
        )
      if (selector === zkMoneyInterface.getSighash('sipaIntentOf'))
        return Bytes.fromHex(
          zkMoneyInterface.encodeFunctionResult('sipaIntentOf', [intent]),
        )
      return Bytes.fromHex(
        tokenInterface.encodeFunctionResult('balanceOf', [0]),
      )
    }),
  })
  return { metrics: new ZkMoneyMetrics(rpc), rpc }
}
function withdrawalPayout(receipt: Log[], log = withdrawal(3)) {
  return extractZkMoneyWithdrawalPayout(receipt, log, {
    tokenAddress: TOKEN,
    executorAddress: EXECUTOR,
    operationExecutor: HELPER,
  })
}

describe('zk.money paid finalizers', () => {
  it('uses the tip recipient, including self-finalizers', () => {
    expect(
      withdrawalPayout([
        transfer(EXECUTOR, ALICE, 90n, 1),
        transfer(EXECUTOR, ALICE, 10n, 2),
        withdrawal(3),
      ]),
    ).toEqual(ALICE)
  })
  it('follows the verified helper payout, including subsidies', () => {
    expect(
      withdrawalPayout([
        transfer(EXECUTOR, ALICE, 90n, 1),
        transfer(EXECUTOR, HELPER, 10n, 2),
        withdrawal(3),
        transfer(BOB, HELPER, 5n, 4),
        transfer(HELPER, BOB, 15n, 5),
      ]),
    ).toEqual(BOB)
  })
  it('excludes zero-tip withdrawals, custom executors and spoofed token events', () => {
    expect(
      withdrawalPayout([transfer(EXECUTOR, ALICE, 100n, 1), withdrawal(3)]),
    ).toEqual(undefined)
    const custom = withdrawal(3, SIPA)
    expect(withdrawalPayout([custom], custom)).toEqual(undefined)
    expect(
      withdrawalPayout([
        transfer(EXECUTOR, ALICE, 90n, 1),
        transfer(EXECUTOR, BOB, 10n, 2, USDC),
        withdrawal(3),
      ]),
    ).toEqual(undefined)
  })
  it('isolates batched operations and rejects ambiguous forwarding', () => {
    const first = withdrawal(3)
    const second = withdrawal(7)
    const receipt = [
      transfer(EXECUTOR, ALICE, 90n, 1),
      transfer(EXECUTOR, HELPER, 10n, 2),
      first,
      transfer(HELPER, ALICE, 10n, 4),
      transfer(EXECUTOR, ALICE, 90n, 5),
      transfer(EXECUTOR, BOB, 10n, 6),
      second,
    ]
    expect(withdrawalPayout(receipt, first)).toEqual(ALICE)
    expect(withdrawalPayout(receipt, second)).toEqual(BOB)
    expect(
      withdrawalPayout(
        [...receipt.slice(0, 4), transfer(HELPER, BOB, 10n, 5)],
        first,
      ),
    ).toEqual(undefined)
  })
  it('matches portal funding by receipt order and excludes ambiguous donations', () => {
    const log = deposit(4)
    const receipt = depositReceipt()
    expect(locateZkMoneyDeposit(receipt, log, params)?.transfer).toEqual({
      transactionHash: '0xtx',
      logIndex: 2,
    })
    expect(
      locateZkMoneyDeposit(
        [transfer(ALICE, PORTAL, 101n, 0), ...receipt],
        log,
        params,
      ),
    ).toEqual(undefined)
  })
  it('rejects a clone with a known implementation but no factory-authenticated intent', async () => {
    const { metrics: tracker } = makeMetrics(0)
    const provider = mockObject<LogsProvider>({ getLogs: mockFn() })
    expect(await tracker.funders([deposit(4)], params, provider)).toEqual(
      new Map(),
    )
    expect(await tracker.depositFinalizer(deposit(4), params)).toEqual(
      undefined,
    )
    expect(provider.getLogs).not.toHaveBeenCalled()
  })
  it('validates the factory clone, replays funding and identifies the sweep payout', async () => {
    const { metrics: tracker, rpc } = makeMetrics()
    const receipt = depositReceipt()
    const log = deposit(4)
    const provider = mockObject<LogsProvider>({
      getLogs: mockFn()
        .returnsOnce([transfer(ALICE, SIPA, 103n, 0)])
        .returnsOnce(receipt.slice(0, 2))
        .returnsOnce([receipt[4]!]),
    })
    expect(await tracker.depositFinalizer(log, params)).toEqual(BOB)
    expect(await tracker.funders([log], params, provider)).toEqual(
      new Map([[eventKey(log), ALICE.toLowerCase()]]),
    )
    expect(rpc.getTransactionReceipt).toHaveBeenOnlyCalledWith('0xtx')
  })
})
