import type { RpcClient } from '@l2beat/shared'
import { assert, Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import {
  decodeEventLog,
  encodeEventTopics,
  encodeFunctionData,
  parseAbi,
} from 'viem'
import type { Chain } from '../../chains'
import type { Asset } from '../../types/Asset'
import type { DecoderInput } from '../../types/DecoderInput'
import type { Message } from '../../types/Message'
import { extractAddressFromPadded } from '../../utils/viem'

export const AXELAR = {
  name: 'axelar',
  decoder: decoder,
}

const ABI = parseAbi([
  // InterchainTransfer
  'event InterchainTransfer(bytes32 indexed tokenId, address indexed sourceAddress, string destinationChain, bytes destinationAddress, uint256 amount, bytes32 indexed dataHash)',
  'event InterchainTransferReceived(bytes32 indexed commandId, bytes32 indexed tokenId, string sourceChain, bytes sourceAddress, address indexed destinationAddress, uint256 amount, bytes32 dataHash)',
  // ContractCallWithToken
  'event ContractCallWithToken(address indexed sender, string destinationChain, string destinationContractAddress, bytes32 indexed payloadHash, bytes payload, string symbol, uint256 amount)',
  'event ContractCallExecuted(bytes32 indexed commandId)',
  'event ExpressExecutionWithTokenFulfilled(bytes32 indexed commandId, string sourceChain, string sourceAddress, bytes32 payloadHash, string symbol, uint256 indexed amount, address indexed expressExecutor)',
  'function deployedTokenManager(bytes32 tokenId) public view returns (address)',
  'function tokenAddress() public view returns (address)',
  'function tokenAddresses(string symbol) view returns (address)',
])

async function decoder(
  chain: Chain,
  input: DecoderInput,
  rpc?: RpcClient,
): Promise<Message | Asset | undefined> {
  const network = NETWORKS.find((b) => b.chainShortName === chain.shortName)

  if (!network) return undefined

  if (
    EthereumAddress(input.log.address) === network.interchainTokenService &&
    input.log.topics[0] ===
      encodeEventTopics({ abi: ABI, eventName: 'InterchainTransfer' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: input.log.data,
      topics: input.log.topics,
      eventName: 'InterchainTransfer',
    })

    assert(rpc)
    const deployedTokenManager = await rpc.call(
      {
        to: network.interchainTokenService,
        data: Bytes.fromHex(
          encodeFunctionData({
            abi: ABI,
            functionName: 'deployedTokenManager',
            args: [data.args.tokenId],
          }),
        ),
      },
      input.blockNumber,
    )
    const tokenManager = extractAddressFromPadded(
      deployedTokenManager.toString(),
    )
    const tokenAddress = await rpc.call(
      {
        to: EthereumAddress(tokenManager),
        data: Bytes.fromHex(
          encodeFunctionData({
            abi: ABI,
            functionName: 'tokenAddress',
            args: [],
          }),
        ),
      },
      input.blockNumber,
    )
    const token = extractAddressFromPadded(tokenAddress.toString())

    const destination = NETWORKS.find(
      (b) =>
        b.axelarChainName.toLowerCase() ===
        data.args.destinationChain.toLowerCase(),
    )?.chainShortName

    return {
      type: 'asset',
      direction: 'outbound',
      application: AXELAR.name,
      origin: chain.shortName,
      destination: destination ?? data.args.destinationChain,
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'InterchainTransfer',
      matchingId: messageToCommandId(
        network.axelarChainName,
        input.transactionHash,
      ),
      amount: data.args.amount,
      token: token,
      // messageProtocol?: string
      // messageId?: string
    }
  }

  if (
    EthereumAddress(input.log.address) === network.interchainTokenService &&
    input.log.topics[0] ===
      encodeEventTopics({
        abi: ABI,
        eventName: 'InterchainTransferReceived',
      })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: input.log.data,
      topics: input.log.topics,
      eventName: 'InterchainTransferReceived',
    })

    assert(rpc)
    const deployedTokenManager = await rpc.call(
      {
        to: network.interchainTokenService,
        data: Bytes.fromHex(
          encodeFunctionData({
            abi: ABI,
            functionName: 'deployedTokenManager',
            args: [data.args.tokenId],
          }),
        ),
      },
      input.blockNumber,
    )
    const tokenManager = extractAddressFromPadded(
      deployedTokenManager.toString(),
    )
    const tokenAddress = await rpc.call(
      {
        to: EthereumAddress(tokenManager),
        data: Bytes.fromHex(
          encodeFunctionData({
            abi: ABI,
            functionName: 'tokenAddress',
            args: [],
          }),
        ),
      },
      input.blockNumber,
    )
    const token = extractAddressFromPadded(tokenAddress.toString())

    const origin = NETWORKS.find(
      (b) => b.axelarChainName === data.args.sourceChain,
    )?.chainShortName

    return {
      type: 'asset',
      direction: 'inbound',
      application: AXELAR.name,
      origin: origin ?? data.args.sourceChain,
      destination: chain.shortName,
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'InterchainTransferReceived',
      matchingId: data.args.commandId,
      amount: data.args.amount,
      token: token,
      // messageProtocol?: string
      // messageId?: string
    }
  }

  if (
    EthereumAddress(input.log.address) === network.gateway &&
    input.log.topics[0] ===
      encodeEventTopics({
        abi: ABI,
        eventName: 'ContractCallWithToken',
      })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: input.log.data,
      topics: input.log.topics,
      eventName: 'ContractCallWithToken',
    })

    assert(rpc)

    const tokenAddress = await rpc.call(
      {
        to: network.gateway,
        data: Bytes.fromHex(
          encodeFunctionData({
            abi: ABI,
            functionName: 'tokenAddresses',
            args: [data.args.symbol],
          }),
        ),
      },
      input.blockNumber,
    )
    const token = extractAddressFromPadded(tokenAddress.toString())

    const destination = NETWORKS.find(
      (b) =>
        b.axelarChainName.toLowerCase() ===
        data.args.destinationChain.toLowerCase(),
    )?.chainShortName

    return {
      type: 'asset',
      direction: 'outbound',
      application: AXELAR.name,
      origin: chain.shortName,
      destination: destination ?? data.args.destinationChain,
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'ContractCallWithToken',
      matchingId: messageToCommandId(
        network.axelarChainName,
        input.transactionHash,
      ),
      amount: data.args.amount,
      token: token,
      // messageProtocol?: string
      // messageId?: string
    }
  }

  if (
    EthereumAddress(input.log.address) === network.gateway &&
    input.log.topics[0] ===
      encodeEventTopics({
        abi: ABI,
        eventName: 'ContractCallExecuted',
      })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: input.log.data,
      topics: input.log.topics,
      eventName: 'ContractCallExecuted',
    })

    const expressLog = input.transactionLogs.find(
      (l) =>
        l.topics[0] ===
          encodeEventTopics({
            abi: ABI,
            eventName: 'ExpressExecutionWithTokenFulfilled',
          })[0] &&
        decodeEventLog({
          abi: ABI,
          data: l.data,
          topics: l.topics,
          eventName: 'ExpressExecutionWithTokenFulfilled',
        }).args.commandId === data.args.commandId,
    )
    if (!expressLog) {
      return undefined
    }

    const expressData = decodeEventLog({
      abi: ABI,
      data: expressLog.data,
      topics: expressLog.topics,
      eventName: 'ExpressExecutionWithTokenFulfilled',
    })

    assert(rpc)
    const tokenAddress = await rpc.call(
      {
        to: network.gateway,
        data: Bytes.fromHex(
          encodeFunctionData({
            abi: ABI,
            functionName: 'tokenAddresses',
            args: [expressData.args.symbol],
          }),
        ),
      },
      input.blockNumber,
    )
    const token = extractAddressFromPadded(tokenAddress.toString())

    const origin = NETWORKS.find(
      (b) =>
        b.axelarChainName.toLowerCase() ===
        expressData.args.sourceChain.toLowerCase(),
    )?.chainShortName

    return {
      type: 'asset',
      direction: 'inbound',
      application: AXELAR.name,
      origin: origin ?? expressData.args.sourceChain,
      destination: chain.shortName,
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'ExpressExecutionWithTokenFulfilled',
      matchingId: data.args.commandId,
      amount: expressData.args.amount,
      token: token,
      // messageProtocol?: string
      // messageId?: string
    }
  }

  return undefined
}

const NETWORKS = [
  {
    chainShortName: 'eth',
    interchainTokenService: EthereumAddress(
      '0xB5FB4BE02232B1bBA4dC8f81dc24C26980dE9e3C',
    ),
    gateway: EthereumAddress('0x4F4495243837681061C4743b74B3eEdf548D56A5'),
    axelarChainName: 'Ethereum',
  },
  {
    chainShortName: 'base',
    interchainTokenService: EthereumAddress(
      '0xB5FB4BE02232B1bBA4dC8f81dc24C26980dE9e3C',
    ),
    gateway: EthereumAddress('0xe432150cce91c13a887f7D836923d5597adD8E31'),
    axelarChainName: 'base',
  },
  {
    chainShortName: 'arb1',
    interchainTokenService: EthereumAddress(
      '0xB5FB4BE02232B1bBA4dC8f81dc24C26980dE9e3C',
    ),
    gateway: EthereumAddress('0xe432150cce91c13a887f7D836923d5597adD8E31'),
    axelarChainName: 'arbitrum',
  },
  {
    chainShortName: 'oeth',
    interchainTokenService: EthereumAddress(
      '0xB5FB4BE02232B1bBA4dC8f81dc24C26980dE9e3C',
    ),
    gateway: EthereumAddress('0xe432150cce91c13a887f7D836923d5597adD8E31'),
    axelarChainName: 'optimism',
  },
]

// TODO: this function does not correctly calculate commandId for now
//https://axelarscan.io/gmp/0xc87067b17b65949c58628e02444fab84d804147edd8575dff77fb375b513e140
// /https://docs.axelar.dev/resources/axelar-commandid/
// message ID is somehow connected with event index, this "-<number>" suffix
function messageToCommandId(sourceChain: string, messageId: string): string {
  // Axelar doesn't allow `sourceChain` to contain '_', hence this encoding is unambiguous
  const concatenated = `${sourceChain}_${messageId}`
  return utils.keccak256(utils.toUtf8Bytes(concatenated))
}
