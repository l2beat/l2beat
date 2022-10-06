import * as z from 'zod'

export type RouteConfig = z.infer<typeof RouteConfig>
export const RouteConfig = z.strictObject({
  address: z.string(),
  name: z.optional(z.string()),
  symbol: z.optional(z.string()),
  decimals: z.number(),
  anytoken: z.optional(
    z.strictObject({
      address: z.string(),
      name: z.optional(z.string()),
      symbol: z.optional(z.string()),
      decimals: z.number(),
      chainid: z.optional(z.string()),
      chainId: z.optional(z.string()),
    }),
  ),
  fromanytoken: z.strictObject({
    address: z.string(),
    name: z.optional(z.string()),
    symbol: z.optional(z.string()),
    decimals: z.number(),
    chainid: z.optional(z.string()),
    chainId: z.optional(z.string()),
  }),
  underlying: z.union([
    z.literal(false),
    z.strictObject({
      address: z.string(),
      name: z.optional(z.string()),
      symbol: z.optional(z.string()),
      decimals: z.number(),
      chainid: z.optional(z.string()),
      chainId: z.optional(z.string()),
    }),
  ]),
  type: z.string(),
  router: z.string(),
  tokenId: z.optional(z.string()),
  tokenid: z.optional(z.string()),
  routerAbi: z.optional(z.string()),
  routerABI: z.optional(z.string()),
  isLiquidity: z.boolean(),
  isApprove: z.boolean(),
  isFromLiquidity: z.boolean(),
  spender: z.string(),
  BigValueThreshold: z.union([z.number(), z.string()]),
  MaximumSwap: z.union([z.number(), z.string()]),
  MaximumSwapFee: z.union([z.number(), z.string()]),
  MinimumSwap: z.union([z.number(), z.string()]),
  MinimumSwapFee: z.union([z.number(), z.string()]),
  SwapFeeRatePerMillion: z.union([z.number(), z.string(), z.null()]),
  pairid: z.string(),
  DepositAddress: z.string(),
  BaseFeePercent: z.optional(z.union([z.number(), z.string()])),
  sortId: z.number(),
  tokenType: z.string(),
  chainId: z.string(),
})

export type DestinationConfig = z.infer<typeof DestinationConfig>
export const DestinationConfig = z.record(
  z.string(), // chain id,
  z.record(
    z.string(), // route hash
    RouteConfig,
  ),
)

export type TokenConfig = z.infer<typeof TokenConfig>
export const TokenConfig = z.strictObject({
  name: z.optional(z.string()),
  symbol: z.optional(z.string()),
  decimals: z.number(),
  address: z.string(),
  price: z.optional(z.union([z.number(), z.null()])),
  logoUrl: z.optional(z.string()),
  tokenType: z.string(),
  unit: z.optional(z.string()),
  chainId: z.string(),
  destChains: DestinationConfig,
})

export type ChainConfig = z.infer<typeof ChainConfig>
export const ChainConfig = z.record(
  z.string(), // token identifier
  TokenConfig,
)

export type MultichainConfig = z.infer<typeof MultichainConfig>
export const MultichainConfig = z.record(
  z.string(), // chain id
  ChainConfig,
)
