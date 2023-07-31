import { ZodSchema } from 'zod'

import { Message } from '../messages'
import {
  ActivityResponse,
  AggregateDetailedTvlChartToRemove,
  AggregateDetailedTvlResponse,
  AggregateTvlResponse,
  TokenTvlResponse,
} from '../state/State'
import {
  Effect,
  FetchActivityEffect,
  FetchAggregateTvlEffect,
  FetchAlternativeTvlEffect,
  FetchDetailedAggregateTvlEffect,
  FetchTokenTvlEffect,
} from './effects'

export function handleEffect(
  effect: Effect,
  dispatch: (message: Message) => void,
) {
  switch (effect.type) {
    case 'FetchAggregateTvl':
      return handleFetchAggregateTvl(effect, dispatch)
    case 'FetchDetailedAggregateTvl':
      return handleFetchDetailedAggregateTvl(effect, dispatch)
    case 'FetchAlternativeTvl':
      return handleFetchAlternativeTvl(effect, dispatch)
    case 'FetchTokenTvl':
      return handleFetchTokenTvl(effect, dispatch)
    case 'FetchActivity':
      return handleFetchActivity(effect, dispatch)
  }
}

function handleFetchAggregateTvl(
  { url, requestId }: FetchAggregateTvlEffect,
  dispatch: (message: Message) => void,
) {
  timeoutLoader(requestId, dispatch)
  fetchThenDispatch(
    url,
    dispatch,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    (data) => ({ type: 'AggregateTvlLoaded', requestId, data }),
    () => ({ type: 'AggregateTvlFailed', requestId }),
    AggregateTvlResponse,
  )
}

function handleFetchDetailedAggregateTvl(
  { url, requestId }: FetchDetailedAggregateTvlEffect,
  dispatch: (message: Message) => void,
) {
  const timestamps = [
    1681603200, 1681689600, 1681776000, 1681862400, 1681948800, 1682035200,
    1682121600, 1682208000, 1682294400, 1682380800, 1682467200, 1682553600,
    1682640000, 1682726400, 1682812800, 1682899200, 1682985600, 1683072000,
    1683158400, 1683244800, 1683331200, 1683417600, 1683504000, 1683590400,
    1683676800, 1683763200, 1683849600, 1683936000, 1684022400, 1684108800,
    1684195200, 1684281600, 1684368000, 1684454400, 1684540800, 1684627200,
    1684713600, 1684800000, 1684886400, 1684972800, 1685059200, 1685145600,
    1685232000, 1685318400, 1685404800, 1685491200, 1685577600, 1685664000,
    1685750400, 1685836800, 1685923200, 1686009600, 1686096000, 1686182400,
    1686268800, 1686355200, 1686441600, 1686528000, 1686614400, 1686700800,
    1686787200, 1686873600, 1686960000, 1687046400, 1687132800, 1687219200,
    1687305600, 1687392000, 1687478400, 1687564800, 1687651200, 1687737600,
    1687824000, 1687910400, 1687996800, 1688083200, 1688169600, 1688256000,
    1688342400, 1688428800, 1688515200, 1688601600, 1688688000, 1688774400,
    1688860800, 1688947200, 1689033600, 1689120000, 1689206400, 1689292800,
    1689379200, 1689465600, 1689552000, 1689638400, 1689724800, 1689811200,
    1689897600, 1689984000, 1690070400, 1690156800,
  ]

  if (url === 'ESLINT LEAVE ME ALONE') {
    return
  }

  const generateData = () => {
    const result: AggregateDetailedTvlChartToRemove = {
      types: [
        'timestamp',
        'valueUsd',
        'cbvUsd',
        'ebvUsd',
        'nmvUsd',
        'valueEth',
        'cbvEth',
        'ebvEth',
        'nmvEth',
      ],

      data: [],
    }
    for (let i = 0; i < 100; i++) {
      const cbv = 20 + Math.random() * 10
      const ebv = 20 + Math.random() * 10
      const nmv = 25 + Math.random() * 10
      const tvl = ebv + cbv + nmv

      result.data.push([timestamps[i], tvl, cbv, ebv, nmv, tvl, cbv, ebv, nmv])
    }

    return result
  }
  const data: AggregateDetailedTvlResponse = {
    hourly: generateData(),
    sixHourly: generateData(),
    daily: generateData(),
  }
  dispatch({ type: 'AggregateDetailedTvlLoaded', requestId, data })
}

function handleFetchAlternativeTvl(
  { url, requestId }: FetchAlternativeTvlEffect,
  dispatch: (message: Message) => void,
) {
  timeoutLoader(requestId, dispatch)
  fetchThenDispatch(
    url,
    dispatch,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    (data) => ({ type: 'AlternativeTvlLoaded', requestId, data }),
    () => ({ type: 'AlternativeTvlFailed', requestId }),
    AggregateTvlResponse,
  )
}

function handleFetchTokenTvl(
  { url, requestId, token }: FetchTokenTvlEffect,
  dispatch: (message: Message) => void,
) {
  timeoutLoader(requestId, dispatch)
  fetchThenDispatch(
    url,
    dispatch,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    (data) => ({ type: 'TokenTvlLoaded', requestId, token, data }),
    () => ({ type: 'TokenTvlFailed', requestId }),
    TokenTvlResponse,
  )
}

function handleFetchActivity(
  { url, requestId }: FetchActivityEffect,
  dispatch: (message: Message) => void,
) {
  timeoutLoader(requestId, dispatch)
  fetchThenDispatch(
    url,
    dispatch,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    (data) => ({ type: 'ActivityLoaded', requestId, data }),
    () => ({ type: 'ActivityFailed', requestId }),
    ActivityResponse,
  )
}

function fetchThenDispatch(
  url: string,
  dispatch: (message: Message) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  successMessage: (data: any) => Message,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorMessage: (error: any) => Message,
  schema: ZodSchema<AggregateTvlResponse | TokenTvlResponse | ActivityResponse>,
) {
  fetch(url)
    .then((res) => res.json())
    .then((json) => schema.parse(json))
    .then(
      (data) => dispatch(successMessage(data)),
      (error) => {
        console.error(error)
        dispatch(errorMessage(error))
      },
    )
}

function timeoutLoader(
  requestId: number,
  dispatch: (message: Message) => void,
) {
  setTimeout(() => dispatch({ type: 'LoaderTimedOut', requestId }), 300)
}
