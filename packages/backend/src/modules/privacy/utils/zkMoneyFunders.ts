import type { ZkMoneyDepositConfig } from '@l2beat/config'
import type { IRpcClient, LogsProvider } from '@l2beat/shared'
import { EthereumAddress, type Log, unique } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import chunk from 'lodash/chunk'
import { ERC20_TRANSFER_TOPIC } from './erc20'
import { fetchPrivacyReceiptLogs } from './fetchPrivacyReceiptLogs'
import { eventKey, transfers, zkMoneyInterface } from './zkMoneyEvents'
import { findZkMoneyDepositor } from './zkMoneyOperations'

const DEPOSIT_ADDRESS_BATCH_SIZE = 50

interface SweptDeposit {
  log: Log
  depositAddress: string
}

/**
 * A deposit event does not name its sender. Direct depositors are read from
 * the transaction. Deposits swept from a deposit address belong to whoever
 * funded that address. Returns senders by eventKey, leaving out deposits with
 * no single funder.
 */
export async function findZkMoneyDepositSenders(
  deposits: Log[],
  params: ZkMoneyDepositConfig,
  deps: { rpcClient: IRpcClient; logsProvider: LogsProvider },
  fundingFromBlock: number,
): Promise<Map<string, string>> {
  const receipts = await fetchPrivacyReceiptLogs(
    deps.rpcClient,
    deposits.map((log) => log.transactionHash),
  )

  const senders = new Map<string, string>()
  const swept: SweptDeposit[] = []
  for (const log of deposits) {
    const depositor = findZkMoneyDepositor(
      receipts.get(log.transactionHash) ?? [],
      log,
      params.tokenAddress,
    )
    if (!depositor) continue
    if (depositor.isDepositAddress) {
      swept.push({ log, depositAddress: depositor.address })
    } else {
      senders.set(eventKey(log), depositor.address)
    }
  }

  for (const batch of chunk(swept, DEPOSIT_ADDRESS_BATCH_SIZE)) {
    const addresses = unique(batch.map((deposit) => deposit.depositAddress))
    const toBlock = Math.max(...batch.map(({ log }) => log.blockNumber))
    const [funding, emptied] = await Promise.all([
      deps.logsProvider.getLogs(
        fundingFromBlock,
        toBlock,
        params.fundingTokens,
        [
          [ERC20_TRANSFER_TOPIC],
          null,
          addresses.map((address) => utils.hexZeroPad(address, 32)),
        ],
      ),
      deps.logsProvider.getLogs(fundingFromBlock, toBlock, addresses, [
        [
          zkMoneyInterface.getEventTopic('Sweep'),
          zkMoneyInterface.getEventTopic('Recovered'),
        ],
      ]),
    ])
    for (const deposit of batch) {
      const funder = findFunder(deposit, funding, emptied, params)
      if (funder) senders.set(eventKey(deposit.log), funder)
    }
  }

  return senders
}

/**
 * Sweeping or recovering empties a deposit address, so a deposit is funded by
 * what the address received since then.
 */
export function findFunder(
  deposit: SweptDeposit,
  funding: Log[],
  emptied: Log[],
  params: ZkMoneyDepositConfig,
): string | undefined {
  const depositedAt = position(deposit.log)
  const emptiedAt = Math.max(
    -1,
    ...emptied
      .filter((log) => log.address.toLowerCase() === deposit.depositAddress)
      .map(position)
      .filter((at) => at < depositedAt),
  )

  const received = funding.filter(
    (log) => position(log) > emptiedAt && position(log) < depositedAt,
  )
  const funders = unique(
    params.fundingTokens
      .flatMap((token) => transfers(received, token))
      .filter((transfer) => transfer.to === deposit.depositAddress)
      // Swapping USDC or USDT returns DAI from the exchange, which funds nothing new.
      .filter(
        (transfer) => transfer.from !== params.exchangeAddress.toLowerCase(),
      )
      .map((transfer) => transfer.from),
  )

  const [funder] = funders
  // Tokens minted to the address, such as bridged USDC, have no sender.
  if (funders.length !== 1 || funder === EthereumAddress.ZERO.toLowerCase())
    return undefined
  return funder
}

function position(log: { blockNumber: number; logIndex: number }): number {
  return log.blockNumber * 1_000_000 + log.logIndex
}
