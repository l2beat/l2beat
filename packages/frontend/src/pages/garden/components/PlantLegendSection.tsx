import type { ProjectCropStatus, Sentiment } from '@l2beat/config'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { CropPlantSample } from './CropBadge'
import { SectionHeading } from './SectionHeading'

const PLANTS: {
  sentiment: Sentiment
  status: ProjectCropStatus
  title: string
  description: string
}[] = [
  {
    sentiment: 'good',
    status: 'reviewed',
    title: 'In bloom',
    description:
      'The crop clears the bar. Caveats may still be listed - none of them undermine the property.',
  },
  {
    sentiment: 'warning',
    status: 'reviewed',
    title: 'A bud',
    description:
      'The property mostly holds, but something real is missing: a gatekeeper, a short delay, a dependency the user cannot route around.',
  },
  {
    sentiment: 'bad',
    status: 'reviewed',
    title: 'Wilting',
    description:
      'The property does not hold in practice. The plant says which assumption breaks it.',
  },
  {
    sentiment: 'neutral',
    status: 'notReviewed',
    title: 'Nothing planted',
    description: 'The property is out of scope for this protocol.',
  },
  {
    sentiment: 'neutral',
    status: 'notReviewed',
    title: 'Not reviewed',
    description:
      'A dashed ring with no plant means the crop has not been reviewed at all.',
  },
]

export function PlantLegendSection() {
  return (
    <section className="mt-8 md:mt-12">
      <SectionHeading
        title="How to read a plant"
        description="The shape and colour tell you the state of the property."
        size="md"
      />
      <PrimaryCard className="md:p-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {PLANTS.map((plant, index) => (
            <article key={plant.title} className="flex flex-col gap-2">
              <CropPlantSample
                sentiment={plant.sentiment}
                status={plant.status}
                delay={index * 0.14}
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
