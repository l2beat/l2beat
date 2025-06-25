import { type Parser, type Validator, v as z } from '@l2beat/validate'

function nullish<T>(schema: Validator<T>): Validator<T | undefined | null>
// @ts-ignore We allow this error for simplicity of use
function nullish<T>(schema: Parser<T>): Parser<T | undefined | null>
function nullish<T>(schema: Validator<T>): Validator<T | undefined | null> {
  return z.union([z.undefined(), z.null(), schema])
}

export type RouteConfig = z.infer<typeof RouteConfig>
export const RouteConfig = z.strictObject({
  address: z.string(),
  name: nullish(z.string()),
  symbol: nullish(z.string()),
  decimals: nullish(z.number()),
  anytoken: nullish(
    z.strictObject({
      address: z.string(),
      name: nullish(z.string()),
      symbol: nullish(z.string()),
      decimals: z.number(),
      chainid: nullish(z.string()),
      chainId: nullish(z.string()),
    }),
  ),
  fromanytoken: z.strictObject({
    address: z.string(),
    name: nullish(z.string()),
    symbol: nullish(z.string()),
    decimals: z.number(),
    chainid: nullish(z.string()),
    chainId: nullish(z.string()),
  }),
  underlying: z.union([
    z.literal(false),
    z.strictObject({
      address: z.string(),
      name: nullish(z.string()),
      symbol: nullish(z.string()),
      decimals: nullish(z.number()),
      chainid: nullish(z.string()),
      chainId: nullish(z.string()),
    }),
  ]),
  type: z.string(),
  router: z.string(),
  tokenId: nullish(z.string()),
  tokenid: nullish(z.string()),
  routerAbi: nullish(z.string()),
  routerABI: nullish(z.string()),
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
  BaseFeePercent: nullish(z.union([z.number(), z.string()])),
  sortId: z.number(),
  tokenType: z.string(),
  chainId: z.string(),
  anycall: nullish(z.string()),
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
  name: nullish(z.string()),
  symbol: nullish(z.string()),
  decimals: z.number(),
  address: z.string(),
  price: nullish(z.union([z.number(), z.string(), z.null()])),
  logoUrl: nullish(z.string()),
  tokenType: z.string(),
  unit: nullish(z.string()),
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
