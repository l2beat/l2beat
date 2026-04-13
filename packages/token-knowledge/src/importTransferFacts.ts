import type {
  Database,
  InteropTransferRecord,
  TokenFactInputRecord,
} from '@l2beat/database'

const FACT_NAME = 'transfer'
const PADDED_EVM_ADDRESS_REGEX = /^0x([0-9a-f]{24})([0-9a-f]{40})$/i
const EVM_ADDRESS_REGEX = /^0x[0-9a-f]{40}$/i

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

function normalizeTokenAddress(address: string): string {
  if (address === 'native') {
    return address
  }

  if (EVM_ADDRESS_REGEX.test(address)) {
    return address.toLowerCase()
  }

  const match = PADDED_EVM_ADDRESS_REGEX.exec(address)
  if (!match) {
    throw new Error(`Unsupported token address format: ${address}`)
  }

  const prefix = match[1]
  const evmAddress = match[2]
  if (!prefix || !evmAddress) {
    throw new Error(`Invalid padded token address: ${address}`)
  }

  if (prefix !== '0'.repeat(prefix.length)) {
    throw new Error(
      `Cannot safely crop non-zero padded token address: ${address}`,
    )
  }

  return `0x${evmAddress.toLowerCase()}`
}

function transferToArguments(t: InteropTransferRecord): string {
  const srcAddr = normalizeTokenAddress(t.srcTokenAddress as string)
  const dstAddr = normalizeTokenAddress(t.dstTokenAddress as string)
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
    seen.add(
      transferKey(
        srcChain,
        normalizeTokenAddress(srcAddr),
        dstChain,
        normalizeTokenAddress(dstAddr),
        plugin,
        bridge,
      ),
    )
  }

  // Step 2: Fetch transfers from interop
  const transfers = await db.interopTransfer.getAll()

  // Step 3+4: Deduplicate and collect new facts
  const newFacts: Omit<TokenFactInputRecord, 'id'>[] = []
  let skipped = 0

  for (const t of transfers) {
    if (!t.srcTokenAddress || !t.dstTokenAddress) continue

    const srcAddr = normalizeTokenAddress(t.srcTokenAddress)
    const dstAddr = normalizeTokenAddress(t.dstTokenAddress)
    const bridge = t.bridgeType ?? 'unknown'
    const key = transferKey(
      t.srcChain,
      srcAddr,
      t.dstChain,
      dstAddr,
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
