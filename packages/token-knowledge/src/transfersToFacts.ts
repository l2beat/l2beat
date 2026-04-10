import type { InteropTransferRecord } from '@l2beat/database'

export function transfersToFacts(transfers: InteropTransferRecord[]): string {
  const lines = transfers
    .filter((t) => t.srcTokenAddress && t.dstTokenAddress)
    .map((t) => {
      const bridge = t.bridgeType ?? 'unknown'
      return `transfer("${t.srcChain}","${t.srcTokenAddress}","${t.dstChain}","${t.dstTokenAddress}","${t.plugin}","${bridge}").`
    })
  if (lines.length === 0) return ''
  return lines.join('\n') + '\n'
}
