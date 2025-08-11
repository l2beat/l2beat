export function sumTokensValue<T extends { valueForProject: number }>(
  tokens: T[],
): number {
  return tokens.reduce((acc, token) => {
    return acc + token.valueForProject
  }, 0)
}
