import { useState } from 'react'
import { BigIndividualRosette } from '~/components/rosette/individual/BigIndividualRosette'
import { BigPizzaRosette } from '~/components/rosette/pizza/BigPizzaRosette'
import type { ProjectScalingEntry } from '~/server/features/scaling/project/getScalingProjectEntry'
import type { RosetteType } from './RosetteSelector'
import { RosetteSelector } from './RosetteSelector'

interface Props {
  project: ProjectScalingEntry
  size?: 'small' | 'regular'
}

export function ProjectScalingRosette({ project, size }: Props) {
  const [rosetteType, setRosetteType] = useState<RosetteType>(
    project.rosette.stacked ? 'combined' : 'individual',
  )

  if (project.type === 'layer2') {
    return (
      <BigPizzaRosette
        className="my-auto max-lg:hidden"
        values={project.rosette.self}
        isUnderReview={project.underReviewStatus === 'config'}
        isUpcoming={project.isUpcoming}
        size={size}
      />
    )
  }

  const Wrapper = ({
    children,
    hideSelector,
  }: {
    children: React.ReactNode
    hideSelector?: boolean
  }) => (
    <div className="my-auto flex flex-col gap-3 max-lg:hidden">
      {!hideSelector && (
        <RosetteSelector
          rosetteType={rosetteType}
          setRosetteType={setRosetteType}
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
          size={size}
        />
      </Wrapper>
    )
  }

  // L3 - no host chain (Multiple), should not happen
  if (!project.rosette.host || !project.hostChainName) {
    return (
      <Wrapper hideSelector>
        <BigPizzaRosette values={project.rosette.self} size={size} />
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
            size={size}
          />
        ) : (
          <BigPizzaRosette values={project.rosette.stacked} size={size} />
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
          size={size}
        />
      ) : (
        // Force under review for combined - values doesn't matter
        <BigPizzaRosette
          values={project.rosette.host}
          isUnderReview
          size={size}
        />
      )}
    </Wrapper>
  )
}
