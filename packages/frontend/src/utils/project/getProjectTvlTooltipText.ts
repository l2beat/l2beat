import { Layer2 } from '@l2beat/config'
import { ValueType } from '@l2beat/shared-pure'

export function getProjectTvlTooltipText(config: Layer2['config']) {
  const hasCanonical = config.escrows.length > 0
  const hasExternal = config.tokenList?.some(
    (token) => token.type === ValueType.EBV,
  )
  const hasNative = config.tokenList?.some(
    (token) => token.type === ValueType.NMV,
  )
  if (
    (!hasCanonical && !hasExternal && !hasNative) ||
    (hasCanonical && !hasExternal && !hasNative)
  ) {
    return undefined
  }

  let sentence = 'TVL includes '

  if (hasCanonical) {
    sentence += 'canonically bridged'
    if (hasExternal && hasNative) {
      sentence += ', '
    } else if (!hasExternal && !hasNative) {
      sentence += ' '
    } else {
      sentence += ' and '
    }
  }

  if (hasExternal) {
    sentence += 'externally bridged'
    if (hasNative) {
      sentence += ' and '
    } else if (hasCanonical) {
      sentence += ' '
    }
  }

  if (hasNative) {
    sentence += 'natively minted '
  }

  sentence += 'assets. Check "Value Locked" for more information.'

  return sentence
}
