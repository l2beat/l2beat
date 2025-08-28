export class TokenService {
  async calculateValue(
    chain: string,
    address: string,
    amount: bigint,
    timestamp: number,
  ): Promise<{ symbol: string; amount: number; valueUsd: number }> {}
}
