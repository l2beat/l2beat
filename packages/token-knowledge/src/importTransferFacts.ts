import type {
  Database,
  InteropTransferRecord,
  TokenFactInputRecord,
} from '@l2beat/database'

const FACT_NAME = 'transfer'

function transferKey(
  srcChain: string,
  srcAddr: string,
  dstChain: string,
  dstAddr: string,
  plugin: string,
  bridge: string,
): string {
  return `${srcChain}|${srcAddr}|${dstChain}|${dstAddr}|${plugin}|${bridge}`
}

function transferToArguments(t: InteropTransferRecord): string {
  const srcAddr = (t.srcTokenAddress as string).toLowerCase()
  const dstAddr = (t.dstTokenAddress as string).toLowerCase()
  const bridge = t.bridgeType ?? 'unknown'
  return `${t.srcChain},"${srcAddr}",${t.dstChain},"${dstAddr}",${t.plugin},${bridge}`
}

function transferToContext(t: InteropTransferRecord): {
  srcTxHash?: string
  dstTxHash?: string
} {
  return {
    srcTxHash: t.srcTxHash,
    dstTxHash: t.dstTxHash,
  }
}

export async function importTransferFacts(
  db: Database,
): Promise<{ imported: number; skipped: number }> {
  // Step 1: Load existing transfer facts into a dedup set
  const existing = await db.tokenFactInput.getByName(FACT_NAME)
  const seen = new Set<string>()
  for (const fact of existing) {
    // Format: srcChain,"srcAddr",dstChain,"dstAddr",plugin,bridge
    const [srcChain, srcAddr, dstChain, dstAddr, plugin, bridge] =
      fact.arguments.split(',').map((s: string) => s.replace(/"/g, ''))
    if (!srcChain || !srcAddr || !dstChain || !dstAddr || !plugin || !bridge) {
      throw new Error(`Invalid transfer fact arguments: ${fact.arguments}`)
    }
    seen.add(transferKey(srcChain, srcAddr, dstChain, dstAddr, plugin, bridge))
  }

  // Step 2: Fetch transfers from interop
  const transfers = await db.interopTransfer.getAll()

  // Step 3+4: Deduplicate and collect new facts
  const newFacts: Omit<TokenFactInputRecord, 'id'>[] = []
  let skipped = 0

  for (const t of transfers) {
    if (!t.srcTokenAddress || !t.dstTokenAddress) continue

    const bridge = t.bridgeType ?? 'unknown'
    const key = transferKey(
      t.srcChain,
      t.srcTokenAddress.toLowerCase(),
      t.dstChain,
      t.dstTokenAddress.toLowerCase(),
      t.plugin,
      bridge,
    )

    if (seen.has(key)) {
      skipped++
      continue
    }

    seen.add(key)
    newFacts.push({
      name: FACT_NAME,
      arguments: transferToArguments(t),
      context: transferToContext(t),
    })
  }

  // Step 5: Persist new facts
  await db.tokenFactInput.insertMany(newFacts)

  return { imported: newFacts.length, skipped }
}
