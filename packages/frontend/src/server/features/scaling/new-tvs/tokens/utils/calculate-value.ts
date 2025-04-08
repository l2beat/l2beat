const PRICE_PRECISION = 18
const USD_DECIMALS = 2n
export function calculateValue({
  amount,
  priceUsd,
  decimals,
}: {
  amount: bigint
  priceUsd: number
  decimals: number
}) {
  const bigintPriceUsd = getBigIntPrice(priceUsd, PRICE_PRECISION)
  const usdBalance = (amount * bigintPriceUsd) / 10n ** BigInt(decimals)
  const usdValue = usdBalance / 10n ** (18n - USD_DECIMALS)
  return usdValue
}

function getBigIntPrice(price: number, decimals: number): bigint {
  const priceString = price.toFixed(decimals)
  const [integerPart, fractionalPart = ''] = priceString.split('.')
  const priceWithoutDecimal = integerPart + fractionalPart.padEnd(decimals, '0')
  return BigInt(priceWithoutDecimal)
}
