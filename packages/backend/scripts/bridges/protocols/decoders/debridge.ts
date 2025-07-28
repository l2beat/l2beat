import { EthereumAddress } from '@l2beat/shared-pure'
import { decodeEventLog, encodeEventTopics, parseAbi } from 'viem'
import type { Chain } from '../../chains'
import type { Asset } from '../../types/Asset'
import type { Message } from '../../types/Message'
import type { TransactionWithLogs } from '../../types/TransactionWithLogs'

export const DEBRIDGE = {
  name: 'debridge',
  decoder: decoder,
}

const ABI = parseAbi([
  'event CreatedOrder((uint64,bytes,uint256 giveChainId,bytes,uint256,uint256,bytes,uint256,bytes,bytes,bytes,bytes,bytes,bytes) order,bytes32 orderId, bytes affiliateFee, uint256 nativeFixFee, uint256 percentFee, uint32 referralCode, bytes metadata)',
  'event FulfilledOrder((uint64,bytes,uint256 giveChainId,bytes,uint256,uint256,bytes,uint256,bytes,bytes,bytes,bytes,bytes,bytes) order, bytes32 orderId, address sender, address unlockAuthority)',
])

function decoder(
  chain: Chain,
  transaction: TransactionWithLogs,
): Partial<{ message: Message; asset: Asset }> | undefined {
  for (const log of transaction.logs) {
    const network = NETWORKS.find((b) => b.chainShortName === chain.shortName)

    if (!network) continue

    if (
      EthereumAddress(log.address) === network.dinSource &&
      log.topics[0] ===
        encodeEventTopics({ abi: ABI, eventName: 'CreatedOrder' })[0]
    ) {
      const data = decodeEventLog({
        abi: ABI,
        data: log.data,
        topics: log.topics,
        eventName: 'CreatedOrder',
      })

      const destination = NETWORKS.find(
        (b) => b.chainId === +data.args.order[5].toString(),
      )?.chainShortName

      return {
        message: {
          direction: 'outbound',
          protocol: DEBRIDGE.name,
          origin: chain.shortName,
          destination: destination ?? data.args.order[5].toString(),
          blockTimestamp: transaction.blockTimestamp,
          txHash: transaction.hash,
          type: 'CreatedOrder',
          matchingId: data.args.orderId,
        },
      }
    }

    if (
      EthereumAddress(log.address) === network.dinDestination &&
      log.topics[0] ===
        encodeEventTopics({ abi: ABI, eventName: 'FulfilledOrder' })[0]
    ) {
      const data = decodeEventLog({
        abi: ABI,
        data: log.data,
        topics: log.topics,
        eventName: 'FulfilledOrder',
      })

      const origin = NETWORKS.find(
        (c) => c.chainId === +data.args.order[2].toString(),
      )?.chainShortName

      return {
        message: {
          direction: 'inbound',
          protocol: DEBRIDGE.name,
          origin: origin ?? data.args.order[2].toString(),
          destination: chain.shortName,
          blockTimestamp: transaction.blockTimestamp,
          txHash: transaction.hash,
          type: 'FulfilledOrder',
          matchingId: data.args.orderId,
        },
      }
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
  },
  {
    chainId: 42161,
    chainShortName: 'arb1',
    dinDestination: EthereumAddress(
      '0xE7351Fd770A37282b91D153Ee690B63579D6dd7f',
    ),
    dinSource: EthereumAddress('0xeF4fB24aD0916217251F553c0596F8Edc630EB66'),
  },
  {
    chainId: 8453,
    chainShortName: 'base',
    dinDestination: EthereumAddress(
      '0xE7351Fd770A37282b91D153Ee690B63579D6dd7f',
    ),
    dinSource: EthereumAddress('0xeF4fB24aD0916217251F553c0596F8Edc630EB66'),
  },
]
