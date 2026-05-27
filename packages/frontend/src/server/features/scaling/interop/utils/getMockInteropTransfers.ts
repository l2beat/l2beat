import { UnixTime } from '@l2beat/shared-pure'
import type {
  InteropProtocolTransferDetailsItem,
  InteropProtocolTransfersResponse,
} from '../types'
import { INTEROP_CHAIN_DETAILS } from './interopChainDetails'

export function getMockInteropTransfers({
  tokenId,
  from,
  to,
}: {
  tokenId?: string
  from: string[]
  to: string[]
}): InteropProtocolTransfersResponse {
  const ethIcon =
    'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880'
  const srcChain = from[0] ?? 'ethereum'
  const dstChain = to[0] ?? 'optimism'
  const timestamp = UnixTime.now() - UnixTime.HOUR
  const isTokenMock = tokenId !== undefined
  const symbol = tokenId?.includes('usdc') ? 'USDC' : 'ETH'
  const issuer = tokenId?.includes('usdc') ? 'circle' : 'ethereum'

  const items: InteropProtocolTransferDetailsItem[] = Array.from(
    { length: 5 },
    (_, i) => ({
      transferId: isTokenMock
        ? `mock-token-transfer-${i}`
        : `mock-transfer-${i}`,
      timestamp: timestamp - i * 60,
      srcAmount: 1_000,
      srcSymbol: symbol,
      srcAbstractTokenId: tokenId ?? 'eth',
      srcTokenIssuer: issuer,
      srcTokenIconUrl: isTokenMock
        ? (INTEROP_CHAIN_DETAILS.get(srcChain)?.iconUrl ?? '')
        : ethIcon,
      dstAmount: 1_000,
      dstSymbol: symbol,
      dstAbstractTokenId: tokenId ?? 'eth',
      dstTokenIssuer: issuer,
      dstTokenIconUrl: isTokenMock
        ? (INTEROP_CHAIN_DETAILS.get(dstChain)?.iconUrl ?? '')
        : ethIcon,
      valueUsd: 1_000,
      duration: 60_000,
      srcChain: isTokenMock
        ? srcChain
        : (INTEROP_CHAIN_DETAILS.get(srcChain)?.name ?? srcChain),
      srcChainIconUrl: INTEROP_CHAIN_DETAILS.get(srcChain)?.iconUrl,
      srcTxHash: undefined,
      srcTxHashHref: undefined,
      dstChain: isTokenMock
        ? dstChain
        : (INTEROP_CHAIN_DETAILS.get(dstChain)?.name ?? dstChain),
      dstChainIconUrl: INTEROP_CHAIN_DETAILS.get(dstChain)?.iconUrl,
      dstTxHash: undefined,
      dstTxHashHref: undefined,
    }),
  )

  return { items, nextCursor: undefined }
}
