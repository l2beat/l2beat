import type {
  ResolvedCropEvaluation,
  ResolvedCrops,
} from '@l2beat/config/build/crops/canonicalCrops'
import { CustomLinkIcon } from '~/icons/Outlink'
import {
  CropNote,
  CropPlantBadge,
  CropSection,
  getCropStatusText,
} from '~/pages/garden/components/CropBadge'
import { CROP_COLUMNS } from '~/pages/garden/crops'
import { GARDEN_ANIMATIONS_CSS } from '~/pages/garden/gardenCss'
import { GARDEN_PATH } from '~/pages/garden/submit/links'
import { cn } from '~/utils/cn'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface GardenCropsSectionProps extends ProjectSectionProps {
  crops: ResolvedCrops
  /** Whether the review clears the bar for the garden - see `qualifiesForGarden`. */
  inGarden: boolean
}

/**
 * The project's CROPS review, shown when it has been through one. The reasoning
 * is laid out in full rather than hidden behind the plant tooltips the garden
 * table uses: on a project page the reader came for the detail, and a hover
 * target is a poor place to keep it.
 */
export function GardenCropsSection({
  crops,
  inGarden,
  ...sectionProps
}: GardenCropsSectionProps) {
  return (
    <ProjectSection
      {...sectionProps}
      // The garden's own green marks a protocol that is actually in the
      // garden. A protocol that has been reviewed and did not make it gets
      // the plain section styling: the green is the badge, not the branding,
      // and colouring a miss with it reads as a pass at a glance.
      className={
        inGarden
          ? 'border border-[#cfe3c0] bg-[#f2f9ec] dark:border-[#2c3a22] dark:bg-[#161f0e]'
          : undefined
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
      {/* The plants animate on the garden pages, which inject these globally. */}
      <style>{GARDEN_ANIMATIONS_CSS}</style>
      <p
        className={cn(
          'font-medium text-paragraph-14',
          inGarden ? 'text-[#4f7a3e] dark:text-[#8fbc76]' : 'text-secondary',
        )}
      >
        {inGarden
          ? 'The protocol makes it to the CROPS garden!'
          : "The protocol doesn't make it to the CROPS garden yet."}
      </p>
      {/* Four crops, so a 2x2 tiling once there is room for it: each card is
          then about half the section wide, which is what makes the crops read
          as widgets rather than as rows of a list. */}
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

/**
 * One crop as a widget: the plant and what it is called across the top, then
 * everything the evaluation rests on underneath. A card is only half the
 * section wide, so the findings stay a single column instead of splitting
 * good/missing side by side. The bullets are the same components the garden
 * tooltip uses, so the two readings of a crop cannot drift apart.
 */
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
  /** Whether the section around the card is the garden green - see above. */
  onGreen: boolean
}) {
  return (
    // A card has to sit off whatever the section is: the primary surface
    // reads as a card on the green, and would be invisible on itself. The
    // transparent plant knocks its own interior out in the colour behind it,
    // so a card off the primary surface also has to name its own.
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
      {/* The standing caveat sits with the crop it qualifies, above the
          findings rather than among them - it is not a finding about this
          protocol, and it does not belong in a list of them. */}
      <CropNote note={note} className="mt-2.5 text-paragraph-12 leading-snug" />
      <div className="text-paragraph-13">
        <CropSection
          title="What's good"
          items={evaluation.points}
          license={evaluation.license}
        />
        <CropSection title="What is missing" items={evaluation.missing} />
        <CropSection
          title="Additional considerations"
          items={evaluation.additionalConsiderations}
        />
        <CropSection title="Not reviewed yet" items={evaluation.notReviewed} />
      </div>
    </div>
  )
}
