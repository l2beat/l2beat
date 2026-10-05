import type {
  CallParameters,
  IRpcClient,
  LogsProvider,
  LogsTopicFilter,
} from '@l2beat/shared'
import {
  assert,
  Bytes,
  type EthereumAddress,
  type Log,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { ERC20_TRANSFER_TOPIC, erc20Interface } from '../utils/erc20'
import { RECOVERED_TOPIC, SWEEP_TOPIC } from './abi'

// Our RPC proxy serves eth_getLogs for at most this many blocks per request.
const LOGS_BLOCK_RANGE = 10_000

/**
 * Everything that moves a SIPA balance: token transfers into and out of it,
 * and its own Sweep / Recovered events, which close a funding round.
 */
export async function fetchFundingHistory(
  logsProvider: LogsProvider,
  sipas: EthereumAddress[],
  tokens: EthereumAddress[],
  fromBlock: number,
  toBlock: number,
): Promise<Log[]> {
  const sipaTopics = sipas.map((sipa) => utils.hexZeroPad(sipa, 32))
  const filters: { addresses: EthereumAddress[]; topics: LogsTopicFilter }[] = [
    { addresses: tokens, topics: [[ERC20_TRANSFER_TOPIC], null, sipaTopics] },
    { addresses: tokens, topics: [[ERC20_TRANSFER_TOPIC], sipaTopics] },
    { addresses: sipas, topics: [[SWEEP_TOPIC, RECOVERED_TOPIC]] },
  ]

  const history: Log[] = []
  for (let from = fromBlock; from <= toBlock; from += LOGS_BLOCK_RANGE) {
    const to = Math.min(from + LOGS_BLOCK_RANGE - 1, toBlock)
    const batches = await Promise.all(
      filters.map(({ addresses, topics }) =>
        logsProvider.getLogs(from, to, addresses, topics),
      ),
    )
    history.push(...batches.flat())
  }
  return history
}

/** @returns balance per SIPA, per token */
export async function readBalances(
  rpc: IRpcClient,
  sipas: EthereumAddress[],
  tokens: EthereumAddress[],
  blockNumber: number,
): Promise<Map<EthereumAddress, Map<EthereumAddress, bigint>>> {
  const queries = sipas.flatMap((sipa) =>
    tokens.map((token) => ({ sipa, token })),
  )
  const results = await callAll(
    rpc,
    queries.map(({ sipa, token }) => ({
      to: token,
      input: Bytes.fromHex(
        erc20Interface.encodeFunctionData('balanceOf', [sipa]),
      ),
    })),
    blockNumber,
  )

  const balances = new Map(
    sipas.map((sipa) => [sipa, new Map<EthereumAddress, bigint>()]),
  )
  for (const [index, { sipa, token }] of queries.entries()) {
    const result = results[index]
    assert(result !== undefined, 'Missing SIPA balance')
    const [balance] = erc20Interface.decodeFunctionResult(
      'balanceOf',
      result.toString(),
    )
    balances.get(sipa)?.set(token, BigInt(balance.toString()))
  }
  return balances
}

async function callAll(
  rpc: IRpcClient,
  calls: CallParameters[],
  blockNumber: number,
): Promise<Bytes[]> {
  if (!rpc.isMulticallDeployed(blockNumber)) {
    return await Promise.all(calls.map((call) => rpc.call(call, blockNumber)))
  }
  const responses = await rpc.multicall(calls, blockNumber)
  assert(responses.length === calls.length, 'Missing multicall responses')
  return responses.map(({ success, data }) => {
    assert(success, 'SIPA balance call failed')
    return data
  })
}
