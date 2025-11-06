import type { OtherIconType } from '~/icons/products/OtherIcon'
import { formatLink } from '~/utils/formatLink'

interface OtherDetails {
  platform?: OtherIconType
  text: string
}

export function parseOther(href: string): OtherDetails {
  const link = formatLink(href)

  if (link.startsWith('growthepie')) {
    return {
      platform: 'growthepie',
      text: 'growthepie',
    }
  }

  if (link.startsWith('rollup.codes')) {
    return {
      platform: 'rollup.codes',
      text: 'rollup.codes',
    }
  }

  return { text: link }
}
