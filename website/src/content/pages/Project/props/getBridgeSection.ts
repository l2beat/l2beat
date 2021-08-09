import { Project } from '@l2beat/config'
import { BridgesSectionProps } from '../view/BridgesSection'

export function getBridgeSection(project: Project): BridgesSectionProps {
  return {
    bridges: project.bridges.map((x) => ({
      address: x.address,
      tokens: x.tokens,
    })),
  }
}
