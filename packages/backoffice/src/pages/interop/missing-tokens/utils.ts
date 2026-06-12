import { Address32 } from '@l2beat/shared-pure'
import type { MissingTokenStatus } from './types'

export const MISSING_TOKEN_STATUSES: MissingTokenStatus[] = [
  'missing',
  'incomplete',
  'ready',
  'unsupported',
]

export function getMissingTokenAddressDisplay(address: string) {
  if (address === Address32.NATIVE) {
    return 'native'
  }

  if (address === Address32.ZERO) {
    return '0x0'
  }

  return Address32.cropToEthereumAddress(Address32(address))
}

export function getMissingTokenExplorerHref(options: {
  address: string
  explorerUrl: string | undefined
}) {
  if (
    !options.explorerUrl ||
    options.address === Address32.NATIVE ||
    options.address === Address32.ZERO
  ) {
    return undefined
  }

  const address = Address32.cropToEthereumAddress(Address32(options.address))
  return `${options.explorerUrl}/address/${address}`
}

export function getAddMissingTokenHref(options: {
  chain: string
  address: string
}) {
  if (options.address === Address32.ZERO) {
    return undefined
  }

  const address =
    options.address === Address32.NATIVE
      ? 'native'
      : Address32.cropToEthereumAddress(Address32(options.address))

  const params = new URLSearchParams({
    tab: 'deployed',
    chain: options.chain,
    address,
  })

  return `https://tokens.l2beat.com/tokens/new?${params.toString()}`
}

export function getMissingTokenTokenUiHref(options: {
  chain: string
  address: string
}) {
  if (options.address === Address32.ZERO) {
    return undefined
  }

  const address =
    options.address === Address32.NATIVE
      ? 'native'
      : Address32.cropToEthereumAddress(Address32(options.address))

  return `https://tokens.l2beat.com/tokens/${options.chain}/${address}`
}

export function getMissingTokenAction(options: {
  chain: string
  address: string
  tokenDbStatus: MissingTokenStatus
}) {
  switch (options.tokenDbStatus) {
    case 'missing': {
      const href = getAddMissingTokenHref(options)
      return href ? { href, label: 'Add token' } : undefined
    }
    case 'incomplete':
    case 'ready': {
      const href = getMissingTokenTokenUiHref(options)
      return href ? { href, label: 'Open token' } : undefined
    }
    case 'unsupported':
      return undefined
  }
}

export function getMissingTokenStatusMeta(status: MissingTokenStatus) {
  switch (status) {
    case 'missing':
      return {
        label: 'Missing',
        description:
          'No deployed token entry was found in TokenDB. Add the token first.',
        badgeVariant: 'destructive' as const,
        badgeClassName: undefined,
      }
    case 'incomplete':
      return {
        label: 'Incomplete',
        description:
          'The token exists in TokenDB, but its abstract token or CoinGecko ID is still missing.',
        badgeVariant: 'secondary' as const,
        badgeClassName:
          'bg-amber-100 text-amber-900 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-200',
      }
    case 'ready':
      return {
        label: 'Ready',
        description:
          'The TokenDB entry is complete enough to retry attribution by requeueing affected transfers.',
        badgeVariant: 'secondary' as const,
        badgeClassName:
          'bg-emerald-100 text-emerald-900 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-200',
      }
    case 'unsupported':
      return {
        label: 'Unsupported',
        description:
          'This chain and address cannot be resolved to a supported TokenDB deployed token, so there is no action or requeue path here.',
        badgeVariant: 'secondary' as const,
        badgeClassName: 'bg-muted text-muted-foreground hover:bg-muted',
      }
  }
}

export function getMissingTokenStatusLabel(status: MissingTokenStatus) {
  return getMissingTokenStatusMeta(status).label
}

export function getMissingTokenRowId(options: {
  chain: string
  tokenAddress: string
}) {
  return `${options.chain}:${options.tokenAddress}`
}
