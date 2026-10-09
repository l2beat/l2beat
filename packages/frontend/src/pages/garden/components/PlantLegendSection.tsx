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
      <PrimaryCard className="md:p-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {PLANTS.map((plant, index) => (
            <article key={plant.title} className="flex flex-col gap-2">
              <CropPlant
                className="h-10"
                sentiment={plant.sentiment}
                status={plant.status}
                delay={index * 0.05}
              />
              <h3 className="mt-1 font-bold text-heading-16">{plant.title}</h3>
              <p className="text-paragraph-13 text-secondary md:text-paragraph-14">
                {plant.description}
              </p>
            </article>
          ))}
        </div>
      </PrimaryCard>
    </section>
  )
}
