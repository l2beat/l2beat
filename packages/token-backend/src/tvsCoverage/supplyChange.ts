import {
  type Database,
  INTEROP_TRANSFER_RETENTION,
  type InteropTransferSupplyChangeRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { type TokenRef, tokenKey } from './tokens'

// Keeps the start of the comparison inside the retention of raw interop
// transfers.
const RETENTION_MARGIN = UnixTime.HOUR

export interface TokenSupply extends TokenRef {
  amount: number
  decimals: number
}

export interface BridgeNetMinted {
  plugin: string
  amount: number
  unknownTransfers: number
}

export interface SupplyChange {
  since: number
  amount: number
  netMintedByBridge: BridgeNetMinted[]
  unexplained: number
  unexplainedUsd: number | undefined
}

// A transfer has a source and a destination side, each with its own flag.
export interface PluginFlagStats {
  plugin: string
  sides: number
  unknownShare: number
  unknownUsdShare: number
}

export interface NetMintedStats {
  since: number
  queryMs: number
  unknownFlags: PluginFlagStats[]
}

interface RawNetMinted {
  netMinted: bigint
  unknownTransfers: number
}

// What each plugin's transfers minted minus burned since `since`, per token.
export class NetMinted {
  private readonly bridges = new Map<string, Map<string, RawNetMinted>>()

  constructor(
    readonly since: UnixTime,
    transfers: InteropTransferSupplyChangeRecord[],
  ) {
    for (const transfer of transfers) {
      const key = tokenKey({
        chain: transfer.chain,
        address: transfer.tokenAddress,
      })
      const byPlugin = this.bridges.get(key) ?? new Map<string, RawNetMinted>()
      const bridge = byPlugin.get(transfer.plugin) ?? {
        netMinted: 0n,
        unknownTransfers: 0,
      }
      bridge.netMinted += transfer.netMinted
      bridge.unknownTransfers += transfer.unknownCount
      byPlugin.set(transfer.plugin, bridge)
      this.bridges.set(key, byPlugin)
    }
  }

  // Splits how the supply changed since `since` into what each bridge minted
  // and the rest.
  supplyChange(
    supply: TokenSupply,
    supplyAtSince: number,
    priceUsd: number | undefined,
  ): SupplyChange {
    const netMintedByBridge = Array.from(
      this.bridges.get(tokenKey(supply)) ?? [],
      ([plugin, bridge]): BridgeNetMinted => ({
        plugin,
        amount: Number(bridge.netMinted) / 10 ** supply.decimals,
        unknownTransfers: bridge.unknownTransfers,
      }),
    )
      .filter((bridge) => bridge.amount !== 0 || bridge.unknownTransfers > 0)
      .sort(
        (a, b) =>
          Math.abs(b.amount) - Math.abs(a.amount) ||
          a.plugin.localeCompare(b.plugin),
      )

    const amount = supply.amount - supplyAtSince
    const unexplained =
      amount - netMintedByBridge.reduce((sum, bridge) => sum + bridge.amount, 0)
    return {
      since: this.since,
      amount,
      netMintedByBridge,
      unexplained,
      unexplainedUsd:
        priceUsd === undefined ? undefined : unexplained * priceUsd,
    }
  }
}

export async function loadNetMinted(
  db: Database,
  now: UnixTime,
): Promise<{ netMinted: NetMinted; stats: NetMintedStats }> {
  const since = UnixTime(now - INTEROP_TRANSFER_RETENTION + RETENTION_MARGIN)
  const queryStartedAt = Date.now()
  const transfers = await db.interopTransfer.getSupplyChangesSince(since)
  return {
    netMinted: new NetMinted(since, transfers),
    stats: {
      since,
      queryMs: Date.now() - queryStartedAt,
      unknownFlags: getUnknownFlagStats(transfers),
    },
  }
}

function getUnknownFlagStats(
  transfers: InteropTransferSupplyChangeRecord[],
): PluginFlagStats[] {
  const byPlugin = new Map<
    string,
    { sides: number; unknown: number; usd: number; unknownUsd: number }
  >()
  for (const transfer of transfers) {
    const totals = byPlugin.get(transfer.plugin) ?? {
      sides: 0,
      unknown: 0,
      usd: 0,
      unknownUsd: 0,
    }
    totals.sides += transfer.transferCount
    totals.unknown += transfer.unknownCount
    totals.usd += transfer.valueUsd
    totals.unknownUsd += transfer.unknownValueUsd
    byPlugin.set(transfer.plugin, totals)
  }
  return Array.from(byPlugin)
    .filter(([, totals]) => totals.unknown > 0)
    .sort(([, a], [, b]) => b.unknownUsd - a.unknownUsd)
    .map(([plugin, totals]) => ({
      plugin,
      sides: totals.sides,
      unknownShare: totals.unknown / totals.sides,
      unknownUsdShare: totals.usd > 0 ? totals.unknownUsd / totals.usd : 0,
    }))
}
