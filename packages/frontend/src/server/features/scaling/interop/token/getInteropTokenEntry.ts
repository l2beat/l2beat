import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'

export interface InteropTokenEntry {
  sections: ProjectDetailsSection[]
}

export function getInteropTokenEntry(
  tokenId: string,
  interopChains: InteropChainWithIcon[],
): InteropTokenEntry {
  return {
    sections: [
      {
        type: 'InteropTokenVolumeSection',
        props: {
          id: 'interop-volume',
          title: 'Volume and flows',
          tokenId,
          interopChains,
        },
      },
      {
        type: 'InteropTokenProtocolsSection',
        props: {
          id: 'interop-protocols',
          title: 'Top protocols',
        },
      },
      {
        type: 'InteropTokenTransfersSection',
        props: {
          id: 'interop-transfers',
          title: 'Transfers',
          tokenId,
          interopChains,
        },
      },
    ],
  }
}
