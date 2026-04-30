import { formatCurrency as formatCurrencyBase } from '~/utils/number-format/formatCurrency'
import { formatNumberWithCommas } from '~/utils/number-format/formatNumber'

export function formatCurrency(n: number | null | undefined): string {
  if (n == null) return '--'
  return formatCurrencyBase(n, 'usd')
}

export function formatNumber(n: number | null | undefined): string {
  if (n == null) return '--'
  return formatNumberWithCommas(Number(n))
}
