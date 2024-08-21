import { assert, type PriceConfigEntry } from '@l2beat/shared-pure'
import { createPriceId } from './createPriceId'

export function getEtherPriceConfig(priceConfigs: PriceConfigEntry[]) {
  const ethPrice = priceConfigs.find(
    (p) => p.chain === 'ethereum' && p.address === 'native',
  )
  assert(ethPrice, 'Eth priceId not found')
  const etherPriceConfig = { ...ethPrice, configId: createPriceId(ethPrice) }
  return etherPriceConfig
}
