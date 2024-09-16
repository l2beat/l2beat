'use client'
import { useState } from 'react'
import { BigIndividualRosette } from '~/components/rosette/individual/big-individual-rosette'
import { toRosetteTuple } from '~/components/rosette/individual/to-rosette-tuple'
import { BigPizzaRosette } from '~/components/rosette/pizza/big-pizza-rosette'
import { type ScalingProjectEntry } from '~/server/features/scaling/project/get-scaling-project-entry'
import { RosetteSelector, type RosetteType } from './rosette-selector'

interface Props {
  project: ScalingProjectEntry
}

export function ScalingProjectRosette({ project }: Props) {
  const [rosetteType, setRosetteType] = useState<RosetteType>('individual')

  // Generic L2
  if (project.type === 'layer2') {
    return (
      <BigPizzaRosette
        className="mt-auto max-lg:hidden"
        values={project.header.rosetteValues}
        isUnderReview={project.isUnderReview}
        isUpcoming={project.isUpcoming}
      />
    )
  }

  const projectRisks = toRosetteTuple(project.header.rosetteValues)
  const hostChainRisks = toRosetteTuple(project.baseLayerRosetteValues)
  const stackedChainRisks = project.stackedRosetteValues
    ? toRosetteTuple(project.stackedRosetteValues)
    : undefined

  const WrapperWithSelector = ({ children }: { children: React.ReactNode }) => (
    <div className="mt-auto flex flex-col gap-3 max-lg:hidden">
      <RosetteSelector
        rosetteType={rosetteType}
        setRosetteType={setRosetteType}
        // Offset for labels
        className="-ml-7 mb-3"
        isDisabled={project.isUnderReview || project.isUpcoming}
      />
      {children}
    </div>
  )

  // L3 - general under review/upcoming
  if (project.isUnderReview || project.isUpcoming) {
    return (
      <WrapperWithSelector>
        {/* Under review/upcoming thus no risks so we let the basic rosette fallback to question mark */}
        <BigPizzaRosette
          values={project.header.rosetteValues}
          isUnderReview={project.isUnderReview}
          isUpcoming={project.isUpcoming}
        />
      </WrapperWithSelector>
    )
  }

  // L3 - has stacked risks
  if (stackedChainRisks) {
    return (
      <WrapperWithSelector>
        {rosetteType === 'individual' ? (
          <BigIndividualRosette
            l2={{
              name: project.hostChainName,
              risks: hostChainRisks,
            }}
            l3={{
              name: project.name,
              risks: stackedChainRisks,
            }}
          />
        ) : (
          <BigPizzaRosette values={stackedChainRisks} />
        )}
      </WrapperWithSelector>
    )
  }

  // L3 - no stacked risks - so only switch and individual rosette is there
  return (
    <WrapperWithSelector>
      {rosetteType === 'individual' ? (
        <BigIndividualRosette
          l2={{
            name: project.hostChainName,
            risks: hostChainRisks,
          }}
          l3={{
            name: project.name,
            risks: projectRisks,
          }}
        />
      ) : (
        // Force under review for combined - values doesn't matter
        <BigPizzaRosette values={hostChainRisks} isUnderReview />
      )}
    </WrapperWithSelector>
  )
}
