import { BalancePerProject, PriceAtTimestamp } from '../reports/createReport'

export interface Asset {
  price: PriceAtTimestamp
  balance: BalancePerProject
  ethPrice: number
}
