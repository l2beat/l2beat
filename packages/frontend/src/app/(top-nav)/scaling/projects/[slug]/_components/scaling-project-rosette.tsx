'use client'
import { useState } from 'react'
import { BigIndividualRosette } from '~/components/rosette/individual/big-individual-rosette'
import { BigPizzaRosette } from '~/components/rosette/pizza/big-pizza-rosette'
import type { ScalingProjectEntry } from '~/server/features/scaling/project/get-scaling-project-entry'
import type { RosetteType } from './rosette-selector'
import { RosetteSelector } from './rosette-selector'

interface Props {
  project: ScalingProjectEntry
}

export function ScalingProjectRosette({ project }: Props) {
  const [rosetteType, setRosetteType] = useState<RosetteType>(
    project.rosette.stacked ? 'combined' : 'individual',
  )

  if (project.type === 'layer2') {
    return (
      <BigPizzaRosette
        className="mt-auto max-lg:hidden"
        values={project.rosette.self}
        isUnderReview={project.underReviewStatus === 'config'}
        isUpcoming={project.isUpcoming}
      />
    )
  }

  const Wrapper = ({
    children,
    hideSelector,
  }: { children: React.ReactNode; hideSelector?: boolean }) => (
    <div className="mt-auto flex flex-col gap-3 max-lg:hidden">
      {!hideSelector && (
        <RosetteSelector
          rosetteType={rosetteType}
          setRosetteType={setRosetteType}
          // Offset for labels
          className="mb-3"
          isDisabled={
            project.underReviewStatus === 'config' ||
            project.isUpcoming ||
            !project.rosette.host
          }
        />
      )}
      {children}
    </div>
  )

  // L3 - general under review/upcoming
  if (project.underReviewStatus === 'config' || project.isUpcoming) {
    return (
      <Wrapper>
        {/* Under review/upcoming thus no risks so we let the basic rosette fallback to question mark */}
        <BigPizzaRosette
          values={project.rosette.self}
          isUnderReview={project.underReviewStatus === 'config'}
          isUpcoming={project.isUpcoming}
        />
      </Wrapper>
    )
  }

  // L3 - no host chain (Multiple), should not happen
  if (!project.rosette.host || !project.hostChainName) {
    return (
      <Wrapper hideSelector>
        <BigPizzaRosette values={project.rosette.self} />
      </Wrapper>
    )
  }

  // L3 - has stacked risks
  if (project.rosette.stacked) {
    return (
      <Wrapper>
        {rosetteType === 'individual' ? (
          <BigIndividualRosette
            l2={{
              name: project.hostChainName,
              risks: project.rosette.host,
            }}
            l3={{
              name: project.name,
              risks: project.rosette.self,
            }}
          />
        ) : (
          <BigPizzaRosette values={project.rosette.stacked} />
        )}
      </Wrapper>
    )
  }

  // L3 - no stacked risks - so only switch and individual rosette is there
  return (
    <Wrapper>
      {rosetteType === 'individual' ? (
        <BigIndividualRosette
          l2={{
            name: project.hostChainName,
            risks: project.rosette.host,
          }}
          l3={{
            name: project.name,
            risks: project.rosette.self,
          }}
        />
      ) : (
        // Force under review for combined - values doesn't matter
        <BigPizzaRosette values={project.rosette.host} isUnderReview />
      )}
    </Wrapper>
  )
}
