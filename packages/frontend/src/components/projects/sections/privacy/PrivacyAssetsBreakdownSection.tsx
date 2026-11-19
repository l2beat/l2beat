import { useState } from 'react'
import { PrivacyAssetsBreakdownTable } from '~/pages/privacy/project/components/assets-breakdown/PrivacyAssetsBreakdownTable'
import type { PrivacyAsset } from '~/server/features/privacy/types'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'
import {
  PrivacyChainFilter,
  type PrivacyChainFilterOption,
} from './PrivacyChainFilter'

export interface PrivacyAssetsBreakdownSectionProps
  extends ProjectSectionProps {
  assets: PrivacyAsset[]
  showTvl: boolean
  /** For a project deployed on several chains: each chain's own assets. */
  chains?: (PrivacyChainFilterOption & { assets: PrivacyAsset[] })[]
}

export function PrivacyAssetsBreakdownSection({
  assets,
  showTvl,
  chains,
  ...projectSectionProps
}: PrivacyAssetsBreakdownSectionProps) {
  const [chain, setChain] = useState<string>()
  const shown = chains?.find((c) => c.id === chain)
  return (
    <ProjectSection {...projectSectionProps}>
      {chains && (
        <PrivacyChainFilter
          name="privacyAssetsChain"
          chains={chains}
          value={chain}
          onChange={setChain}
          className="mb-4"
        />
      )}
      <PrivacyAssetsBreakdownTable
        assets={shown?.assets ?? assets}
        showTvl={showTvl}
      />
    </ProjectSection>
  )
}
