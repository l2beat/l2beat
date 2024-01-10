import { Layer3 } from '@l2beat/config'

import { DetailedDescriptionSectionProps } from '../../../components/project/DetailedDescriptionSection'

export function getDetailedDescriptionSection(
  project: Layer3,
): DetailedDescriptionSectionProps {
  return {
    id: 'detailed-description',
    title: 'Detailed description',
    description: project.display.description,
    detailedDescription: project.display.detailedDescription,
  }
}
