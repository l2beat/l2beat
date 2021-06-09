import { SimpleDate } from '../SimpleDate'
import { ITokenPriceChecker } from './ITokenPriceChecker'

export class MockTokenPriceChecker implements ITokenPriceChecker {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPrice(tokenSymbol: string, date: SimpleDate) {
    return {
      usd: 10,
      eth: 1,
    }
  }
}
