import { Layer2 } from '@l2beat/config'

import { DetailedDescriptionSectionProps } from '../../../../components/project/DetailedDescriptionSection'

export function getDetailedDescriptionSection(
  project: Layer2,
): DetailedDescriptionSectionProps {
  return {
    id: 'detailed-description',
    title: 'Detailed description',
    description: project.display.description,
    detailedDescription: project.display.detailedDescription,
  }
}
