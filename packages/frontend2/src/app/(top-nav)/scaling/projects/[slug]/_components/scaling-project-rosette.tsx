import { BigIndividualRosette } from '~/components/rosette/combined/big-individual-rosette'
import { type RosetteValueTuple } from '~/components/rosette/combined/individual-rosette-icon'
import { BigPizzaRosette } from '~/components/rosette/pizza/big-pizza-rosette'
import { type ScalingProjectEntry } from '~/server/features/scaling/project/get-scaling-project-entry'

interface Props {
  project: ScalingProjectEntry
}

export function ScalingProjectRosette({ project }: Props) {
  const isLayer2 = project.type === 'layer2'

  if (isLayer2) {
    return (
      <BigPizzaRosette
        className="mt-auto max-lg:hidden"
        values={project.header.rosetteValues}
        isUnderReview={project.isUnderReview}
        isUpcoming={project.isUpcoming}
      />
    )
  }

  const hostChainRisks = project.baseLayerRosetteValues as RosetteValueTuple
  const stackedChainRisks = project.stackedRosetteValues as
    | RosetteValueTuple
    | undefined

  // L3

  if (stackedChainRisks) {
    return (
      <BigIndividualRosette
        names={{
          inner: `${project.name} (L3)`,
          outer: `${project.hostChainName} (L2)`,
        }}
        className="mt-auto max-lg:hidden"
        innerValues={hostChainRisks}
        outerValues={stackedChainRisks}
        isUnderReview={project.isUnderReview}
        isUpcoming={project.isUpcoming}
      />
    )
  }

  return (
    <pre>{JSON.stringify({ hostChainRisks, stackedChainRisks }, null, 2)}</pre>
  )
}
