import type { InteropTransferRecord } from '@l2beat/database'

export function transfersToFacts(transfers: InteropTransferRecord[]): string {
  const lines = transfers
    .filter((t) => t.srcTokenAddress && t.dstTokenAddress)
    .map((t) => {
      const srcAddr = (t.srcTokenAddress as string).toLowerCase()
      const dstAddr = (t.dstTokenAddress as string).toLowerCase()
      const bridge = t.bridgeType ?? 'unknown'
      return `transfer("${t.srcChain}","${srcAddr}","${t.dstChain}","${dstAddr}",${t.plugin},${bridge}).`
    })
  if (lines.length === 0) return ''
  return lines.join('\n') + '\n'
}
