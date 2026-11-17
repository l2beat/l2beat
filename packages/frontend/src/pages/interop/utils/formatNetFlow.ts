import { formatCurrency } from '@l2beat/shared-pure'

/** A signed dollar amount, "+$1.2M" or "−$3.4K", with a true minus. */
export function formatNetFlow(netFlow: number) {
  return `${netFlow > 0 ? '+' : ''}${formatCurrency(netFlow, 'usd').replace('-', '−')}`
}
