import {
  assert,
  Block,
  Bytes,
  EthereumAddress,
  json,
} from '@l2beat/shared-pure'
import { generateId } from '../../tools/generateId'
import {
  ClientCore,
  ClientCoreDependencies as ClientCoreDependencies,
} from '../ClientCore'
import { BlockClient } from '../types'
import {
  CallParameters,
  EVMBalanceResponse,
  EVMBlock,
  EVMBlockResponse,
  EVMBlockWithTransactions,
  EVMBlockWithTransactionsResponse,
  EVMCallResponse,
  EVMTransactionReceiptResponse,
  EVMTransactionResponse,
  Quantity,
  RPCError,
} from './types'

interface Dependencies extends ClientCoreDependencies {
  url: string
  generateId?: () => string
}

export class RpcClient extends ClientCore implements BlockClient {
  constructor(private readonly $: Dependencies) {
    super($)
  }

  async getLatestBlockNumber() {
    const block = await this.getBlock('latest', false)
    return Number(block.number)
  }

  /** Calls eth_getBlockByNumber on RPC, includes full transactions bodies.*/
  async getBlockWithTransactions(
    blockNumber: number | 'latest',
  ): Promise<Block> {
    return await this.getBlock(blockNumber, true)
  }

  async getBlockParentBeaconRoot(blockNumber: number): Promise<string> {
    const block = await this.getBlock(blockNumber, false)

    assert(
      block.parentBeaconBlockRoot,
      `Block ${block}: parentBeaconBlockRoot should be defined`,
    )
    return block.parentBeaconBlockRoot
  }

  async getBlock(
    blockNumber: 'latest' | number,
    includeTxs: false,
  ): Promise<EVMBlock>
  async getBlock(
    blockNumber: 'latest' | number,
    includeTxs: true,
  ): Promise<EVMBlockWithTransactions>
  async getBlock(blockNumber: 'latest' | number, includeTxs: boolean) {
    const method = 'eth_getBlockByNumber'
    const encodedNumber =
      blockNumber === 'latest' ? 'latest' : Quantity.encode(BigInt(blockNumber))
    const blockResponse = await this.query(method, [encodedNumber, includeTxs])

    const block = includeTxs
      ? EVMBlockWithTransactionsResponse.safeParse(blockResponse)
      : EVMBlockResponse.safeParse(blockResponse)
    if (!block.success) {
      this.$.logger.warn(`Invalid response`, {
        blockNumber,
        includeTxs,
        response: JSON.stringify(blockResponse),
      })
      throw new Error(`Block ${blockNumber}: Error during parsing`)
    }

    return { ...block.data.result }
  }

  async getTransaction(txHash: string) {
    const response = await this.query('eth_getTransactionByHash', [txHash])

    const transaction = EVMTransactionResponse.safeParse(response)
    if (!transaction.success) {
      this.$.logger.warn(`Invalid response`, {
        txHash,
        response: JSON.stringify(response),
      })
      throw new Error(`Tx ${txHash}: Error during parsing`)
    }

    return { ...transaction.data.result }
  }

  async getTransactionReceipt(txHash: string) {
    const response = await this.query('eth_getTransactionReceipt', [txHash])

    const receipt = EVMTransactionReceiptResponse.safeParse(response)
    if (!receipt.success) {
      this.$.logger.warn(`Invalid response`, {
        txHash,
        response: JSON.stringify(response),
      })
      throw new Error(`Receipt ${txHash}: Error during parsing`)
    }

    return { ...receipt.data.result }
  }

  async getBalance(
    holder: EthereumAddress,
    blockNumber: number | 'latest',
  ): Promise<bigint> {
    const method = 'eth_getBalance'
    const encodedNumber =
      blockNumber === 'latest' ? 'latest' : Quantity.encode(BigInt(blockNumber))
    const balanceResponse = await this.query(method, [
      holder.toString(),
      encodedNumber,
    ])

    const balance = EVMBalanceResponse.safeParse(balanceResponse)
    if (!balance.success) {
      this.$.logger.warn(`Invalid response`, {
        blockNumber,
        holder,
        response: JSON.stringify(balanceResponse),
      })
      throw new Error(
        `Balance of ${holder} at block ${blockNumber}: Error during parsing`,
      )
    }
    return balance.data.result
  }

  async call(
    callParams: CallParameters,
    blockNumber: number | 'latest',
  ): Promise<Bytes> {
    const method = 'eth_call'
    const encodedNumber =
      blockNumber === 'latest' ? 'latest' : Quantity.encode(BigInt(blockNumber))

    const callObject: Record<string, string> = {
      to: callParams.to.toString(),
    }
    if (callParams.from) {
      callObject.from = callParams.from.toString()
    }
    if (callParams.data) {
      callObject.data = callParams.data.toString()
    }

    const params = [callObject, encodedNumber]
    const callResponse = await this.query(method, params)
    const callResult = EVMCallResponse.safeParse(callResponse)

    if (!callResult.success) {
      this.$.logger.warn('Error during call', JSON.stringify(callResponse))
      throw new Error('Call response: Error during parsing')
    }

    return Bytes.fromHex(callResult.data.result)
  }

  async query(
    method: string,
    params: (string | number | boolean | Record<string, string>)[],
  ) {
    return await this.fetch(this.$.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method,
        params,
        id: this.$.generateId ? this.$.generateId() : generateId(),
        jsonrpc: '2.0',
      }),
      redirect: 'follow',
      timeout: 5_000, // Most RPCs respond in ~2s during regular conditions
    })
  }

  override validateResponse(response: json): {
    success: boolean
    message?: string
  } {
    const parsedError = RPCError.safeParse(response)

    if (parsedError.success) {
      // TODO: based on error return differently
      this.$.logger.warn(`Response validation error`, {
        ...parsedError.data.error,
      })
      return { success: false }
    }

    return { success: true }
  }

  get chain() {
    return this.$.sourceName
  }
}
