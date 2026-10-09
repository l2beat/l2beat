import {
  type CropEntry,
  getCropOssificationLines,
  getCropStatusText,
  toCropEntries,
} from '~/components/garden/crops'
import type { GardenCropsSectionProps } from '~/components/projects/sections/GardenCropsSection'
import { gardenVerdictText } from '~/components/projects/sections/sectionCopy'
import { GARDEN_PATH } from '~/pages/garden/paths'
import { bulletList, joinBlocks, link, subsection } from './markdown'

/** The garden verdict and each crop's findings; the plants themselves are only a picture of the same. */
export function renderGardenCropsSection(
  {
    crops,
    listing,
    ossification,
  }: Pick<GardenCropsSectionProps, 'crops' | 'listing' | 'ossification'>,
  level: number,
) {
  const entries = toCropEntries(crops, ossification)
  const goodCount = entries.filter(
    (entry) => entry.evaluation.sentiment === 'good',
  ).length
  return joinBlocks([
    `${gardenVerdictText(listing)} ${goodCount} of ${entries.length} rated good.`,
    ...entries.map((entry) => renderCrop(entry, level)),
    `${link('See The Infinite Garden', GARDEN_PATH)}.`,
  ])
}

function renderCrop(
  { definition, evaluation, ossification }: CropEntry,
  level: number,
) {
  const license = evaluation.license
    ? [`License: ${link(evaluation.license.name, evaluation.license.url)}`]
    : []
  return subsection(
    level,
    definition.label,
    joinBlocks([
      getCropStatusText(evaluation.status, evaluation.sentiment),
      renderFindings("What's good", [...license, ...evaluation.points]),
      renderFindings('What is missing', evaluation.missing),
      renderFindings(
        'Additional considerations',
        evaluation.additionalConsiderations,
      ),
      renderFindings('Not reviewed yet', evaluation.notReviewed),
      renderFindings(
        'Ossification',
        ossification ? getCropOssificationLines(ossification) : [],
      ),
      definition.note ?? '',
    ]),
  )
}

function renderFindings(title: string, items: string[]) {
  return items.length > 0 ? joinBlocks([`**${title}**`, bulletList(items)]) : ''
}
