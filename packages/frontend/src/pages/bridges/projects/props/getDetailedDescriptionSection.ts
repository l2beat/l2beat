import { Bridge } from '@l2beat/config'

import { DetailedDescriptionSectionProps } from '../../../../components/project/DetailedDescriptionSection'

export function getDetailedDescriptionSection(
  bridge: Bridge,
): DetailedDescriptionSectionProps {
  return {
    id: 'detailed-description',
    title: 'Detailed description',
    description: bridge.display.description,
    detailedDescription: bridge.display.detailedDescription,
  }
}
