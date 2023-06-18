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
      it('return empty object', () => {
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
        const controls: Pick<State['controls'], 'pagePathname' | 'isLogScale'> = {
          pagePathname,
          ...chartSettings,
        }
        persistUserChartSettings({ controls } as State)
      })

      describe('For the same pagePathname', () => {
        it('return returns previous settings', () => {
          expect(getUserChartSettings(pagePathname)).toEqual(chartSettings)
        })
      })

      describe('For different pagePathname', () => {
        it('return returns empty settings', () => {
          expect(getUserChartSettings('bridges/tvl')).toEqual({})
        })
      })
    })
  })
})
