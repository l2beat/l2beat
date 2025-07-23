import { ChainSpecificAddress, type Hash256 } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { utils } from 'ethers'

import uniqBy from 'lodash/uniqBy'
import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import { ProxyDetector } from '../../proxies/ProxyDetector'
import { get$Implementations } from '../../utils/extractors'
import type { Handler, HandlerResult } from '../Handler'
import { toContractValue } from '../utils/toContractValue'

export type ZKsyncEraScheduledTransactionsHandlerDefinition = v.infer<
  typeof ZKsyncEraScheduledTransactionsHandlerDefinition
>
export const ZKsyncEraScheduledTransactionsHandlerDefinition = v.strictObject({
  type: v.literal('zksynceraScheduledTransactions'),
})

const abi = new utils.Interface([
  'event TransparentOperationScheduled(bytes32 indexed _id, uint256 delay, tuple(tuple(address target, uint256 value, bytes data)[] calls, bytes32 predecessor, bytes32 salt) _operation)',
  'event ShadowOperationScheduled(bytes32 indexed _id, uint256 delay)',
])

interface Call {
  target: string
  value: string
  data: string
}

interface DecodedCall {
  target: string
  value: string
  function: string
  inputs: ContractValue[]
}

interface Operation<T> {
  calls: T[]
  predecessor: string
  salt: string
}

interface ScheduledTransparent {
  delay: number
  operation: Operation<DecodedCall>
}

interface ScheduledShadow {
  delay: number
  operation: Hash256
}

interface ParsedLogWithBlockNumber {
  parsedLog: utils.LogDescription
  blockNumber: number
}

export class ZKsyncEraScheduledTransactionHandler implements Handler {
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
    const transparentTxs = await this.getTransparentTxs(provider, address)
    const shadowTxs = await this.getShadowTxs(provider, address)
    const value = this.transformIntoContractValue(transparentTxs, shadowTxs)

    return {
      field: this.field,
      value,
      ignoreRelative: true,
    }
  }

  transformIntoContractValue(
    transparent: ScheduledTransparent[],
    shadow: ScheduledShadow[],
  ): ContractValue[] {
    const transparentContractValue: ContractValue[] = transparent.map((tx) => ({
      delay: tx.delay,
      operation: {
        calls: tx.operation.calls.map((call) => ({
          target: call.target,
          value: call.value,
          function: call.function,
          inputs: call.inputs,
        })),
        predecessor: tx.operation.predecessor,
        salt: tx.operation.salt,
      },
    }))

    const shadowContractValue: ContractValue[] = shadow.map((tx) => ({
      delay: tx.delay,
      hash: tx.operation.toString(),
    }))

    return shadowContractValue.concat(transparentContractValue)
  }

  async getShadowTxs(provider: IProvider, address: ChainSpecificAddress) {
    const shadowOperationLogs = await provider.getLogs(address, [
      abi.getEventTopic('ShadowOperationScheduled'),
    ])

    const parsed: ParsedLogWithBlockNumber[] = shadowOperationLogs.map(
      (log) => ({
        parsedLog: abi.parseLog(log),
        blockNumber: log.blockNumber,
      }),
    )

    return parsed.map(
      (entry) =>
        ({
          delay: entry.parsedLog.args.delay,
          operation: entry.parsedLog.args[1],
        }) satisfies ScheduledShadow,
    )
  }

  async getTransparentTxs(provider: IProvider, address: ChainSpecificAddress) {
    const transparentOperationLogs = await provider.getLogs(address, [
      abi.getEventTopic('TransparentOperationScheduled'),
    ])
    const parsed: ParsedLogWithBlockNumber[] = transparentOperationLogs.map(
      (log) => ({
        parsedLog: abi.parseLog(log),
        blockNumber: log.blockNumber,
      }),
    )

    return await Promise.all(
      parsed.map(
        async (entry) =>
          ({
            delay: entry.parsedLog.args.delay,
            operation: await this.decodeOperation(
              provider,
              entry.blockNumber,
              this.extractOperationFromResult(entry.parsedLog.args[2]),
            ),
          }) satisfies ScheduledTransparent,
      ),
    )
  }

  extractOperationFromResult(result: utils.Result): Operation<Call> {
    return {
      // biome-ignore lint/suspicious/noExplicitAny: tuple inside tuple
      calls: result.calls.map((a: any) => ({
        value: a.value.toBigInt().toString(),
        target: a.target,
        data: a.data,
      })),
      predecessor: result.predecessor,
      salt: result.salt,
    }
  }

  async decodeOperation(
    provider: IProvider,
    blockNumber: number,
    operation: Operation<Call>,
  ): Promise<Operation<DecodedCall>> {
    const calls = await Promise.all(
      operation.calls.map(
        async (call) =>
          await this.decodeCall(await provider.switchBlock(blockNumber), call),
      ),
    )
    return {
      calls,
      predecessor: operation.predecessor,
      salt: operation.salt,
    }
  }

  async decodeCall(provider: IProvider, call: Call): Promise<DecodedCall> {
    const detector = new ProxyDetector()
    const result = await detector.detectProxy(
      provider,
      ChainSpecificAddress(call.target),
    )
    const addresses = [ChainSpecificAddress(call.target)]
    if (result !== undefined) {
      addresses.push(...get$Implementations(result.values))
    }

    const metadatas = await Promise.all(
      addresses.map((a) => provider.getSource(a)),
    )
    const abi = uniqBy(
      metadatas.flatMap((m) => uniqBy(m.abi, JSON.stringify)),
      JSON.stringify,
    ).filter((a) => !a.startsWith('constructor'))
    const contractInterface = new utils.Interface(abi)
    const decodedCalldata = this.decodeCalldata(contractInterface, call.data)
    return {
      target: call.target,
      value: call.value,
      ...decodedCalldata,
    } satisfies DecodedCall
  }

  decodeCalldata(
    iface: utils.Interface,
    calldata: string,
  ): {
    function: string
    inputs: { name: ContractValue; value: ContractValue }[]
  } {
    const r = iface.parseTransaction({
      data: calldata,
    })
    return {
      function: r.functionFragment.name,
      inputs: r.functionFragment.inputs.map((i) => ({
        name: toContractValue(i.name),
        value: toContractValue(r.args[i.name]),
      })),
    }
  }
}
