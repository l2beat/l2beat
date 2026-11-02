import type { ProjectCropStatus } from '@l2beat/config'
import { CropPlant } from '~/components/garden/CropPlant'
import {
  CROP_SENTIMENT_LABELS,
  CROP_STATUS_LABELS,
  type CropSentiment,
} from '~/components/garden/crops'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { SectionHeading } from './SectionHeading'

// Titles come from the tooltip labels, so the legend and the ratings use the same words.
const PLANTS: {
  sentiment: CropSentiment
  status: ProjectCropStatus
  title: string
  description: string
}[] = [
  {
    sentiment: 'good',
    status: 'reviewed',
    title: CROP_SENTIMENT_LABELS.good,
    description:
      'The property holds. Additional considerations may still be listed, but they do not undermine it.',
  },
  {
    sentiment: 'warning',
    status: 'reviewed',
    title: CROP_SENTIMENT_LABELS.warning,
    description:
      'The property mostly holds, but something is missing. The tooltip and the project page say what.',
  },
  {
    sentiment: 'bad',
    status: 'reviewed',
    title: CROP_SENTIMENT_LABELS.bad,
    description:
      'The property does not hold in practice. A project with a bad rating is not listed above.',
  },
  {
    sentiment: 'neutral',
    status: 'notReviewed',
    title: CROP_STATUS_LABELS.notReviewed,
    description: 'We have not reviewed the property yet.',
  },
  {
    sentiment: 'neutral',
    status: 'fullyTransparent',
    title: CROP_STATUS_LABELS.fullyTransparent,
    description:
      'Used for privacy only, when the protocol makes no privacy claims and everything it does is public.',
  },
]

export function PlantLegendSection() {
  return (
    <section className="mt-8 md:mt-12">
      <SectionHeading
        title="What the ratings mean"
        description="The shape and color of each icon show how a project does on a property."
        size="md"
      />
      <PrimaryCard className="max-md:mx-4 max-md:rounded-xl md:p-8">
        <div className="grid gap-6 sm:grid-cols-2 min-[1024px]:grid-cols-5">
          {PLANTS.map((plant, index) => (
            <article
              key={plant.title}
              className="flex items-start gap-4 sm:flex-col sm:gap-3"
            >
              {/* Pulled back so the soil lines up with the text: 12 px from the centred phone slot, 7 px from the bare plant. */}
              <CropPlant
                className="max-sm:-ml-3 sm:-ml-[7px] h-14 shrink-0 max-sm:w-14 max-sm:justify-center"
                sentiment={plant.sentiment}
                status={plant.status}
                delay={index * 0.05}
              />
              <div>
                <h3 className="font-bold text-heading-16">{plant.title}</h3>
                <p className="mt-2 text-pretty text-paragraph-14 text-secondary">
                  {plant.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </PrimaryCard>
    </section>
  )
}
