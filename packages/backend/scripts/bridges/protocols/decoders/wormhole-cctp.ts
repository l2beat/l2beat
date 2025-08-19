import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { decodeEventLog, encodeEventTopics, parseAbi } from 'viem'
import type { Chain } from '../../chains'
import type { Asset } from '../../types/Asset'
import type { DecoderInput } from '../../types/DecoderInput'
import type { Message } from '../../types/Message'
import { extractAddressFromPadded } from '../../utils/viem'
import { createWormholeSequence } from '../../utils/wormhole'

export const WORMHOLE_CCTP = {
  name: 'wormhole-cctp',
  decoder: decoder,
}

const ABI = parseAbi([
  'event Redeemed(uint16 indexed emitterChainId,bytes32 indexed emitterAddress, uint64 indexed sequence)',
  'event MintAndWithdraw(address indexed mintRecipient, uint256 amount, address indexed mintToken)',
  'event LogMessagePublished(address indexed sender, uint64 sequence, uint32 nonce, bytes payload, uint8 consistencyLevel)',
  'event DepositForBurn(uint64 indexed nonce, address indexed burnToken, uint256 amount, address indexed depositor, bytes32 mintRecipient, uint32 destinationDomain, bytes32 destinationTokenMessenger, bytes32 destinationCaller)',
  'function parseTransfer(bytes memory encoded) public pure returns ((uint8 payloadID,uint256 amount,bytes32 tokenAddress,uint16 tokenChain,bytes32 to,uint16 toChain,uint256 fee) memory transfer)',
])

function decoder(
  chain: Chain,
  input: DecoderInput,
): Message | Asset | undefined {
  const network = NETWORKS.find((b) => b.chainShortName === chain.shortName)

  if (!network) return undefined

  if (
    EthereumAddress(input.log.address) === network.coreBridge &&
    input.log.topics[0] ===
      encodeEventTopics({ abi: ABI, eventName: 'LogMessagePublished' })[0]
  ) {
    const depositForBurnLog = input.transactionLogs.find(
      (l) =>
        l.topics[0] ===
        encodeEventTopics({ abi: ABI, eventName: 'DepositForBurn' })[0],
    )

    if (!depositForBurnLog) {
      return undefined
    }

    const { amount, burnToken, destinationDomain } = decodeEventLog({
      abi: ABI,
      data: depositForBurnLog.data,
      topics: depositForBurnLog.topics,
      eventName: 'DepositForBurn',
    }).args

    const data = decodeEventLog({
      abi: ABI,
      data: input.log.data,
      topics: input.log.topics,
      eventName: 'LogMessagePublished',
    })

    const id = createWormholeSequence(
      network.chainId,
      EthereumAddress(data.args.sender),
      data.args.sequence,
    )

    // It is also possible to do it via decoding wormhole transfer payload
    const destination = NETWORKS.find(
      (b) => b.chainId === destinationDomain,
    )?.chainShortName

    return {
      type: 'asset',
      direction: 'outbound',
      application: WORMHOLE_CCTP.name,
      origin: chain.shortName,
      destination: destination ?? destinationDomain.toString(),
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'LogMessagePublished',
      matchingId: id,
      amount: amount,
      token: burnToken,
      // messageProtocol: string,
      // messageId: string
    }
  }

  if (
    EthereumAddress(input.log.address) === network.wormholeCCTP &&
    input.log.topics[0] ===
      encodeEventTopics({ abi: ABI, eventName: 'Redeemed' })[0]
  ) {
    const data = decodeEventLog({
      abi: ABI,
      data: input.log.data,
      topics: input.log.topics,
      eventName: 'Redeemed',
    })

    const id = createWormholeSequence(
      data.args.emitterChainId,
      EthereumAddress(extractAddressFromPadded(data.args.emitterAddress)),
      data.args.sequence,
    )

    const origin = NETWORKS.find(
      (c) => c.chainId === data.args.emitterChainId,
    )?.chainShortName

    const mintAndWithdrawLog = input.transactionLogs.find(
      (l) =>
        l.topics[0] ===
        encodeEventTopics({ abi: ABI, eventName: 'MintAndWithdraw' })[0],
    )
    assert(
      mintAndWithdrawLog,
      `Inbound Token heuristic failed ${input.transactionHash}`,
    )
    const { mintToken, amount } = decodeEventLog({
      abi: ABI,
      data: mintAndWithdrawLog.data,
      topics: mintAndWithdrawLog.topics,
      eventName: 'MintAndWithdraw',
    }).args

    return {
      type: 'asset',
      direction: 'inbound',
      application: WORMHOLE_CCTP.name,
      origin: origin ?? data.args.emitterChainId.toString(),
      destination: chain.shortName,
      blockTimestamp: input.blockTimestamp,
      txHash: input.transactionHash,
      customType: 'TransferRedeemed',
      matchingId: id,
      amount: amount,
      token: mintToken,
      // messageProtocol: string,
      // messageId: string
    }
  }

  return undefined
}

const NETWORKS = [
  {
    chainId: 2,
    chainShortName: 'eth',
    coreBridge: EthereumAddress('0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B'),
    tokenBridge: EthereumAddress('0x3ee18B2214AFF97000D974cf647E7C347E8fa585'),
    wormholeCCTP: EthereumAddress('0xAaDA05BD399372f0b0463744C09113c137636f6a'),
    cctpDestinationDomain: 0,
  },
  {
    chainId: 23,
    chainShortName: 'arb1',
    coreBridge: EthereumAddress('0xa5f208e072434bC67592E4C49C1B991BA79BCA46'),
    tokenBridge: EthereumAddress('0x0b2402144Bb366A632D14B83F244D2e0e21bD39c'),
    wormholeCCTP: EthereumAddress('0x2703483B1a5a7c577e8680de9Df8Be03c6f30e3c'),
    cctpDestinationDomain: 3,
  },
  {
    chainId: 30,
    chainShortName: 'base',
    coreBridge: EthereumAddress('0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6'),
    tokenBridge: EthereumAddress('0x8d2de8d2f73F1F4cAB472AC9A881C9b123C79627'),
    wormholeCCTP: EthereumAddress('0x03faBB06Fa052557143dC28eFCFc63FC12843f1D'),
    cctpDestinationDomain: 6,
  },
]
