import type { Milestone } from '@l2beat/config'

import { Effect } from '../effects/effects'
import { InitMessage } from '../messages'
import { State } from '../state/State'

export function updateInit(message: InitMessage): [State, Effect[]] {
  let fetchEffect: Effect
  if (message.initialView === 'tvl') {
    if (!message.aggregateTvlEndpoint) {
      throw new Error('Invalid init message, missing tvl endpoint!')
    }
    fetchEffect = {
      type: 'FetchAggregateTvl',
      url: message.aggregateTvlEndpoint,
      requestId: 1,
    }
  } else {
    if (!message.activityEndpoint) {
      throw new Error('Invalid init message, missing activity endpoint!')
    }
    fetchEffect = {
      type: 'FetchActivity',
      url: message.activityEndpoint,
      requestId: 1,
    }
  }

  return [
    {
      endpoints: {
        aggregateTvl: message.aggregateTvlEndpoint,
        alternativeTvl: message.alternativeTvlEndpoint,
        activity: message.activityEndpoint,
      },
      request: {
        lastId: 1,
        isFetching: true,
        showLoader: false,
      },
      data: {
        aggregateTvl: undefined,
        alternativeTvl: undefined,
        activity: undefined,
        tokenTvl: {},
        milestones: milestonesToRecord(message.milestones),
      },
      controls: {
        pagePathname: message.pagePathname,
        view: message.initialView,
        days: message.days,
        isLogScale: message.isLogScale,
        currency: message.currency,
        token: undefined,
        showEthereum: !!message.showEthereum,
        showAlternativeTvl: false,
        mouseX: undefined,
        showMoreTokens: false,
        labelCount: message.labelCount,
      },
      view: {
        dateRange: undefined,
        labels: undefined,
        showHoverAtIndex: undefined,
        showMilestoneHover: undefined,
        chart: undefined,
      },
    },
    [fetchEffect],
  ]
}

function milestonesToRecord(
  milestones: Milestone[],
): Record<number, Milestone> {
  const result: Record<number, Milestone> = {}
  for (const milestone of milestones) {
    const timestamp = Math.floor(new Date(milestone.date).getTime() / 1000)
    result[timestamp] = milestone
  }
  return result
}
