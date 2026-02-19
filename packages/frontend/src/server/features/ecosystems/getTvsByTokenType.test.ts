import type { Project } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type {
  ProjectSevenDayTvsBreakdown,
  SevenDayTvsBreakdown,
} from '../scaling/tvs/get7dTvsBreakdown'
import { getTvsByTokenType } from './getTvsByTokenType'

describe(getTvsByTokenType.name, () => {
  it('aggregates all asset categories across ecosystem projects', () => {
    const ecosystemProjects = [project('project-a'), project('project-b')]
    const tvs = mockObject<SevenDayTvsBreakdown>({
      total: 0,
      projects: {
        'project-a': projectTvs({
          ether: 10,
          stablecoin: 20,
          btc: 30,
          other: 40,
          rwaPublic: 50,
          rwaRestricted: 60,
        }),
        'project-b': projectTvs({
          ether: 1,
          stablecoin: 2,
          btc: 3,
          other: 4,
          rwaPublic: 5,
          rwaRestricted: 6,
        }),
      },
    })

    const result = getTvsByTokenType(ecosystemProjects, tvs)

    expect(result).toEqual({
      ether: 11,
      stablecoin: 22,
      btc: 33,
      other: 44,
      rwaPublic: 55,
      rwaRestricted: 66,
    })
  })

  it('skips projects without TVS data', () => {
    const ecosystemProjects = [project('project-a'), project('missing-project')]
    const tvs = mockObject<SevenDayTvsBreakdown>({
      total: 0,
      projects: {
        'project-a': projectTvs({
          ether: 10,
          stablecoin: 20,
          btc: 30,
          other: 40,
          rwaPublic: 50,
          rwaRestricted: 60,
        }),
      },
    })

    const result = getTvsByTokenType(ecosystemProjects, tvs)

    expect(result).toEqual({
      ether: 10,
      stablecoin: 20,
      btc: 30,
      other: 40,
      rwaPublic: 50,
      rwaRestricted: 60,
    })
  })
})

function project(id: string): Project {
  return mockObject<Project>({
    id: ProjectId(id),
  })
}

function projectTvs(
  values: Pick<
    ProjectSevenDayTvsBreakdown['breakdown'],
    'ether' | 'stablecoin' | 'btc' | 'other' | 'rwaPublic' | 'rwaRestricted'
  >,
): ProjectSevenDayTvsBreakdown {
  const breakdown = {
    total: 0,
    canonical: 0,
    external: 0,
    native: 0,
    ether: values.ether,
    stablecoin: values.stablecoin,
    btc: values.btc,
    other: values.other,
    rwaRestricted: values.rwaRestricted,
    rwaPublic: values.rwaPublic,
    associated: 0,
  }

  return {
    breakdown,
    breakdown7d: breakdown,
    change: {
      total: 0,
      canonical: 0,
      external: 0,
      native: 0,
      ether: 0,
      stablecoin: 0,
      btc: 0,
      other: 0,
      rwaRestricted: 0,
      rwaPublic: 0,
      associated: 0,
    },
  }
}
