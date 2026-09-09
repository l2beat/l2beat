import type {
  ResolvedCropEvaluation,
  ResolvedCrops,
} from '@l2beat/config/build/crops/canonicalCrops'
import { CustomLinkIcon } from '~/icons/Outlink'
import {
  CropFindings,
  CropNote,
  CropPlantBadge,
  getCropStatusText,
} from '~/pages/garden/components/CropBadge'
import { CROP_COLUMNS } from '~/pages/garden/crops'
import { GARDEN_PATH } from '~/pages/garden/submit/links'
import { cn } from '~/utils/cn'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface GardenCropsSectionProps extends ProjectSectionProps {
  crops: ResolvedCrops
  inGarden: boolean
}

export function GardenCropsSection({
  crops,
  inGarden,
  ...sectionProps
}: GardenCropsSectionProps) {
  return (
    <ProjectSection
      {...sectionProps}
      // The green marks a protocol that is in the garden; a miss stays plain.
      className={
        inGarden ? 'border border-garden-border bg-garden-tint' : undefined
      }
      headerAccessory={
        <a
          href={GARDEN_PATH}
          className="inline-flex items-center gap-1 font-medium text-label-value-14 text-link"
        >
          See the whole garden
          <CustomLinkIcon className="fill-current" />
        </a>
      }
    >
      <p
        className={cn(
          'font-medium text-paragraph-14',
          inGarden ? 'text-garden-accent' : 'text-secondary',
        )}
      >
        {inGarden
          ? 'The protocol makes it to the CROPS garden!'
          : "The protocol doesn't make it to the CROPS garden yet."}
      </p>
      <div className="mt-4 grid gap-2 md:grid-cols-2 md:gap-2.5">
        {CROP_COLUMNS.map((column, index) => (
          <CropCard
            key={column.key}
            letter={column.letter}
            label={column.label}
            note={column.note}
            evaluation={crops[column.key]}
            delay={index * 0.09}
            onGreen={inGarden}
          />
        ))}
      </div>
    </ProjectSection>
  )
}

function CropCard({
  letter,
  label,
  note,
  evaluation,
  delay,
  onGreen,
}: {
  letter: string
  label: string
  note: string | undefined
  evaluation: ResolvedCropEvaluation
  delay: number
  onGreen: boolean
}) {
  return (
    // Off the green the card sits on the secondary surface, and the transparent
    // plant needs to know that to knock its interior out - see `--crop-plant-bg`.
    <div
      className={cn(
        'flex flex-col rounded-lg p-3 md:p-3.5',
        onGreen
          ? 'bg-surface-primary'
          : 'bg-surface-secondary [--crop-plant-bg:var(--surface-secondary)]',
      )}
    >
      <div className="flex items-center gap-2.5">
        <CropPlantBadge
          letter={letter}
          label={label}
          status={evaluation.status}
          sentiment={evaluation.sentiment}
          delay={delay}
          compact
        />
        <div>
          <h3 className="font-bold text-paragraph-15 leading-tight">{label}</h3>
          <p className="text-paragraph-12 text-secondary">
            {getCropStatusText(evaluation.status, evaluation.sentiment)}
          </p>
        </div>
      </div>
      <CropNote note={note} className="mt-2.5 text-paragraph-12 leading-snug" />
      <div className="text-paragraph-13">
        <CropFindings evaluation={evaluation} />
      </div>
    </div>
  )
}
