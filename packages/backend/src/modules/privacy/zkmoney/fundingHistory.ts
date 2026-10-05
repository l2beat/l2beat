import type { CallParameters, IRpcClient, LogsProvider } from '@l2beat/shared'
import {
  assert,
  Bytes,
  type EthereumAddress,
  type Log,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { ERC20_TRANSFER_TOPIC, erc20Interface } from '../utils/erc20'
import { RECOVERED_TOPIC, SWEEP_TOPIC } from './abi'

/**
 * Everything that moves a SIPA balance: token transfers into and out of it,
 * and its own Sweep / Recovered events, which close a funding round. Range
 * splitting on provider limits is handled by the logs client.
 */
export async function fetchFundingHistory(
  logsProvider: LogsProvider,
  sipas: EthereumAddress[],
  tokens: EthereumAddress[],
  fromBlock: number,
  toBlock: number,
): Promise<Log[]> {
  const sipaTopics = sipas.map((sipa) => utils.hexZeroPad(sipa, 32))
  const batches = await Promise.all([
    logsProvider.getLogs(fromBlock, toBlock, tokens, [
      [ERC20_TRANSFER_TOPIC],
      null,
      sipaTopics,
    ]),
    logsProvider.getLogs(fromBlock, toBlock, tokens, [
      [ERC20_TRANSFER_TOPIC],
      sipaTopics,
    ]),
    logsProvider.getLogs(fromBlock, toBlock, sipas, [
      [SWEEP_TOPIC, RECOVERED_TOPIC],
    ]),
  ])
  return batches.flat()
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
