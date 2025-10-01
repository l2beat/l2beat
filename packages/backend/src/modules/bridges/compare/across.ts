import type { BridgeComparePlugin, BridgeExternalItem } from './types'

export class AcrossComparePlugin implements BridgeComparePlugin {
  name = 'across'
  type = 'transfer' as const
  types = ['across.Swap']

  async getExternalItems(): Promise<BridgeExternalItem[]> {
    const response = await fetch(
      'https://explorer.range.org/transactions?max=100000000&b=across&sn=eth,base,arb1,oeth&dn=eth,arb1,base,oeth&tt=CROSSCHAIN&l=100',
    )
    const htmlContent = await response.text()

    const detailedPairRegex =
      /\\"sender_network\\":\\"([^\\"]*)\\".+?\\"sender_tx_hash\\":\\"([^\\"]*)\\".+?\\"sender_amount\\":([^,}]+).+?\\"sender_symbol\\":\\"([^\\"]*)\\".+?\\"receiver_network\\":\\"([^\\"]*)\\".+?\\"receiver_tx_hash\\":\\"([^\\"]*)\\".+?\\"receiver_amount\\":([^,}]+).+?\\"receiver_symbol\\":\\"([^\\"]*)\\"/g

    const matches = Array.from(htmlContent.matchAll(detailedPairRegex))

    return matches
      .map((match) => {
        const senderNetwork = match[1]
        const senderHash = match[2]
        const senderAmount = Number.parseFloat(match[3]) ?? 0
        const senderSymbol = match[4]
        const receiverNetwork = match[5]
        const receiverHash = match[6]
        const receiverAmount = Number.parseFloat(match[7]) ?? 0
        const receiverSymbol = match[8]

        if (
          !senderHash ||
          !receiverHash ||
          senderHash === '' ||
          receiverHash === ''
        ) {
          return null
        }

        return {
          srcChain: senderNetwork,
          srcTxHash: senderHash,
          srcSymbol: senderSymbol,
          srcAmount: senderAmount,
          dstChain: receiverNetwork,
          dstTxHash: receiverHash,
          dstSymbol: receiverSymbol,
          dstAmount: receiverAmount,
        }
      })
      .filter((v) => v != null)
  }
}
