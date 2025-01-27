import { createHash } from 'crypto'
import { type AmountConfigEntry, assertUnreachable } from '@l2beat/shared-pure'

export type AmountId = string

export function createAmountId(amountConfig: AmountConfigEntry): AmountId {
  const input = []

  input.push(amountConfig.chain)
  input.push(amountConfig.project.toString())
  input.push(amountConfig.type)
  // dataSource is not used in the ID calculation.
  // category is not used in the ID calculation.
  // sinceTimestamp is not used in the ID calculation.
  // untilTimestamp is not used in the ID calculation.
  // includeInTotal is not used in the ID calculation.
  // decimals is not used in the ID calculation.

  switch (amountConfig.type) {
    case 'totalSupply':
      input.push(amountConfig.address.toString())
      break
    case 'circulatingSupply':
      input.push(amountConfig.address.toString())
      input.push(amountConfig.coingeckoId.toString())
      break
    case 'escrow':
      input.push(amountConfig.address.toString())
      input.push(amountConfig.escrowAddress.toString())
      break
    case 'preminted':
      input.push(amountConfig.address.toString())
      input.push(amountConfig.coingeckoId.toString())
      input.push(amountConfig.escrowAddress.toString())
      break
    case 'aggLayerL2Token':
      input.push(amountConfig.l1Address.toString())
      input.push(amountConfig.originNetwork.toString())
      input.push(amountConfig.escrowAddress.toString())
      break
    case 'aggLayerNativeEtherPreminted':
      input.push(amountConfig.l2BridgeAddress.toString())
      input.push(amountConfig.premintedAmount.toString())
      input.push(amountConfig.escrowAddress.toString())
      break
    case 'aggLayerNativeEtherWrapped':
      input.push(amountConfig.wethAddress.toString())
      input.push(amountConfig.escrowAddress.toString())
      break
    case 'elasticChainL2Token':
      input.push(amountConfig.l1Address.toString())
      input.push(amountConfig.escrowAddress.toString())
      input.push(amountConfig.l2BridgeAddress.toString())
      break
    case 'elasticChainEther':
      input.push(amountConfig.address.toString())
      input.push(amountConfig.escrowAddress.toString())
      break
    default:
      assertUnreachable(amountConfig)
  }

  const hash = createHash('sha1').update(input.join('')).digest('hex')
  return hash.slice(0, 12)
}
