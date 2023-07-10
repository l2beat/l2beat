import { expect } from 'earl'

import { LocalStorageMock } from '../../../test/localStorageMock'
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
    const pagePathname = 'scaling/summary'

    describe('with no persisted ChartSettings', () => {
      it('returns default ChartSettings', () => {
        expect(getUserChartSettings(pagePathname)).toEqual({
          isLogScale: false,
          days: 365,
          currency: 'usd',
          showEthereum: true,
        })
      })
    })

    describe('with persisted ChartSettings', () => {
      const chartSettings = {
        isLogScale: true,
        days: 30,
        currency: 'eth',
        showEthereum: false,
      } as const

      beforeEach(() => {
        persistUserChartSettings({
          controls: {
            pagePathname,
            ...chartSettings,
          },
        })
      })

      describe('For the same pagePathname', () => {
        it('returns persisted ChartSettings', () => {
          expect(getUserChartSettings(pagePathname)).toEqual(chartSettings)
        })
      })

      describe('For different pagePathname', () => {
        it('returns default ChartSettings', () => {
          expect(getUserChartSettings('bridges/summary')).toEqual({
            isLogScale: false,
            days: 365,
            currency: 'usd',
            showEthereum: true,
          })
        })
      })
    })

    describe('with incomplete ChartSettings being stored', () => {
      const chartSettings = {
        isLogScale: true,
      } as const

      beforeEach(() => {
        localStorage.setItem(
          `${pagePathname}chartSettings`,
          JSON.stringify(chartSettings),
        )
      })

      it('returns persisted ChartSettings supplemented with defaults', () => {
        expect(getUserChartSettings(pagePathname)).toEqual({
          ...chartSettings,
          days: 365,
          currency: 'usd',
          showEthereum: true,
        })
      })
    })
  })
})
