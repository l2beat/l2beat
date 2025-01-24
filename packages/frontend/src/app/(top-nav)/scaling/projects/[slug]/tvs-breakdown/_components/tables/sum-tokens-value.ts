export function sumTokensValue<T extends { usdValue: number }>(
  tokens: T[],
): number {
  return tokens.reduce((acc, token) => {
    return acc + token.usdValue
  }, 0)
}
