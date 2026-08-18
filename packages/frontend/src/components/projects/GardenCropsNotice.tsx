import type { ProjectCrops } from '@l2beat/config'
import { CustomLinkIcon } from '~/icons/Outlink'
import { CropBadge } from '~/pages/garden/components/CropBadge'
import { SproutIcon } from '~/pages/garden/components/SproutIcon'
import { CROP_COLUMNS } from '~/pages/garden/crops'
import { GARDEN_ANIMATIONS_CSS } from '~/pages/garden/gardenCss'
import { GARDEN_PATH } from '~/pages/garden/submit/links'

/**
 * Shown on a project page when the project is planted in The Infinite Garden.
 * The plants are the same component the garden table uses, tooltips included,
 * so hovering one here gives the same reasoning it does there.
 */
export function GardenCropsNotice({ crops }: { crops: ProjectCrops }) {
  return (
    <div className="mt-4 rounded-xl border border-[#cfe3c0] border-dashed bg-surface-primary/70 p-4 max-md:mx-4 md:px-6 md:py-5 dark:border-[#2c3a22]">
      {/* The plants animate on the garden pages, which inject these globally. */}
      <style>{GARDEN_ANIMATIONS_CSS}</style>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div>
          <p className="flex items-center gap-2 font-bold text-heading-16">
            <SproutIcon className="text-[#4f7a3e] dark:text-[#8fbc76]" />
            Growing in The Infinite Garden
          </p>
          <p className="mt-1 text-paragraph-13 text-secondary">
            Evaluated across CROPS: censorship resistance, open source, privacy
            and security. Hover a plant for the reasoning.
          </p>
        </div>
        <div className="flex gap-3.5">
          {CROP_COLUMNS.map((column, index) => (
            <CropBadge
              key={column.key}
              letter={column.letter}
              label={column.label}
              evaluation={crops[column.key]}
              delay={index * 0.09}
            />
          ))}
        </div>
      </div>
      <a
        href={GARDEN_PATH}
        className="mt-3 inline-flex items-center gap-1 font-medium text-label-value-14 text-link"
      >
        See the whole garden
        <CustomLinkIcon className="fill-current" />
      </a>
    </div>
  )
}
