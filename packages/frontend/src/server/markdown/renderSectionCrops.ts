import {
  type CropEntry,
  getCropStatusText,
  toCropEntries,
} from '~/components/garden/crops'
import type { GardenCropsSectionProps } from '~/components/projects/sections/GardenCropsSection'
import { GARDEN_PATH } from '~/pages/garden/paths'
import { bulletList, joinBlocks, link, subsection } from './markdown'
import type { SectionContext } from './renderProjectSection'

/** The garden verdict and each crop's findings; the plants themselves are only a picture of the same. */
export function renderGardenCropsSection(
  { crops, inGarden }: Pick<GardenCropsSectionProps, 'crops' | 'inGarden'>,
  level: number,
  context: SectionContext,
) {
  const entries = toCropEntries(crops)
  const inBloom = entries.filter(
    (entry) => entry.evaluation.sentiment === 'good',
  ).length
  return joinBlocks([
    `${inGarden ? 'Grows in the garden.' : 'Not in the garden yet.'} ${inBloom} of ${entries.length} in bloom.`,
    ...entries.map((entry) => renderCrop(entry, level)),
    `${link('See the whole garden', new URL(GARDEN_PATH, context.pageUrl).href)}.`,
  ])
}

function renderCrop({ definition, evaluation }: CropEntry, level: number) {
  const license = evaluation.license
    ? [`License: ${link(evaluation.license.name, evaluation.license.url)}`]
    : []
  return subsection(
    level,
    definition.label,
    joinBlocks([
      getCropStatusText(evaluation.status, evaluation.sentiment),
      findings("What's good", [...license, ...evaluation.points]),
      findings('What is missing', evaluation.missing),
      findings(
        'Additional considerations',
        evaluation.additionalConsiderations,
      ),
      findings('Not reviewed yet', evaluation.notReviewed),
      definition.note ?? '',
    ]),
  )
}

function findings(title: string, items: string[]) {
  return items.length > 0 ? joinBlocks([`**${title}**`, bulletList(items)]) : ''
}
