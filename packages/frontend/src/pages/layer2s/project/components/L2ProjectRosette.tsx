import { useState } from 'react'
import { BigIndividualRosette } from '~/components/rosette/individual/BigIndividualRosette'
import { BigPizzaRosette } from '~/components/rosette/pizza/BigPizzaRosette'
import type { ProjectL2Entry } from '~/server/features/layer2s/project/getL2ProjectEntry'
import type { RosetteType } from './RosetteSelector'
import { RosetteSelector } from './RosetteSelector'

interface Props {
  project: ProjectL2Entry
  size?: 'small' | 'regular'
}

export function ProjectL2Rosette({ project, size }: Props) {
  const [rosetteType, setRosetteType] = useState<RosetteType>(
    project.rosette.stacked ? 'combined' : 'individual',
  )

  if (project.type === 'layer2') {
    return (
      <BigPizzaRosette
        className="my-auto max-lg:hidden"
        values={project.rosette.self}
        isUnderReview={project.underReviewStatus === 'config'}
        size={size}
      />
    )
  }

  const selector = (
    <RosetteSelector
      rosetteType={rosetteType}
      setRosetteType={setRosetteType}
      isDisabled={
        project.underReviewStatus === 'config' || !project.rosette.host
      }
    />
  )

  if (project.underReviewStatus === 'config') {
    return (
      <RosetteLayout selector={selector}>
        <BigPizzaRosette
          values={project.rosette.self}
          isUnderReview={project.underReviewStatus === 'config'}
          size={size}
        />
      </RosetteLayout>
    )
  }

  if (!project.rosette.host || !project.hostChainName) {
    return (
      <RosetteLayout>
        <BigPizzaRosette values={project.rosette.self} size={size} />
      </RosetteLayout>
    )
  }

  if (project.rosette.stacked) {
    return (
      <RosetteLayout selector={selector}>
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
      </RosetteLayout>
    )
  }

  return (
    <RosetteLayout selector={selector}>
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
        <BigPizzaRosette
          values={project.rosette.host}
          isUnderReview
          size={size}
        />
      )}
    </RosetteLayout>
  )
}

function RosetteLayout({
  selector,
  children,
}: {
  selector?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="my-auto flex flex-col gap-3 max-lg:hidden">
      {selector}
      {children}
    </div>
  )
}
