import { SimpleDate } from '../../model'

export interface ITokenPriceChecker {
  getPrice(
    tokenSymbol: string,
    date: SimpleDate
  ): Promise<{ usd: number; eth: number }>
}
