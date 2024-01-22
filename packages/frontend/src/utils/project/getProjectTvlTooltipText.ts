import { Layer2 } from '@l2beat/config'
import { AssetType } from '@l2beat/shared-pure'

import { languageJoin } from '../utils'

export function getProjectTvlTooltipText(config: Layer2['config']) {
  const hasCanonical = config.escrows.length > 0
  const hasExternal = config.tokenList?.some(
    (token) => token.type === AssetType('EBV'),
  )
  const hasNative = config.tokenList?.some(
    (token) => token.type === AssetType('NMV'),
  )

  if (!hasExternal && !hasNative) {
    return undefined
  }

  const types = []

  if (hasCanonical) {
    types.push('canonically bridged')
  }

  if (hasExternal) {
    types.push('externally bridged')
  }

  if (hasNative) {
    types.push('natively minted')
  }

  const joinedTypes = languageJoin(types)

  if (!joinedTypes) {
    return undefined
  }

  const sentence = `TVL includes ${joinedTypes} assets. Check "Value Locked" for more information.`

  return sentence
}
