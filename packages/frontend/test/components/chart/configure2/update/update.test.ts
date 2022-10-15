import { expect } from 'earljs'

import { calculateView } from '../../../../../src/components/chart/configure2/update/calculateView'
import { update } from '../../../../../src/components/chart/configure2/update/update'
import { EXAMPLE_AGGREGATE_TVL_DATA } from './data'
import { stateAfter } from './stateAfter'

describe(update.name, () => {
  describe('InitMessage', () => {
    it('handles a tvl init', () => {
      const [state, effects] = stateAfter([
        {
          type: 'Init',
          days: 7,
          initialView: 'tvl',
          aggregateTvlEndpoint: '/tvl.json',
          alternativeTvlEndpoint: '/alt-tvl.json',
        },
      ])

      expect(state.endpoints).toEqual({
        aggregateTvl: '/tvl.json',
        alternativeTvl: '/alt-tvl.json',
        activity: undefined,
      })

      expect(state.controls).toEqual({
        view: 'tvl',
        days: 7,
        isLogScale: false,
        currency: 'usd',
        token: undefined,
        showEthereum: false,
        showAlternativeTvl: false,
        mouseX: undefined,
      })

      expect(state.request).toEqual({
        isFetching: true,
        lastId: 0,
        showLoader: false,
      })

      expect(effects).toEqual([
        { type: 'FetchAggregateTvl', url: '/tvl.json', requestId: 1 },
      ])
    })

    it('handles an activity init', () => {
      const [state, effects] = stateAfter([
        {
          type: 'Init',
          days: 30,
          initialView: 'activity',
          activityEndpoint: '/activity.json',
          showEthereum: true,
        },
      ])

      expect(state.endpoints).toEqual({
        aggregateTvl: undefined,
        alternativeTvl: undefined,
        activity: '/activity.json',
      })

      expect(state.controls).toEqual({
        view: 'activity',
        days: 30,
        isLogScale: false,
        currency: 'usd',
        token: undefined,
        showEthereum: true,
        showAlternativeTvl: false,
        mouseX: undefined,
      })

      expect(state.request).toEqual({
        isFetching: true,
        lastId: 0,
        showLoader: false,
      })

      expect(effects).toEqual([
        { type: 'FetchActivity', url: '/activity.json', requestId: 1 },
      ])
    })

    it('handles a joint init', () => {
      const [state, effects] = stateAfter([
        {
          type: 'Init',
          days: 30,
          initialView: 'activity',
          aggregateTvlEndpoint: '/tvl.json',
          activityEndpoint: '/activity.json',
        },
      ])

      expect(state.endpoints).toEqual({
        aggregateTvl: '/tvl.json',
        alternativeTvl: undefined,
        activity: '/activity.json',
      })

      expect(state.controls).toEqual({
        view: 'activity',
        days: 30,
        isLogScale: false,
        currency: 'usd',
        token: undefined,
        showEthereum: false,
        showAlternativeTvl: false,
        mouseX: undefined,
      })

      expect(state.request).toEqual({
        isFetching: true,
        lastId: 0,
        showLoader: false,
      })

      expect(effects).toEqual([
        { type: 'FetchActivity', url: '/activity.json', requestId: 1 },
      ])
    })
  })

  describe('data fetching', () => {
    it('AggregateTvlLoaded', () => {
      const [state, effects] = stateAfter([
        {
          type: 'Init',
          initialView: 'tvl',
          days: 30,
          aggregateTvlEndpoint: '/tvl.json',
        },
        {
          type: 'AggregateTvlLoaded',
          requestId: 1,
          data: EXAMPLE_AGGREGATE_TVL_DATA,
        },
      ])

      expect(state.responses).toEqual({
        aggregateTvl: EXAMPLE_AGGREGATE_TVL_DATA,
        activity: undefined,
        alternativeTvl: undefined,
        tokenTvl: {},
      })

      expect(state.request).toEqual({
        isFetching: false,
        lastId: 1,
        showLoader: false,
      })

      expect(state.view).toEqual(
        calculateView(state.responses, state.controls)!,
      )

      expect(effects).toEqual([])
    })
  })
})
