import { v } from '@l2beat/validate'

// DeBank API documentation: https://docs.open.debank.com/
// Note: Using v.object instead of v.strictObject to allow extra fields from the API

// Token balance response schema
export const DebankTokenBalanceListResponse = v.array(
  v.object({
    id: v.string(),
    chain: v.string(),
    name: v.string(),
    symbol: v.string(),
    display_symbol: v.union([v.string(), v.null()]).optional(),
    optimized_symbol: v.union([v.string(), v.null()]).optional(),
    decimals: v.number(),
    logo_url: v.union([v.string(), v.null()]).optional(),
    protocol_id: v.string().optional(),
    price: v.number(),
    amount: v.number(),
    raw_amount: v.number().optional(),
  }),
)

// Complex protocol response schema
export const DebankComplexProtocolListResponse = v.array(
  v.object({
    id: v.string(),
    chain: v.string(),
    name: v.string(),
    site_url: v.string().optional(),
    logo_url: v.string().optional(),
    portfolio_item_list: v.array(
      v.object({
        stats: v.object({
          asset_usd_value: v.number(),
          debt_usd_value: v.number(),
          net_usd_value: v.number(),
        }),
        asset_token_list: v.array(
          v.object({
            id: v.string(),
            chain: v.string(),
            name: v.string(),
            symbol: v.string(),
            decimals: v.number(),
            amount: v.number(),
            price: v.number(),
          }),
        ),
        name: v.string().optional(),
      }),
    ),
  }),
)

// Single token info response schema
// DeBank API: GET /v1/token
export const DebankTokenInfoResponse = v.object({
  id: v.string(),
  chain: v.string(),
  name: v.string(),
  symbol: v.string(),
  decimals: v.number(),
  price: v.number(),
})

// Type exports
export type DebankTokenBalance = v.infer<
  typeof DebankTokenBalanceListResponse
>[0]
export type DebankComplexProtocol = v.infer<
  typeof DebankComplexProtocolListResponse
>[0]
export type DebankTokenInfo = v.infer<typeof DebankTokenInfoResponse>
