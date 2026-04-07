export interface TokenBalance {
  asset_address: string
  balance: string
  decimals: number
  symbol: string
  name: string
  usd_value: number
}

export interface BalanceResponse {
  contract_address: string
  balances: TokenBalance[]
  total_usd_value: number
  timestamp: string
  source: string
}

import type { DebankComplexProtocol } from './debank'

// Keep this type alias so we can customize it later without breaking the API
export type PositionResponse = DebankComplexProtocol[]

export interface TokenInfoResponse {
  id: string
  chain: string
  name: string
  symbol: string
  decimals: number
  price: number
  total_supply?: number
}

export interface AggregateBreakdownEntry {
  address: string
  name?: string
  usd_value: number
}

export interface AggregateResponse {
  contract_address: string
  total_usd_value: number
  contract_count: number
  breakdown: AggregateBreakdownEntry[]
  timestamp: string
  source: string
}

export interface ErrorResponse {
  error: string
  message: string
}
