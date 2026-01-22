import type { InteropChain } from '@l2beat/config'

export type InteropChainWithIcon = Omit<InteropChain, 'iconSlug'> & {
  iconUrl: string
}
