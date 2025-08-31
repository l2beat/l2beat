export class TokenService {
  calculateValue(
    chain: string,
    address: string,
    amount: bigint,
    timestamp: number,
  ): Promise<{ symbol: string; amount: number; valueUsd: number } | undefined> {
    return Promise.resolve({ symbol: 'TOKEN', amount: 100, valueUsd: 100_000 })
  }
}
