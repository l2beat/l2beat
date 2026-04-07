import {
  Address32,
  formatLargeNumber,
  formatSeconds,
} from '@l2beat/shared-pure'
import type { TransferDetailsInput } from './types'

export function buildTransferDetailsPath(filters: TransferDetailsInput) {
  const params = new URLSearchParams()

  if (filters.plugin) {
    params.set('plugin', filters.plugin)
  }
  if (filters.srcChain) {
    params.set('srcChain', filters.srcChain)
  }
  if (filters.dstChain) {
    params.set('dstChain', filters.dstChain)
  }

  const query = params.toString()
  const encodedType = encodeURIComponent(filters.type)

  if (query.length === 0) {
    return `/transfers/${encodedType}`
  }

  return `/transfers/${encodedType}?${query}`
}

export function parseOptionalSearchParam(value: string | null) {
  if (value === null || value.trim().length === 0) {
    return undefined
  }

  return value
}

export function decodeRouteParam(value: string | undefined) {
  if (value === undefined) {
    return undefined
  }

  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export function formatTransferTimestamp(timestamp: number) {
  return `${toCsvIsoTimestamp(timestamp).slice(0, 19).replace('T', ' ')}`
}

export function toCsvIsoTimestamp(timestamp: number) {
  return new Date(timestamp * 1000).toISOString()
}

export function formatTransferDuration(duration: number | undefined) {
  if (duration === undefined || Number.isNaN(duration)) {
    return '-'
  }

  return formatSeconds(duration)
}

export function formatDollars(
  value: number | string | null | undefined,
): string {
  if (value == null || value === '') return '-'

  const num = typeof value === 'string' ? Number.parseFloat(value) : value
  if (Number.isNaN(num)) return '-'

  return `$${formatLargeNumber(num)}`
}

export function shortenHash(hash: string, prefixLength = 10, suffixLength = 8) {
  if (hash.length <= prefixLength + suffixLength + 1) {
    return hash
  }

  return `${hash.slice(0, prefixLength)}...${hash.slice(-suffixLength)}`
}

export function getTransferSideLabel(
  value: boolean | undefined,
  truthy: string,
  falsy: string,
) {
  if (value === undefined) {
    return '-'
  }

  return value ? truthy : falsy
}

export function formatTokenAmount(
  symbol: string | undefined,
  amount: number | undefined,
) {
  if (symbol === undefined) {
    return undefined
  }

  if (amount === undefined) {
    return symbol
  }

  return `${amount} ${symbol}`
}

export function getTokenAddressDisplay(address: string | undefined) {
  if (address === undefined) {
    return '-'
  }
  if (address === Address32.NATIVE) {
    return 'native'
  }
  if (address === Address32.ZERO) {
    return '0x0'
  }

  return Address32.cropToEthereumAddress(Address32(address))
}

interface AddTokenLinkOptions {
  address: string | undefined
  chain: string | undefined
  otherSideAbstractTokenId: string | undefined
}

export function getAddTokenLinkOptions(options: AddTokenLinkOptions): {
  href: string
  label: string
} | null {
  if (!options.address || !options.chain) {
    return null
  }
  if (
    options.address === Address32.NATIVE ||
    options.address === Address32.ZERO
  ) {
    return null
  }

  const ethAddress = Address32.cropToEthereumAddress(Address32(options.address))
  const params = new URLSearchParams({
    tab: 'deployed',
    chain: options.chain,
    address: ethAddress,
  })

  if (options.otherSideAbstractTokenId) {
    params.set('abstractTokenId', options.otherSideAbstractTokenId)
  }

  return {
    href: `https://tokens.l2beat.com/tokens/new?${params.toString()}`,
    label: options.otherSideAbstractTokenId
      ? 'add (same abstract)'
      : 'add token',
  }
}
