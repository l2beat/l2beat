import type {
  Database,
  InteropTransferRecord,
  TokenFactInputRecord,
} from '@l2beat/database'
import {
  type ClingoFact,
  type ClingoValue,
  parseClingoFact,
} from './clingo/parseClingoFact'

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
  return JSON.stringify([srcChain, srcAddr, dstChain, dstAddr, plugin, bridge])
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

function isToken(param: ClingoValue): param is ClingoFact {
  return (
    typeof param === 'object' &&
    param !== null &&
    !Array.isArray(param) &&
    'atom' in param &&
    param.atom === 't'
  )
}

function transferToArguments(t: InteropTransferRecord): string {
  const srcAddr = normalizeTokenAddress(t.srcTokenAddress as string)
  const dstAddr = normalizeTokenAddress(t.dstTokenAddress as string)
  const bridge = t.bridgeType ?? 'unknown'
  return `t("${t.srcChain}","${srcAddr}"),t("${t.dstChain}","${dstAddr}"),"${t.plugin}","${bridge}"`
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
    // Format: t("srcChain","srcAddr"),t("dstChain","dstAddr"),"plugin","bridge"
    const parsed = parseClingoFact(`${FACT_NAME}(${fact.arguments})`)
    const [src, dst, plugin, bridge] = parsed.params
    if (
      !isToken(src) ||
      !isToken(dst) ||
      typeof plugin !== 'string' ||
      typeof bridge !== 'string'
    ) {
      throw new Error(`Invalid transfer fact arguments: ${fact.arguments}`)
    }
    const [srcChain, srcAddr] = src.params as [string, string]
    const [dstChain, dstAddr] = dst.params as [string, string]
    seen.add(
      transferKey(
        srcChain,
        normalizeTokenAddress(srcAddr),
        dstChain,
        normalizeTokenAddress(dstAddr),
        plugin as string,
        bridge as string,
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
