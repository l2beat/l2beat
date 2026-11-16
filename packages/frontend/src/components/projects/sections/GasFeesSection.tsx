import { GasFeesEthereum } from '~/pages/gas-fees/components/GasFeesEthereum'
import type { GasFeesChain } from '~/pages/gas-fees/components/types'
import type { GasFeesUpgrade } from '~/server/features/gas-fees/getGasFeesUpgrades'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface GasFeesSectionProps extends ProjectSectionProps {
  id: 'gas-fees'
  ethereum: GasFeesChain
  upgrades: GasFeesUpgrade[]
}

export function GasFeesSection({
  ethereum,
  upgrades,
  ...sectionProps
}: GasFeesSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <GasFeesEthereum ethereum={ethereum} upgrades={upgrades} />
    </ProjectSection>
  )
}
