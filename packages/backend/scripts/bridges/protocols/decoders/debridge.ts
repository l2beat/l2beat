import { EthereumAddress } from '@l2beat/shared-pure'
import { decodeEventLog, encodeEventTopics, parseAbi } from 'viem'
import type { Chain } from '../../chains'
import type { Asset } from '../../types/Asset'
import type { DecoderInput } from '../../types/DecoderInput'
import type { Message } from '../../types/Message'

export const DEBRIDGE = {
  name: 'debridge',
  decoder: decoder,
}

const ABI = parseAbi([
  'event CreatedOrder((uint64 makerOrderNonce,bytes makerSrc,uint256 giveChainId,bytes giveTokenAddress,uint256 giveAmount, uint256 takeChainId, bytes takeTokenAddress, uint256 takeAmount, bytes receiverDst, bytes givePatchAuthoritySrc, bytes orderAuthorityAddressDst, bytes allowedTakerDst, bytes allowedCancelBeneficiarySrc, bytes externallCall) order,bytes32 orderId, bytes affiliateFee, uint256 nativeFixFee, uint256 percentFee, uint32 referralCode, bytes metadata)',
  'event FulfilledOrder((uint64 makerOrderNonce,bytes makerSrc,uint256 giveChainId,bytes giveTokenAddress,uint256 giveAmount, uint256 takeChainId, bytes takeTokenAddress, uint256 takeAmount, bytes receiverDst, bytes givePatchAuthoritySrc, bytes orderAuthorityAddressDst, bytes allowedTakerDst, bytes allowedCancelBeneficiarySrc, bytes externallCall) order, bytes32 orderId, address sender, address unlockAuthority)',
  'event Sent(bytes32 submissionId, bytes32 indexed debridgeId, uint256 amount, bytes receiver, uint256 nonce, uint256 indexed chainIdTo, uint32 referralCode, (uint256,uint256,uint256,bool,bool) feeParams, bytes autoParams, address nativeSender)',
  'event Claimed(bytes32 submissionId, bytes32 indexed debridgeId, uint256 amount, address indexed receiver, uint256 nonce, uint256 indexed chainIdFrom, bytes autoParams, bool isNativeToken)',
])

function decoder(
  chain: Chain,
  input: DecoderInput,
): Message | Asset | undefined {
  const network = NETWORKS.find((b) => b.chainShortName === chain.shortName)

  if (!network) return undefined

  if (
    EthereumAddress(input.log.address) === network.dinSource &&
    input.log.topics[0] ===
      encodeEventTopics({ abi: ABI, eventName: 'CreatedOrder' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: input.log.data,
      topics: input.log.topics,
      eventName: 'CreatedOrder',
    })

    const destination = NETWORKS.find(
      (b) => b.chainId === +data.args.order.takeChainId.toString(),
    )?.chainShortName

    return {
      type: 'asset',
      direction: 'outbound',
      application: DEBRIDGE.name,
      origin: chain.shortName,
      destination: destination ?? data.args.order.takeChainId.toString(),
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'CreatedOrder',
      matchingId: data.args.orderId,
      amount: data.args.order.giveAmount,
      token: data.args.order.giveTokenAddress,
      messageProtocol: DEBRIDGE.name,
      // messageId: string
    }
  }

  if (
    EthereumAddress(input.log.address) === network.dinDestination &&
    input.log.topics[0] ===
      encodeEventTopics({ abi: ABI, eventName: 'FulfilledOrder' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: input.log.data,
      topics: input.log.topics,
      eventName: 'FulfilledOrder',
    })

    const origin = NETWORKS.find(
      (c) => c.chainId === +data.args.order.giveChainId.toString(),
    )?.chainShortName

    return {
      type: 'asset',
      direction: 'inbound',
      application: DEBRIDGE.name,
      origin: origin ?? data.args.order.giveChainId.toString(),
      destination: chain.shortName,
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'FulfilledOrder',
      matchingId: data.args.orderId,
      amount: data.args.order.takeAmount,
      token: data.args.order.takeTokenAddress,
      messageProtocol: DEBRIDGE.name,
      // messageId: string
    }
  }

  if (
    EthereumAddress(input.log.address) === network.gate &&
    input.log.topics[0] ===
      encodeEventTopics({ abi: ABI, eventName: 'Sent' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: input.log.data,
      topics: input.log.topics,
      eventName: 'Sent',
    })

    const destination = NETWORKS.find(
      (b) => b.chainId === +data.args.chainIdTo.toString(),
    )?.chainShortName

    return {
      type: 'message',
      direction: 'outbound',
      protocol: DEBRIDGE.name,
      origin: chain.shortName,
      destination: destination ?? data.args.chainIdTo.toString(),
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'Sent',
      matchingId: data.args.debridgeId,
    }
  }

  if (
    EthereumAddress(input.log.address) === network.gate &&
    input.log.topics[0] ===
      encodeEventTopics({ abi: ABI, eventName: 'Claimed' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: input.log.data,
      topics: input.log.topics,
      eventName: 'Claimed',
    })

    const origin = NETWORKS.find(
      (c) => c.chainId === +data.args.chainIdFrom.toString(),
    )?.chainShortName

    return {
      type: 'message',
      direction: 'inbound',
      protocol: DEBRIDGE.name,
      origin: origin ?? data.args.chainIdFrom.toString(),
      destination: chain.shortName,
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'Claimed',
      matchingId: data.args.debridgeId,
    }
  }

  return undefined
}

const NETWORKS = [
  {
    chainId: 1,
    chainShortName: 'eth',
    dinDestination: EthereumAddress(
      '0xE7351Fd770A37282b91D153Ee690B63579D6dd7f',
    ),
    dinSource: EthereumAddress('0xeF4fB24aD0916217251F553c0596F8Edc630EB66'),
    gate: EthereumAddress('0x43dE2d77BF8027e25dBD179B491e8d64f38398aA'),
  },
  {
    chainId: 42161,
    chainShortName: 'arb1',
    dinDestination: EthereumAddress(
      '0xE7351Fd770A37282b91D153Ee690B63579D6dd7f',
    ),
    dinSource: EthereumAddress('0xeF4fB24aD0916217251F553c0596F8Edc630EB66'),
    gate: EthereumAddress('0x43dE2d77BF8027e25dBD179B491e8d64f38398aA'),
  },
  {
    chainId: 8453,
    chainShortName: 'base',
    dinDestination: EthereumAddress(
      '0xE7351Fd770A37282b91D153Ee690B63579D6dd7f',
    ),
    dinSource: EthereumAddress('0xeF4fB24aD0916217251F553c0596F8Edc630EB66'),
    gate: EthereumAddress('0xc1656B63D9EEBa6d114f6bE19565177893e5bCBF'),
  },
]
