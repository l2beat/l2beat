/**
 * `prepared.json`: everything about one address that can be gathered without
 * a plan. Produced by the `prepare` tool (a later milestone) from V1's
 * provider, `ProxyDetector`, `SourceCodeService` and flattener; consumed by
 * `baseline`, `worklist`, `author`, `execute` and `output`.
 *
 * It is the only input that touches RPC or a block explorer, so every later
 * tool is a pure function of files and can be replayed and diffed offline.
 */
import { v } from '@l2beat/validate'
import {
  ChainSpecificAddressSchema,
  ContractValueSchema,
} from './ContractValue'

export const PreparedProxy = v.object({
  type: v.string(),
  /** V1's `$…` values (`$implementation`, `$admin`, `$immutable`, …), already formatted. */
  values: v.record(v.string(), ContractValueSchema.optional()),
  /** Proxy plus implementations: the addresses whose sources make up the ABI. */
  addresses: v.array(ChainSpecificAddressSchema),
})

export const PreparedDeployment = v.object({
  deployer: ChainSpecificAddressSchema,
  transactionHash: v.string(),
  blockNumber: v.number(),
  timestamp: v.number(),
})

export const PreparedSource = v.object({
  address: ChainSpecificAddressSchema,
  name: v.string(),
  /** V1's flattening hash; missing for unverified code. */
  hash: v.string().optional(),
  solidityVersion: v.string(),
  /** ABI-encoded constructor arguments as the explorer returns them, without `0x`. */
  constructorArguments: v.string(),
  flattened: v.string(),
})

export const Prepared = v.object({
  /** Long chain name as V1's provider reports it, e.g. `ethereum`. */
  chain: v.string(),
  address: ChainSpecificAddressSchema,
  blockNumber: v.number(),
  timestamp: v.number(),
  isEOA: v.boolean(),
  name: v.string(),
  isVerified: v.boolean(),
  proxy: PreparedProxy,
  deployment: PreparedDeployment.optional(),
  /** Merged, deduplicated human-readable fragments across proxy and implementations. */
  abi: v.array(v.string()),
  /** Per-address ABI, keyed by chain-specific address string. */
  abis: v.record(v.string(), v.array(v.string())),
  sources: v.array(PreparedSource),
  implementationNames: v.record(v.string(), v.string()).optional(),
  /** V1's template-matching hash; the key under which plans are stored. */
  shapeHash: v.string().optional(),
  /**
   * Non-fatal problems met while preparing, such as a source that failed to
   * flatten. V1 logs these and moves on; here they travel with the file so a
   * later tool, or a reviewer, can see why a flattened source is empty.
   */
  warnings: v.array(v.string()),
})

export type Prepared = v.infer<typeof Prepared>
export type PreparedProxy = v.infer<typeof PreparedProxy>
export type PreparedDeployment = v.infer<typeof PreparedDeployment>
export type PreparedSource = v.infer<typeof PreparedSource>
