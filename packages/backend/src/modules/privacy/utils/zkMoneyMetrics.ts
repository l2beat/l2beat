import type { ZkMoneyDepositConfig } from '@l2beat/config'
import type { IRpcClient, LogsProvider } from '@l2beat/shared'
import { assert, Bytes, EthereumAddress, type Log } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import chunk from 'lodash/chunk'
import type { PrivacyRpcLog } from '../types'
import { attributeZkMoneyFunders } from './attributeZkMoneyFunders'
import {
  eventKey,
  findReceiptEvent,
  type ReceiptLog,
  tokenInterface,
  transfers,
  zkMoneyInterface,
} from './zkMoneyEvents'

type Deposit = NonNullable<ReturnType<typeof locateZkMoneyDeposit>> & {
  log: Log
  kind: 'direct' | 'deposit' | 'registration' | 'invalid'
}
type PayoutParams = { tokenAddress: string; operationExecutor: string }

/** Cache receipts for one indexer update, avoiding stale attribution across reorgs. */
export class ZkMoneyMetrics {
  private readonly receipts = new Map<string, Promise<ReceiptLog[]>>()

  constructor(private readonly rpc: IRpcClient) {}

  receipt(hash: string): Promise<ReceiptLog[]> {
    if (!this.receipts.has(hash)) {
      this.receipts.set(
        hash,
        this.rpc.getTransactionReceipt(hash).then(({ logs }) =>
          logs.map((log) => {
            assert(
              log.address !== undefined,
              'Receipt log is missing its emitter',
            )
            return { ...log, address: log.address }
          }),
        ),
      )
    }
    const receipt = this.receipts.get(hash)
    assert(receipt)
    return receipt
  }

  private async deposit(
    log: Log,
    params: ZkMoneyDepositConfig,
  ): Promise<Deposit | undefined> {
    const operation = locateZkMoneyDeposit(
      await this.receipt(log.transactionHash),
      log,
      params,
    )
    if (!operation) return undefined
    const call = async (method: string) => {
      const input = Bytes.fromHex(
        zkMoneyInterface.encodeFunctionData(method, [operation.sender]),
      )
      const result = await this.rpc.call(
        { to: params.factoryAddress, input },
        log.blockNumber,
      )
      return zkMoneyInterface.decodeFunctionResult(method, result.toString())[0]
    }
    const implementation = String(
      await call('cloneImplementation'),
    ).toLowerCase()
    let kind: Deposit['kind'] = 'direct'
    if (
      [params.depositImplementation, params.registrationImplementation].some(
        (address) => address.toLowerCase() === implementation,
      )
    ) {
      const intent = Number(await call('sipaIntentOf'))
      // The factory checks the clone's code, immutable arguments and deterministic address.
      kind =
        intent === 1 ? 'deposit' : intent === 2 ? 'registration' : 'invalid'
    }
    return { ...operation, log, kind }
  }

  async depositFinalizer(log: Log, params: ZkMoneyDepositConfig) {
    const deposit = await this.deposit(log, params)
    if (!deposit || deposit.kind === 'direct' || deposit.kind === 'invalid')
      return undefined
    const args = zkMoneyInterface.parseLog(log).args
    const swept = deposit.after.some((entry) => {
      if (
        entry.address.toLowerCase() !== deposit.sender ||
        entry.topics[0] !== zkMoneyInterface.getEventTopic('Sweep')
      )
        return false
      const sweep = zkMoneyInterface.parseLog(entry).args
      return sweep.index.eq(args.index) && sweep.amount.eq(args.amount)
    })
    const outgoing = transfers(deposit.before, params.tokenAddress).filter(
      (entry) => entry.from === deposit.sender,
    )
    const payout = outgoing.at(-2)
    const fee =
      deposit.kind === 'deposit'
        ? params.depositFee
        : params.registrationSweepFee
    if (
      !swept ||
      outgoing.at(-1)?.to !== log.address.toLowerCase() ||
      !payout ||
      payout.amount !== BigInt(fee)
    )
      return undefined
    return resolvePayout(deposit.after, payout, params)
  }

  async funders(
    logs: Log[],
    params: ZkMoneyDepositConfig,
    provider: LogsProvider,
  ) {
    const result = new Map<string, string>()
    const sipas = new Map<string, Deposit[]>()
    for (const batch of chunk(logs, 20)) {
      for (const deposit of await Promise.all(
        batch.map((log) => this.deposit(log, params)),
      )) {
        if (!deposit || deposit.kind === 'invalid') continue
        if (deposit.kind === 'direct') {
          if (deposit.sender !== EthereumAddress.ZERO.toLowerCase())
            result.set(eventKey(deposit.log), deposit.sender)
        } else {
          const group = sipas.get(deposit.sender) ?? []
          group.push(deposit)
          sipas.set(deposit.sender, group)
        }
      }
    }
    for (const batch of chunk([...sipas], 50)) {
      const addresses = batch.map(([sipa]) => sipa)
      const end = Math.max(
        ...batch.flatMap(([, deposits]) =>
          deposits.map(({ log }) => log.blockNumber),
        ),
      )
      const initial = await this.initialBalances(addresses, params)
      const history = await fundingHistory(provider, addresses, params, end)
      for (const [sipa, deposits] of batch) {
        const seed = initial.get(sipa)
        const [deposit] = deposits
        assert(seed && deposit, 'Missing SIPA funding state')
        const attributed = attributeZkMoneyFunders(
          history,
          seed,
          sipa,
          params.tokenAddress,
          deposit.log.address,
          params.exchangeAddress,
        )
        for (const deposit of deposits) {
          const funder = attributed.get(eventKey(deposit.transfer))
          if (funder !== undefined) result.set(eventKey(deposit.log), funder)
        }
      }
    }
    return result
  }

  private async initialBalances(
    addresses: string[],
    params: ZkMoneyDepositConfig,
  ) {
    const requests = addresses.flatMap((sipa) =>
      params.fundingTokens.map((token) => ({
        sipa,
        to: token,
        input: Bytes.fromHex(
          tokenInterface.encodeFunctionData('balanceOf', [sipa]),
        ),
      })),
    )
    const block = params.historyFromBlock - 1
    const responses = this.rpc.isMulticallDeployed(block)
      ? (await this.rpc.multicall(requests, block)).map(({ success, data }) => {
          assert(success, 'Could not read initial SIPA balance')
          return data
        })
      : await Promise.all(
          requests.map(({ to, input }) => this.rpc.call({ to, input }, block)),
        )
    assert(
      responses.length === requests.length,
      'Missing initial SIPA balances',
    )
    const balances = new Map(
      addresses.map((sipa) => [sipa, new Map<string, bigint>()]),
    )
    for (const [index, request] of requests.entries()) {
      const response = responses[index]
      assert(response !== undefined)
      const balance = BigInt(
        tokenInterface
          .decodeFunctionResult('balanceOf', response.toString())[0]
          .toString(),
      )
      balances.get(request.sipa)?.set(request.to, balance)
    }
    return balances
  }
}

async function fundingHistory(
  provider: LogsProvider,
  addresses: string[],
  params: ZkMoneyDepositConfig,
  end: number,
) {
  const history: Log[] = []
  const topics = addresses.map((sipa) => utils.hexZeroPad(sipa, 32))
  for (let from = params.historyFromBlock; from <= end; from += 10_000) {
    const to = Math.min(from + 9_999, end)
    const batches = await Promise.all([
      provider.getLogs(from, to, params.fundingTokens, [
        [tokenInterface.getEventTopic('Transfer')],
        null,
        topics,
      ]),
      provider.getLogs(from, to, params.fundingTokens, [
        [tokenInterface.getEventTopic('Transfer')],
        topics,
      ]),
      provider.getLogs(from, to, addresses, [
        [
          zkMoneyInterface.getEventTopic('Sweep'),
          zkMoneyInterface.getEventTopic('Recovered'),
        ],
      ]),
    ])
    history.push(...batches.flat())
  }
  return history
}

export function locateZkMoneyDeposit(
  receipt: ReceiptLog[],
  log: Log,
  params: ZkMoneyDepositConfig,
) {
  const window = operationWindow(receipt, log)
  const gross =
    BigInt(zkMoneyInterface.parseLog(log).args.amount.toString()) +
    BigInt(params.fundingCut)
  const incoming = transfers(window.before, params.tokenAddress).filter(
    (entry) => entry.to === log.address.toLowerCase() && entry.amount === gross,
  )
  const [transfer] = incoming
  if (incoming.length !== 1 || !transfer) return undefined
  // Receipt logs are consecutive within a transaction, so the portal log supplies their block offset.
  const logIndex =
    log.logIndex - (window.position - receipt.indexOf(transfer.log))
  return {
    ...window,
    sender: transfer.from,
    transfer: { transactionHash: log.transactionHash, logIndex },
  }
}

/** Restrict both payout and funding evidence to this portal operation in a batch. */
function operationWindow(receipt: ReceiptLog[], event: PrivacyRpcLog) {
  const position = findReceiptEvent(receipt, event)
  assert(position >= 0, 'Portal event is missing from its receipt')
  const boundary = (log: ReceiptLog) =>
    log.address.toLowerCase() === event.address.toLowerCase() &&
    [
      zkMoneyInterface.getEventTopic('Deposit'),
      zkMoneyInterface.getEventTopic('WithdrawalOrRefund'),
    ].includes(log.topics[0] ?? '')
  const before = receipt.slice(0, position)
  const previous = [...before].reverse().findIndex(boundary)
  const after = receipt.slice(position + 1)
  const next = after.findIndex(boundary)
  return {
    position,
    before: before.slice(previous < 0 ? 0 : before.length - previous),
    after: after.slice(0, next < 0 ? undefined : next),
  }
}

/** PlainWithdrawalExecutor transfers principal first, then the optional tip. */
export function extractZkMoneyWithdrawalPayout(
  receipt: ReceiptLog[],
  log: PrivacyRpcLog,
  params: PayoutParams & { executorAddress: string },
) {
  const { before, after } = operationWindow(receipt, log)
  const args = zkMoneyInterface.parseLog(log).args
  if (
    String(args.executor).toLowerCase() !== params.executorAddress.toLowerCase()
  )
    return undefined
  const outgoing = transfers(before, params.tokenAddress).filter(
    (entry) => entry.from === params.executorAddress.toLowerCase(),
  )
  const [principal, tip] = outgoing
  if (
    outgoing.length !== 2 ||
    !principal ||
    !tip ||
    principal.amount + tip.amount !== BigInt(args.executionAmount.toString())
  )
    return undefined
  return resolvePayout(after, tip, params)
}

function resolvePayout(
  after: ReceiptLog[],
  payout: { to: string; amount: bigint },
  params: PayoutParams,
) {
  if (payout.to === EthereumAddress.ZERO.toLowerCase() || payout.amount === 0n)
    return undefined
  if (payout.to !== params.operationExecutor.toLowerCase())
    return EthereumAddress(payout.to)
  // The verified helper forwards fees plus subsidies to its caller. Exclude ambiguous forwarding.
  const forwarded = transfers(after, params.tokenAddress).filter(
    (entry) =>
      entry.from === payout.to &&
      entry.amount >= payout.amount &&
      entry.to !== payout.to &&
      entry.to !== EthereumAddress.ZERO.toLowerCase(),
  )
  const [recipient] = forwarded
  return forwarded.length === 1 && recipient
    ? EthereumAddress(recipient.to)
    : undefined
}
