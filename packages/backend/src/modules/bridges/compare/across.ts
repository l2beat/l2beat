import type { BridgeComparePlugin, BridgeExternalItem } from './types'

export class AcrossComparePlugin implements BridgeComparePlugin {
  name = 'across'
  type = 'transfer' as const

  async getExternalItems(): Promise<BridgeExternalItem[]> {
    const response = await fetch(
      'https://explorer.range.org/transactions?max=100000000&b=across&sn=eth,base,arb1,oeth&dn=eth,arb1,base,oeth&tt=CROSSCHAIN&l=100',
    )
    const htmlContent = await response.text()

    const hashPairRegex =
      /\\"sender_tx_hash\\":\\"([^\\"]*)\\".+?\\"receiver_tx_hash\\":\\"([^\\"]*)\\"/g

    const matches = Array.from(htmlContent.matchAll(hashPairRegex))

    return matches
      .map((match) => {
        const senderHash = match[1]
        const receiverHash = match[2]

        if (senderHash.length === 66 && receiverHash.length === 66) {
          return {
            srcTxHash: senderHash,
            dstTxHash: receiverHash,
          }
        }
        return null
      })
      .filter((v) => v != null)
  }
}
