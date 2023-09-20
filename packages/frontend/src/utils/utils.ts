import { EthereumAddress } from '@l2beat/shared-pure'
import MarkdownIt from 'markdown-it'

import { formatLargeNumber } from './formatLargeNumber'

export function getPercentageChange(now: number, then: number) {
  if (now === then || then === 0) {
    return '+0.00%'
  }
  return formatPercent(now / then - 1, true)
}

export function formatPercent(value: number, addPlus = false) {
  const result = (value * 100).toFixed(2) + '%'
  if (addPlus && !result.startsWith('-')) {
    return '+' + result
  }
  return result
}

export function formatUSD(value: number) {
  return `$${formatLargeNumber(value)}`
}

export function isZeroUSD(value: string) {
  return value === '$0.00'
}

export function renderInlineMarkdown(markdown: string) {
  const markdownProcessor = new MarkdownIt({ html: true })

  return markdownProcessor.renderInline(markdown)
}

export function languageJoin(items?: string[]) {
  if (!items || items.length === 0) {
    return undefined
  }
  if (items.length === 1) {
    return items[0]
  }
  items = [...items]
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const last = items.pop()!
  return `${items.join(', ')} and ${last}`
}

export function formatAddress(address: EthereumAddress) {
  return `${address.slice(0, 6)}...${address.slice(38, 42)}`
}
