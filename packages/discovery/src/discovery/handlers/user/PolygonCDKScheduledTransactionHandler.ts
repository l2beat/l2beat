import { assert, ChainSpecificAddress, unique } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { utils } from 'ethers'

import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import { ProxyDetector } from '../../proxies/ProxyDetector'
import { get$Implementations } from '../../utils/extractors'
import { getSighash } from '../getSighash'
import type { Handler, HandlerResult } from '../Handler'
import { toContractValue } from '../utils/toContractValue'

export type PolygonCDKScheduledTransactionsHandlerDefinition = v.infer<
  typeof PolygonCDKScheduledTransactionsHandlerDefinition
>
export const PolygonCDKScheduledTransactionsHandlerDefinition = v.strictObject({
  type: v.literal('polygoncdkScheduledTransactions'),
})

const abi = new utils.Interface([
  'event CallScheduled(bytes32 indexed id, uint256 indexed index, address target, uint256 value, bytes data, bytes32 predecessor, uint256 delay)',
])

interface Call {
  target: string
  value: string
  data: string
  predecessor: string
  delay: string
}

interface DecodedCall {
  target: string
  value: string
  function: string
  inputs: { [key: string]: ContractValue }
  predecessor: string
  delay: string
}

const additionalDecodeMap: Record<
  string,
  (
    provider: IProvider,
    params: { [key: string]: ContractValue },
  ) => Promise<{ [key: string]: ContractValue }>
> = {
  upgradeAndCall: async (
    provider: IProvider,
    params: { [key: string]: ContractValue },
  ): Promise<{ [key: string]: ContractValue }> => {
    const { implementation, data } = params
    assert(implementation !== undefined)
    assert(data !== undefined)

    const metadata = await provider.getSource(
      ChainSpecificAddress.fromLong(provider.chain, implementation.toString()),
    )
    const contractInterface = new utils.Interface(metadata.abi)
    const tx = contractInterface.parseTransaction({ data: data.toString() })
    const decodedData = tx.functionFragment.inputs.reduce(
      (acc, v) => {
        acc[v.name] = toContractValue(tx.args[v.name])
        return acc
      },
      {} as { [key: string]: ContractValue },
    )
    return {
      ...params,
      data: decodedData,
    }
  },
}

export class PolygonCDKScheduledTransactionHandler implements Handler {
  readonly dependencies: string[] = []
  readonly timelockInterface: utils.Interface

  constructor(
    readonly field: string,
    readonly abi: string[],
  ) {
    this.timelockInterface = new utils.Interface(abi)
  }

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const transactions = await this.getTransactions(provider, address)
    const value = this.transformIntoContractValue(transactions)

    return {
      field: this.field,
      value,
      ignoreRelative: true,
    }
  }

  transformIntoContractValue(calls: DecodedCall[]): ContractValue[] {
    return calls.map((c) => ({
      target: c.target,
      value: c.value,
      function: c.function,
      inputs: c.inputs,
      predecessor: c.predecessor,
      delay: c.delay,
    }))
  }

  async getTransactions(provider: IProvider, address: ChainSpecificAddress) {
    const callLogs = await provider.getLogs(address, [
      abi.getEventTopic('CallScheduled'),
    ])

    const parsed = callLogs.map((log) => ({
      parsedLog: abi.parseLog(log),
      blockNumber: log.blockNumber,
    }))

    return await Promise.all(
      parsed.map(async (entry) =>
        this.decodeCall(
          await provider.switchBlock(entry.blockNumber),
          this.extractCallFromResult(entry.parsedLog.args),
        ),
      ),
    )
  }

  extractCallFromResult(result: utils.Result): Call {
    return {
      target: result.target,
      value: result.value.toBigInt().toString(),
      data: result.data,
      predecessor: result.predecessor,
      delay: result.delay.toBigInt().toString(),
    }
  }

  async decodeCall(provider: IProvider, entry: Call): Promise<DecodedCall> {
    const detector = new ProxyDetector()
    const result = await detector.detectProxy(
      provider,
      ChainSpecificAddress.fromLong(provider.chain, entry.target),
    )
    const addresses = [
      ChainSpecificAddress.fromLong(provider.chain, entry.target),
    ]
    if (result !== undefined) {
      addresses.push(...get$Implementations(result.values))
    }

    const metadatas = await Promise.all(
      addresses.map((a) => provider.getSource(a)),
    )
    const contractInterface = new utils.Interface(
      unique(
        metadatas.flatMap((m) => m.abi).filter((f) => f.startsWith('function')),
        (f) => getSighash(f),
      ),
    )
    const decodedCalldata = await this.decodeCalldata(
      provider,
      contractInterface,
      entry.data,
    )

    return {
      ...entry,
      ...decodedCalldata,
    }
  }

  async decodeCalldata(
    provider: IProvider,
    iface: utils.Interface,
    calldata: string,
  ): Promise<{
    function: string
    inputs: { [key: string]: ContractValue }
  }> {
    try {
      const r = iface.parseTransaction({
        data: calldata,
      })

      const result = {
        function: r.functionFragment.name,
        inputs: r.functionFragment.inputs.reduce(
          (acc, v) => {
            acc[v.name] = toContractValue(r.args[v.name])
            return acc
          },
          {} as { [key: string]: ContractValue },
        ),
      }

      const decodeFn = additionalDecodeMap[r.functionFragment.name]
      return decodeFn !== undefined
        ? {
            ...result,
            inputs: await decodeFn(provider, result.inputs),
          }
        : result
    } catch {
      // NOTE(radomski): There is a possibility that a scheduled transaction
      // will use a function selector that is not present at the time of
      // scheduling. Just write the calldata inplace without decoding
      return {
        function: calldata.slice(0, 10),
        inputs: { calldata: calldata.slice(10) },
      }
    }
  }
}
