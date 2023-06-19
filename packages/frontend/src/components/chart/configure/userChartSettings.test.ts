import { expect } from 'earl'

import { LocalStorageMock } from '../../../test/localStorageMock'
import { State } from './state/State'
import {
  getUserChartSettings,
  persistUserChartSettings,
} from './userChartSettings'

describe('UserChartSettings', () => {
  let originalLocalStorage: any

  beforeEach(() => {
    originalLocalStorage = global.localStorage
    global.localStorage = new LocalStorageMock()
  })
  afterEach(() => {
    global.localStorage = originalLocalStorage
  })

  describe(getUserChartSettings.name, () => {
    const pagePathname = 'scaling/tvl'

    describe('with no UserSettings', () => {
      it('returns empty settings', () => {
        expect(getUserChartSettings(pagePathname)).toEqual({})
      })
    })

    describe('with stored UserSettings', () => {
      const chartSettings = {
        isLogScale: true,
        days: 30,
        currency: 'usd',
      } as const

      beforeEach(() => {
        const controls: Pick<State['controls'], 'pagePathname' | 'isLogScale'> =
          {
            pagePathname,
            ...chartSettings,
          }
        persistUserChartSettings({ controls } as State)
      })

      describe('For the same pagePathname', () => {
        it('returns previous settings', () => {
          expect(getUserChartSettings(pagePathname)).toEqual(chartSettings)
        })
      })

      describe('For different pagePathname', () => {
        it('returns empty settings', () => {
          expect(getUserChartSettings('bridges/tvl')).toEqual({})
        })
      })
    })

    describe('with incomplete UserSettings being stored', () => {
      const chartSettings = {
        isLogScale: true,
      } as const

      beforeEach(() => {
        localStorage.setItem(
          `${pagePathname}chartSettings`,
          JSON.stringify(chartSettings),
        )
      })

      it('returns only stored settings', () => {
        expect(getUserChartSettings(pagePathname)).toEqual(chartSettings)
      })
    })
  })
})
