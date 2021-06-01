import { Config } from './Config'

interface Options {
  address: string
  sinceBlock: number
  tokens: string[]
}

export interface TVLResult {
  [token: string]: {
    // token units in wei
    [date: string]: string
  }
}

export async function queryTVL(
  config: Config,
  options: Options
): Promise<TVLResult> {
  return {}
}
