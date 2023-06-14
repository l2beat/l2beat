import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import {
  ActivityProjectData,
  activitySanityCheck,
  checkIfDelayedActivity,
  checkIfDelayedTvl,
  checkIfEmptyActivityCharts,
  checkIfEmptyTvlCharts,
  checkIfZeroTpsProjects,
  TvlProjectData,
  tvlSanityCheck,
} from './sanityCheck'

const today = UnixTime.now().toStartOf('day')

describe(tvlSanityCheck.name, () => {
  const allProjects: TvlProjectData[] = [
    [
      'projectA',
      {
        hourly: {
          data: [[today, 1, 3]],
          types: ['timestamp', 'string', 'string'],
        },
        daily: {
          data: [[today, 1, 3]],
          types: ['timestamp', 'string', 'string'],
        },
        sixHourly: {
          data: [[today, 1, 3]],
          types: ['timestamp', 'string', 'string'],
        },
      },
    ],
  ]

  describe(checkIfEmptyTvlCharts.name, () => {
    it('data fully synced', () => {
      expect(() => checkIfEmptyTvlCharts(allProjects)).not.toThrow()
    })

    it('throws if empty tvl chart', () => {
      const allProjects: TvlProjectData[] = [
        [
          'projectA',
          {
            hourly: {
              data: [],
              types: ['timestamp', 'string', 'string'],
            },
            daily: {
              data: [[today, 1, 3]],
              types: ['timestamp', 'string', 'string'],
            },
            sixHourly: {
              data: [[today, 1, 3]],
              types: ['timestamp', 'string', 'string'],
            },
          },
        ],
      ]

      expect(() => checkIfEmptyTvlCharts(allProjects)).toThrow(
        'The API has returned some empty tvl charts! projectA',
      )
    })
  })

  describe(checkIfDelayedTvl.name, () => {
    it('data fully synced', () => {
      expect(() => checkIfDelayedTvl(allProjects, today)).not.toThrow()
    })

    it('throws if delayed tvl', () => {
      const allProjects: TvlProjectData[] = [
        [
          'projectA',
          {
            hourly: {
              data: [[today.add(-5, 'hours'), 1, 3]],
              types: ['timestamp', 'string', 'string'],
            },
            daily: {
              data: [],
              types: ['timestamp', 'string', 'string'],
            },
            sixHourly: {
              data: [],
              types: ['timestamp', 'string', 'string'],
            },
          },
        ],
      ]

      expect(() => checkIfDelayedTvl(allProjects, today)).toThrow(
        /Some projects tvl data is delayed! projectA/,
      )
    })
  })
})

describe(activitySanityCheck.name, () => {
  const allProjects: ActivityProjectData[] = [
    [
      'projectA',
      [
        [today.add(-1, 'days'), 1],
        [today, 2],
      ],
    ],
    [
      'projectB',
      [
        [today.add(-1, 'days'), 3],
        [today, 4],
      ],
    ],
  ]

  describe(checkIfEmptyActivityCharts.name, () => {
    it('data fully synced', () => {
      expect(() => checkIfEmptyActivityCharts(allProjects)).not.toThrow()
    })

    it('throws if empty activity chart', () => {
      const allProjects: ActivityProjectData[] = [
        [
          'projectA',
          [
            [today.add(-1, 'days'), 1],
            [today, 2],
          ],
        ],
        ['projectB', []],
      ]

      expect(() => checkIfEmptyActivityCharts(allProjects)).toThrow(
        'The API has returned some empty activity charts! projectB',
      )
    })
  })

  describe(checkIfZeroTpsProjects.name, () => {
    const importantProjects = ['projectA', 'projectB']

    it('data fully synced', () => {
      expect(() =>
        checkIfZeroTpsProjects(allProjects, importantProjects),
      ).not.toThrow()
    })

    it('throws if zero tps important project exists', () => {
      const allProjects: ActivityProjectData[] = [
        [
          'projectA',
          [
            [today.add(-1, 'days'), 1],
            [today, 0],
          ],
        ],
        [
          'projectB',
          [
            [today.add(-1, 'days'), 3],
            [today, 4],
          ],
        ],
      ]

      expect(() =>
        checkIfZeroTpsProjects(allProjects, importantProjects),
      ).toThrow('Some projects have 0 TPS! projectA')
    })

    it('throws if some important project missing', () => {
      const allProjects: ActivityProjectData[] = [
        [
          'projectA',
          [
            [today.add(-1, 'days'), 1],
            [today, 1],
          ],
        ],
      ]

      expect(() =>
        checkIfZeroTpsProjects(allProjects, importantProjects),
      ).toThrow(
        'Some important projects missing in activity response! projectB',
      )
    })
  })

  describe(checkIfDelayedActivity.name, () => {
    it('data fully synced', () => {
      expect(() => checkIfDelayedActivity(allProjects, today)).not.toThrow()
    })

    it('throws if delayed activity', () => {
      const now = today.add(3, 'hours')
      const allProjects: ActivityProjectData[] = [
        ['projectA', [[today.add(-2, 'days'), 1]]],
      ]

      expect(() => checkIfDelayedActivity(allProjects, now)).toThrow(
        /Some projects activity data is delayed! projectA/,
      )
    })
  })
})
