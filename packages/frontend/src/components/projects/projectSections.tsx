import type { ComponentType } from 'react'
import { BridgesIcon } from '~/icons/pages/Bridges'
import { DefiIcon } from '~/icons/pages/Defi'
import { L2Icon } from '~/icons/pages/L2'
import { PrivacyIcon } from '~/icons/pages/Privacy'
import { ZkCatalogIcon } from '~/icons/pages/ZkCatalog'
import type { SvgIconProps } from '~/icons/SvgIcon'
import type { ProjectSection } from '~/server/features/projects/getProjectSectionLinks'

export const PROJECT_SECTIONS: Record<
  ProjectSection,
  { label: string; href: string; icon: ComponentType<SvgIconProps> }
> = {
  layer2s: { label: 'Layer 2s', href: '/layer2s/summary', icon: L2Icon },
  interop: { label: 'Interop', href: '/interop/summary', icon: BridgesIcon },
  zkCatalog: { label: 'ZK Catalog', href: '/zk-catalog', icon: ZkCatalogIcon },
  privacy: { label: 'Privacy', href: '/privacy', icon: PrivacyIcon },
  defi: { label: 'DeFi', href: '/defi', icon: DefiIcon },
}
