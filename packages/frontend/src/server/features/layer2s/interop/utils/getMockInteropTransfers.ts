import { UnixTime } from '@l2beat/shared-pure'
import { getInteropTokenUrl } from '~/pages/interop/utils/getInteropTokenUrl'
import type {
  InteropProtocolTransferDetailsItem,
  InteropProtocolTransfersResponse,
  InteropTransfersSort,
} from '../types'
import { INTEROP_CHAIN_DETAILS } from './interopChainDetails'

// Not in order, so that sorting by value visibly differs from sorting by time.
const MOCK_AMOUNTS = [1_000, 250_000, 40, 12_500, 3_200]

export function getMockInteropTransfers({
  tokenId,
  from,
  to,
  sort,
}: {
  tokenId?: string
  from: string[]
  to: string[]
  sort?: InteropTransfersSort
}): InteropProtocolTransfersResponse {
  const ethIcon =
    'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880'
  const srcChain = from[0] ?? 'ethereum'
  const dstChain = to[0] ?? 'optimism'
  const timestamp = UnixTime.now() - UnixTime.HOUR
  const isTokenMock = tokenId !== undefined
  const symbol = tokenId?.includes('usdc') ? 'USDC' : 'ETH'
  const issuer = tokenId?.includes('usdc') ? 'circle' : 'ethereum'
  const tokenHref = getInteropTokenUrl({
    id: tokenId ?? 'eth',
    symbol,
    issuer,
  })

  const items: InteropProtocolTransferDetailsItem[] = Array.from(
    { length: MOCK_AMOUNTS.length },
    (_, i) => ({
      transferId: isTokenMock
        ? `mock-token-transfer-${i}`
        : `mock-transfer-${i}`,
      timestamp: timestamp - i * 60,
      srcAmount: MOCK_AMOUNTS[i],
      srcSymbol: symbol,
      srcTokenHref: tokenHref,
      srcTokenIconUrl: isTokenMock
        ? (INTEROP_CHAIN_DETAILS.get(srcChain)?.iconUrl ?? '')
        : ethIcon,
      dstAmount: MOCK_AMOUNTS[i],
      dstSymbol: symbol,
      dstTokenHref: tokenHref,
      dstTokenIconUrl: isTokenMock
        ? (INTEROP_CHAIN_DETAILS.get(dstChain)?.iconUrl ?? '')
        : ethIcon,
      valueUsd: MOCK_AMOUNTS[i],
      bridge: {
        name: 'Polygon PoS',
        href: '/interop/protocols/polygon-pos',
      },
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

  if (sort) {
    const direction = sort.desc ? -1 : 1
    // As in the database, a transfer without a value comes last either way.
    const key = (item: InteropProtocolTransferDetailsItem) =>
      item[sort.by] ?? -direction * Number.POSITIVE_INFINITY
    items.sort((a, b) => direction * (key(a) - key(b)))
  }

  return { items, nextCursor: undefined }
}
