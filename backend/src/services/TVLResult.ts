import { BigNumber } from '@ethersproject/bignumber'
import { SimpleDate } from './SimpleDate'

export interface TVLResult {
  [token: string]: {
    date: SimpleDate
    balance: BigNumber
  }[]
}
