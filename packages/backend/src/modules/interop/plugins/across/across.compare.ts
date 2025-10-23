import { HttpClient } from '@l2beat/shared'
import type {
  InteropComparePlugin,
  InteropExternalItem,
} from '../../engine/compare/InteropCompareLoop'

export class AcrossComparePlugin implements InteropComparePlugin {
  name = 'across'

  async getExternalItems(): Promise<InteropExternalItem[]> {
    const http = new HttpClient()
    const response = await http.fetchRaw(
      'https://explorer.range.org/transactions?l=100&sn=eth,base,arb1,oeth&dn=arb1,base,oeth,eth&b=across',
      { timeout: 10_000 },
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
