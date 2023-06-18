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
    const chartId = 'scaling/tvl'

    describe('with no UserSettings', () => {
      it('return empty object', () => {
        expect(getUserChartSettings(chartId)).toEqual({})
      })
    })

    describe('with stored UserSettings', () => {
      const chartSettings = {
        isLogScale: true,
        days: 30,
        currency: 'usd',
      } as const

      beforeEach(() => {
        const controls: Pick<State['controls'], 'chartId' | 'isLogScale'> = {
          chartId,
          ...chartSettings,
        }
        persistUserChartSettings({ controls } as State)
      })

      describe('For the same chartId', () => {
        it('return returns previous settings', () => {
          expect(getUserChartSettings(chartId)).toEqual(chartSettings)
        })
      })

      describe('For different chartId', () => {
        it('return returns empty settings', () => {
          expect(getUserChartSettings('bridges/tvl')).toEqual({})
        })
      })
    })
  })
})
