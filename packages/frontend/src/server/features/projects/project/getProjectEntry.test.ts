import { expect } from 'earl'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ps } from '~/server/projects'
import { getSsrHelpers } from '~/trpc/server'
import { getScalingProjectEntry } from '../../scaling/project/getScalingProjectEntry'
import { getProjectEntry, getUnifiedProject } from './getProjectEntry'

describe(getProjectEntry.name, function () {
  this.timeout(0)

  const originalRandom = Math.random
  before(() => {
    // Mock data generators randomize values; pin them so both entry builds
    // produce identical structures.
    Math.random = () => 0.5
  })
  after(() => {
    Math.random = originalRandom
  })

  it('produces the same sections and side navigation as the scaling entry builder for every scaling project', async () => {
    // The same query getScalingProjectData uses to load a scaling project.
    const scalingProjects = await ps.getProjects({
      select: [
        'display',
        'statuses',
        'scalingInfo',
        'scalingRisks',
        'scalingStage',
        'scalingTechnology',
        'tvsInfo',
      ],
      optional: [
        'contracts',
        'permissions',
        'chainConfig',
        'scalingDa',
        'livenessInfo',
        'livenessConfig',
        'customDa',
        'archivedAt',
        'milestones',
        'trackedTxsConfig',
        'tvsConfig',
        'colors',
        'ecosystemColors',
        'discoveryInfo',
        'daTrackingConfig',
        'costsInfo',
        'activityConfig',
      ],
    })
    expect(scalingProjects.length).toBeGreaterThan(0)

    for (const scalingProject of scalingProjects) {
      const unifiedProject = await getUnifiedProject(scalingProject.slug)
      expect({ slug: scalingProject.slug, found: !!unifiedProject }).toEqual({
        slug: scalingProject.slug,
        found: true,
      })
      if (!unifiedProject) continue

      const oldEntry = await getScalingProjectEntry(
        scalingProject,
        getSsrHelpers(),
      )
      const newEntry = await getProjectEntry(unifiedProject, getSsrHelpers())

      expect({
        slug: scalingProject.slug,
        sections: newEntry?.sections.map((section) => ({
          id: section.props.id,
          type: section.type,
        })),
        navigation:
          newEntry && projectDetailsToNavigationSections(newEntry.sections),
      }).toEqual({
        slug: scalingProject.slug,
        sections: oldEntry.sections.map((section) => ({
          id: section.props.id,
          type: section.type,
        })),
        navigation: projectDetailsToNavigationSections(oldEntry.sections),
      })
    }
  })
})
