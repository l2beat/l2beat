import { AVAILABLE_CHAINS } from '../config/chains'
import { EXPLORER_URLS } from '../config/explorers'

export function splitChainPrefix(input: string): {
  chain: string | undefined
  address: string
} {
  const trimmed = input.trim()

  for (const chain of AVAILABLE_CHAINS) {
    const explorerUrl = EXPLORER_URLS[chain.shortName]
    if (explorerUrl !== undefined && trimmed.startsWith(`${explorerUrl}/`)) {
      const rest = trimmed.slice(explorerUrl.length + 1)
      return { chain: chain.shortName, address: cutAtUrlDelimiter(rest) }
    }
  }

  const colonIndex = trimmed.indexOf(':')
  if (colonIndex !== -1) {
    const prefix = trimmed.slice(0, colonIndex).toLowerCase()
    const chain = AVAILABLE_CHAINS.find(
      (c) => c.shortName === prefix || c.name === prefix,
    )
    if (chain !== undefined) {
      return { chain: chain.shortName, address: trimmed.slice(colonIndex + 1) }
    }
  }

  return { chain: undefined, address: trimmed }
}

function cutAtUrlDelimiter(value: string): string {
  let end = value.length
  for (const delimiter of ['/', '?', '#']) {
    const index = value.indexOf(delimiter)
    if (index !== -1 && index < end) {
      end = index
    }
  }
  return value.slice(0, end)
}
