export function tokenIsBefore(tokenA: string, tokenB: string) {
  return tokenA.toLowerCase() < tokenB.toLowerCase()
}

export function tokensInOrder(
  tokenA: string,
  tokenB: string,
): [string, string] {
  return tokenIsBefore(tokenA, tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
}
