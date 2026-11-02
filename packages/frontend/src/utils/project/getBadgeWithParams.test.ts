import { ProjectService } from '@l2beat/config'
import { expect } from 'earl'
import { resolveBadgeRefs } from '~/components/projects/BadgeLookup'
import {
  getBadgeLookup,
  getBadgeRef,
  getBadgeWithParamsAndLink,
} from './getBadgeWithParams'

describe(getBadgeLookup.name, () => {
  // Tables now get badges as refs plus one lookup per page. Rendering stays
  // the same only if resolving the refs gives back exactly the badge each row
  // used to carry, so this compares the two paths over every real project,
  // which covers each badge action type, including project-specific links.
  it('resolves every project badge to the copy rows used to carry', async () => {
    const projects = await new ProjectService().getProjects({
      select: ['scalingInfo', 'statuses', 'display'],
    })
    const entries = projects.map((project) => ({
      badges: project.display.badges
        .map((badge) => getBadgeRef(badge, project))
        .filter((ref) => ref !== undefined),
    }))
    const lookup = getBadgeLookup(entries)

    projects.forEach((project, i) => {
      const expected = project.display.badges
        .map((badge) => getBadgeWithParamsAndLink(badge, project))
        .filter((badge) => badge !== undefined)
      expect(resolveBadgeRefs(entries[i]?.badges, lookup)).toEqual(expected)
    })
  })

  it('holds only the badges the given entries point at', async () => {
    const projects = await new ProjectService().getProjects({
      select: ['scalingInfo', 'statuses', 'display'],
    })
    const ref = projects
      .flatMap((project) =>
        project.display.badges.map((badge) => getBadgeRef(badge, project)),
      )
      .find((ref) => ref !== undefined)
    if (!ref) throw new Error('No project with a badge')

    expect(Object.keys(getBadgeLookup([{ badges: [ref] }]))).toEqual([ref.id])
  })

  // A page that forgets to send the lookup must fail its render, not drop badges.
  it('throws when a ref is missing from the lookup', () => {
    expect(() => resolveBadgeRefs([{ id: 'missing' }], {})).toThrow(
      'Badge missing from the page lookup',
    )
  })
})
