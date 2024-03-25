export class PriceRepository {
  data = new Map<string, Map<number, number>>()

  async save(
    prices: { tokenSymbol: string; timestamp: number; price: number }[],
  ): Promise<void> {
    for (const { tokenSymbol, timestamp, price } of prices) {
      const tokenPrices =
        this.data.get(tokenSymbol) ?? new Map<number, number>()
      this.data.set(tokenSymbol, tokenPrices)

      tokenPrices.set(timestamp, price)
    }
    return Promise.resolve()
  }

  async deletePrices(
    tokenSymbol: string,
    fromTimestampInclusive: number,
    toTimestampInclusive: number,
  ): Promise<void> {
    const tokenPrices = this.data.get(tokenSymbol)
    if (!tokenPrices) {
      return
    }

    for (const [timestamp] of tokenPrices) {
      if (
        timestamp >= fromTimestampInclusive &&
        timestamp <= toTimestampInclusive
      ) {
        tokenPrices.delete(timestamp)
      }
    }

    return Promise.resolve()
  }
}
