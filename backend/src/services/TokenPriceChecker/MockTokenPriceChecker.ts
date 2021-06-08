import { SimpleDate } from '../SimpleDate'
import { ITokenPriceChecker } from './ITokenPriceChecker'

export class MockTokenPriceChecker implements ITokenPriceChecker {
  async getPrice(tokenSymbol: string, date: SimpleDate) {
    return {
      usd: 10,
      eth: 1,
    }
  }
}
