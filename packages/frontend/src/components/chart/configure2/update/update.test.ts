import { expect } from 'earljs'
import { EMPTY_STATE } from '../state/empty'

import { update } from './update'

describe(update.name, () => {
  describe('InitMessage', () => {
    it('handles a tvl init', () => {
      const [state, effects] = update(EMPTY_STATE, {
        type: 'Init',
        days: 7,
        initialView: 'tvl',
        aggregateTvlEndpoint: '/tvl.json',
        activityEndpoint: undefined,
        showEthereum: false,
      })

      expect(state.endpoints).toEqual({
        aggregateTvl: '/tvl.json',
        activity: undefined,
      })

      expect(state.controls).toEqual({
        view: 'tvl',
        days: 7,
        isLogScale: false,
        currency: 'USD',
        token: undefined,
        showEthereum: false,
        mouseX: undefined,
      })

      expect(effects).toEqual([
        { type: 'FetchAggregateTvl', url: '/tvl.json', requestId: 1 },
        { type: 'LoaderTimeout', requestId: 1 },
      ])
    })

    it('handles an activity init', () => {
      const [state, effects] = update(EMPTY_STATE, {
        type: 'Init',
        days: 30,
        initialView: 'activity',
        aggregateTvlEndpoint: undefined,
        activityEndpoint: '/activity.json',
        showEthereum: true,
      })

      expect(state.endpoints).toEqual({
        aggregateTvl: undefined,
        activity: '/activity.json',
      })

      expect(state.controls).toEqual({
        view: 'activity',
        days: 30,
        isLogScale: false,
        currency: 'USD',
        token: undefined,
        showEthereum: true,
        mouseX: undefined,
      })

      expect(effects).toEqual([
        { type: 'FetchActivity', url: '/activity.json', requestId: 1 },
        { type: 'LoaderTimeout', requestId: 1 },
      ])
    })

    it('handles a joint init', () => {
      const [state, effects] = update(EMPTY_STATE, {
        type: 'Init',
        days: 30,
        initialView: 'activity',
        aggregateTvlEndpoint: '/tvl.json',
        activityEndpoint: '/activity.json',
        showEthereum: false,
      })

      expect(state.endpoints).toEqual({
        aggregateTvl: '/tvl.json',
        activity: '/activity.json',
      })

      expect(state.controls).toEqual({
        view: 'activity',
        days: 30,
        isLogScale: false,
        currency: 'USD',
        token: undefined,
        showEthereum: false,
        mouseX: undefined,
      })

      expect(effects).toEqual([
        { type: 'FetchActivity', url: '/activity.json', requestId: 1 },
        { type: 'LoaderTimeout', requestId: 1 },
      ])
    })
  })
})
