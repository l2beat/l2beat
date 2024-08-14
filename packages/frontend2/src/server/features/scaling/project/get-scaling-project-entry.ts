import { type Layer2, type Layer3 } from '@l2beat/config'
import { getProjectLinks } from '~/utils/project/get-project-links'
import { getScalingRosetteValues } from './get-scaling-rosette-values'

type ScalingProject = Layer2 | Layer3

export type ScalingProjectEntry = ReturnType<typeof getScalingProjectEntry>

export function getScalingProjectEntry(project: ScalingProject) {
  return {
    type: project.type,
    name: project.display.name,
    slug: project.display.slug,
    description: project.display.description,
    isUnderReview: project.isUnderReview,
    category: project.display.category,
    purposes: project.display.purposes,
    stageConfig:
      project.type === 'layer2'
        ? project.stage
        : {
            stage: 'NotApplicable' as const,
          },
    header: getHeader(project),
  }
}

function getHeader(project: ScalingProject) {
  return {
    rosetteValues: getScalingRosetteValues(project.riskView),
    links: getProjectLinks(project.display.links),
  }
}
