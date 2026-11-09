import type { ProjectIconListItem } from '~/components/ProjectIconList'
import { PrivacyAssetsBreakdownTable } from '~/pages/privacy/project/components/assets-breakdown/PrivacyAssetsBreakdownTable'
import {
  PrivacySectionChainBadge,
  usePrivacyChain,
} from '~/pages/privacy/project/components/PrivacyChainSwitch'
import type { PrivacyAsset } from '~/server/features/privacy/types'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface PrivacyAssetsBreakdownSectionProps
  extends ProjectSectionProps {
  /** Totals across the tracked chains. */
  assets: PrivacyAsset[]
  showTvl: boolean
  /** Set when the tracked buckets span more than one chain. */
  chainAssets?: { chain: ProjectIconListItem; assets: PrivacyAsset[] }[]
}

export function PrivacyAssetsBreakdownSection({
  assets,
  showTvl,
  chainAssets,
  ...projectSectionProps
}: PrivacyAssetsBreakdownSectionProps) {
  const chains = chainAssets?.map((c) => c.chain)
  const chain = usePrivacyChain(chains)
  const shownAssets =
    chainAssets?.find((c) => c.chain.id === chain)?.assets ?? assets

  return (
    <ProjectSection
      {...projectSectionProps}
      headerAccessory={chains && <PrivacySectionChainBadge chains={chains} />}
    >
      <PrivacyAssetsBreakdownTable assets={shownAssets} showTvl={showTvl} />
    </ProjectSection>
  )
}
