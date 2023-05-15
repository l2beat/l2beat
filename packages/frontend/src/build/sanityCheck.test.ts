import { UnixTime } from '@l2beat/shared'
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
    it('happy path', () => {
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
    it('happy path', () => {
      expect(() => checkIfDelayedTvl(allProjects, today)).not.toThrow()
    })

    it('throws if delayed tvl', () => {
      const allProjects: TvlProjectData[] = [
        [
          'projectA',
          {
            hourly: {
              data: [[today.add(-3, 'days'), 1, 3]],
              types: ['timestamp', 'string', 'string'],
            },
            daily: {
              data: [[today.add(-3, 'days'), 1, 3]],
              types: ['timestamp', 'string', 'string'],
            },
            sixHourly: {
              data: [[today.add(-3, 'days'), 1, 3]],
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
    it('happy path', () => {
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

    it('happy path', () => {
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
    it('happy path', () => {
      expect(() => checkIfDelayedActivity(allProjects, today)).not.toThrow()
    })

    it('throws if delayed activity', () => {
      const allProjects: ActivityProjectData[] = [
        [
          'projectA',
          [
            [today.add(-3, 'days'), 1],
            [today.add(-2, 'days'), 2],
            [today.add(-1, 'days'), 3],
            [today, 4],
          ],
        ],
        ['projectB', [[today.add(-3, 'days'), 5]]],
      ]

      expect(() => checkIfDelayedActivity(allProjects, today)).toThrow(
        /Some projects activity data is delayed! projectB/,
      )
    })
  })
})
