import { ContractValue } from '@l2beat/discovery-types'
import { ethers, providers, utils } from 'ethers'
import * as z from 'zod'

import { getChainConfig } from '../../../config/config.discovery'
import { EthereumAddress } from '../../../utils/EthereumAddress'
import { EtherscanLikeClient } from '../../../utils/EtherscanLikeClient'
import { HttpClient } from '../../../utils/HttpClient'
import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { ProviderWithCache } from '../../provider/ProviderWithCache'
import { ClassicHandler, HandlerResult } from '../Handler'
import { callMethod } from '../utils/callMethod'
import { toContractValue } from '../utils/toContractValue'

export type ArbitrumScheduledTransactionsHandlerDefinition = z.infer<
  typeof ArbitrumScheduledTransactionsHandlerDefinition
>
export const ArbitrumScheduledTransactionsHandlerDefinition = z.strictObject({
  type: z.literal('arbitrumScheduledTransactions'),
})

const ExecutorInterface = new utils.Interface([
  'function execute(address upgrade, bytes upgradeCallData) payable',
])

// Inboxes are contracts on Ethereum used to send messages to
// L2 to execute transactions there. We can't easily
// read them from discovery and we need to keep historical
// ones for ever, so we hardcode them here.
const L2Inboxes: Record<string, string | undefined> = {
  '0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f': 'arbitrum',
  '0xc4448b71118c9071Bcb9734A0EAc55D18A153949': 'nova',
}

export class ArbitrumScheduledTransactionsHandler implements ClassicHandler {
  readonly dependencies: string[] = []
  readonly timelockInterface: utils.Interface

  constructor(
    readonly field: string,
    readonly abi: string[],
    readonly logger: DiscoveryLogger,
  ) {
    this.timelockInterface = new utils.Interface(abi)
  }

  async execute(
    provider: DiscoveryProvider,
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<HandlerResult> {
    const retryableTicketMagic = await this.getRetryableTicketMagic(
      provider,
      address,
      blockNumber,
    )
    const logs = await provider.getLogs(
      address,
      [this.timelockInterface.getEventTopic('CallScheduled')],
      0,
      blockNumber,
    )
    const result: ContractValue[] = []
    for (const log of logs) {
      const parsed = this.timelockInterface.parseLog(log)
      const decoded = await this.decodeLog(
        parsed,
        retryableTicketMagic,
        provider,
      )
      result.push(decoded)
    }
    return {
      field: this.field,
      value: result,
      ignoreRelative: true,
    }
  }

  async getRetryableTicketMagic(
    provider: DiscoveryProvider,
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<EthereumAddress> {
    const res = await callMethod(
      provider,
      address,
      this.timelockInterface.getFunction('RETRYABLE_TICKET_MAGIC'),
      [],
      blockNumber,
    )
    return EthereumAddress(res.value as string)
  }

  async decodeLog(
    log: utils.LogDescription,
    retryableTicketMagic: EthereumAddress,
    provider: DiscoveryProvider,
  ): Promise<ContractValue> {
    const target = EthereumAddress(log.args.target as string)
    // Scheduled transaction is either a call to an Executor contract on Ethereum
    // or to an Executor contract on L2 (Arbitrum or Nova chain)
    //
    // * if log.target is equal to a special magic number called RETRYABLE_TICKET_MAGIC
    //   then the transaction will be called via Executor contract on L2
    //   (going via Inbox contract on Ethereum first)
    // * otherwise the target is the Executor address on Ethereum
    const decoded =
      target.toString() === retryableTicketMagic.toString()
        ? await this.decodeL2Call(log, provider)
        : await this.decodeExecuteCall(
            'ethereum',
            target,
            log.args.data as string,
            provider,
          )

    return {
      id: toContractValue(log.args.id),
      decoded,
      raw: {
        target: toContractValue(log.args.target),
        value: toContractValue(log.args.value),
        data: toContractValue(log.args.data),
        delay: toContractValue(log.args.delay),
      },
    }
  }

  async decodeExecuteCall(
    chain: string,
    executorAddress: EthereumAddress,
    executeCalldata: string,
    provider: DiscoveryProvider | undefined,
  ): Promise<Record<string, ContractValue | undefined>> {
    const parsed = ExecutorInterface.parseTransaction({ data: executeCalldata })
    const addrToCall = EthereumAddress(parsed.args.upgrade as string)
    const calldata = parsed.args.upgradeCallData as string
    let decoded
    if (provider !== undefined) {
      const metadata = await provider.getMetadata(addrToCall)
      const contractInterface = new utils.Interface(metadata.abi)
      const decodedCalldata = this.decodeCalldata(contractInterface, calldata)
      decoded = {
        contractName: metadata.name,
        ...decodedCalldata,
      }
    }
    const result: ContractValue = {
      chain,
      ...decoded,
      address: addrToCall.toString(),
      calldata,
      executor: executorAddress.toString(),
    }
    return result
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

  async decodeL2Call(
    log: utils.LogDescription,
    provider: DiscoveryProvider,
  ): Promise<ContractValue> {
    // A call to an Executor on L2 starts as a call to an Inbox contract on
    // Ethereum. The call data has the following structure:
    // (can be found in L1ArbitrumTimelock.sol)
    const res = ethers.utils.defaultAbiCoder.decode(
      [
        'address targetInbox',
        'address l2Target',
        'uint256 l2Value',
        'uint256 gasLimit',
        'uint256 maxFeePerGas',
        'bytes memory l2Calldata',
      ],
      log.args.data as string,
    )
    const targetInbox = EthereumAddress(res.targetInbox as string)
    const chain = L2Inboxes[targetInbox.toString()]
    if (chain === undefined) {
      throw new Error(
        `Unknown inbox address ${targetInbox.toString()} for L2 call`,
      )
    }
    const l2Executor = EthereumAddress(res.l2Target as string)
    const l2Calldata = res.l2Calldata as string
    const providerForChain = this.createProviderForChain(chain, provider)
    const decoded = await this.decodeExecuteCall(
      chain,
      l2Executor,
      l2Calldata,
      providerForChain,
    )
    return {
      ...decoded,
      inboxOnEthereum: targetInbox.toString(),
    }
  }

  createProviderForChain(
    chain: string,
    curProvider: DiscoveryProvider,
  ): DiscoveryProvider | undefined {
    if (chain === 'nova') {
      // Nova arbiscan doesn't provide API so we're out of luck
      return undefined
    }
    const chainConfig = getChainConfig(chain)
    const logger = DiscoveryLogger.SILENT
    const http = new HttpClient()
    const etherscanClient = EtherscanLikeClient.createForDiscovery(
      http,
      chainConfig.etherscanUrl,
      chainConfig.etherscanApiKey,
      chainConfig.etherscanUnsupported,
    )
    const provider = new providers.StaticJsonRpcProvider(chainConfig.rpcUrl)

    if (curProvider instanceof ProviderWithCache) {
      return new ProviderWithCache(
        provider,
        etherscanClient,
        logger,
        chainConfig.name,
        curProvider.cache,
        chainConfig.rpcGetLogsMaxRange,
        chainConfig.reorgSafeDepth,
      )
    } else {
      return new DiscoveryProvider(
        provider,
        etherscanClient,
        logger,
        chainConfig.rpcGetLogsMaxRange,
      )
    }
  }
}
