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
import { SproutIcon } from '~/pages/garden/components/SproutIcon'
import { CROP_COLUMNS } from '~/pages/garden/crops'
import { GARDEN_ANIMATIONS_CSS } from '~/pages/garden/gardenCss'
import { GARDEN_PATH } from '~/pages/garden/submit/links'

interface Props {
  crops: ResolvedCrops
  /** Whether the review clears the bar for the garden - see `qualifiesForGarden`. */
  inGarden: boolean
}

/**
 * Shown on a project page when the project has been through a CROPS review.
 * The reasoning is laid out in full rather than hidden behind the plant
 * tooltips the garden table uses: on a project page the reader came for the
 * detail, and a hover target is a poor place to keep it.
 */
export function GardenCropsNotice({ crops, inGarden }: Props) {
  return (
    <section className="mt-4 overflow-hidden rounded-xl border border-[#cfe3c0] bg-[#f2f9ec] max-md:mx-4 dark:border-[#2c3a22] dark:bg-[#161f0e]">
      {/* The plants animate on the garden pages, which inject these globally. */}
      <style>{GARDEN_ANIMATIONS_CSS}</style>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 p-3 md:px-5 md:pt-4">
        <div>
          <h2 className="flex items-center gap-2 font-bold text-heading-16">
            <SproutIcon className="text-[#4f7a3e] dark:text-[#8fbc76]" />
            CROPS
          </h2>
          <p className="mt-0.5 font-medium text-[#4f7a3e] text-paragraph-13 dark:text-[#8fbc76]">
            {inGarden
              ? 'The protocol makes it to the CROPS garden!'
              : "The protocol doesn't make it to the CROPS garden yet."}
          </p>
        </div>
        <a
          href={GARDEN_PATH}
          className="inline-flex items-center gap-1 font-medium text-label-value-14 text-link"
        >
          See the whole garden
          <CustomLinkIcon className="fill-current" />
        </a>
      </div>
      {/* Four crops, so a 2x2 tiling once there is room for it: each card is
          then about half the section wide, which is what makes the crops read
          as widgets rather than as rows of a list. */}
      <div className="grid gap-2 p-3 pt-0 md:grid-cols-2 md:gap-2.5 md:px-5 md:pb-5">
        {CROP_COLUMNS.map((column, index) => (
          <CropCard
            key={column.key}
            letter={column.letter}
            label={column.label}
            note={column.note}
            evaluation={crops[column.key]}
            delay={index * 0.09}
          />
        ))}
      </div>
    </section>
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
}: {
  letter: string
  label: string
  note: string | undefined
  evaluation: ResolvedCropEvaluation
  delay: number
}) {
  return (
    <div className="flex flex-col rounded-lg bg-surface-primary p-3 md:p-3.5">
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
