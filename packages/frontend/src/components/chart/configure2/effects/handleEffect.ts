import { Message } from '../messages'
import {
  Effect,
  FetchActivityEffect,
  FetchAggregateTvlEffect,
  FetchAlternativeTvlEffect,
  FetchTokenTvlEffect,
  LoaderTimeoutEffect,
} from './effects'

export function handleEffect(
  effect: Effect,
  dispatch: (message: Message) => void,
) {
  switch (effect.type) {
    case 'FetchAggregateTvl':
      return handleFetchAggregateTvl(effect, dispatch)
    case 'FetchAlternativeTvl':
      return handleFetchAlternativeTvl(effect, dispatch)
    case 'FetchTokenTvl':
      return handleFetchTokenTvl(effect, dispatch)
    case 'FetchActivity':
      return handleFetchActivity(effect, dispatch)
    case 'LoaderTimeout':
      return handleLoaderTimeout(effect, dispatch)
  }
}

function handleFetchAggregateTvl(
  { url, requestId }: FetchAggregateTvlEffect,
  dispatch: (message: Message) => void,
) {
  fetchThenDispatch(
    url,
    dispatch,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    (data) => ({ type: 'AggregateTvlLoaded', requestId, data }),
    () => ({ type: 'AggregateTvlFailed', requestId }),
  )
}

function handleFetchAlternativeTvl(
  { url, requestId }: FetchAlternativeTvlEffect,
  dispatch: (message: Message) => void,
) {
  fetchThenDispatch(
    url,
    dispatch,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    (data) => ({ type: 'AlternativeTvlLoaded', requestId, data }),
    () => ({ type: 'AlternativeTvlFailed', requestId }),
  )
}

function handleFetchTokenTvl(
  { url, requestId, token }: FetchTokenTvlEffect,
  dispatch: (message: Message) => void,
) {
  fetchThenDispatch(
    url,
    dispatch,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    (data) => ({ type: 'TokenTvlLoaded', requestId, token, data }),
    () => ({ type: 'TokenTvlFailed', requestId }),
  )
}

function handleFetchActivity(
  { url, requestId }: FetchActivityEffect,
  dispatch: (message: Message) => void,
) {
  fetchThenDispatch(
    url,
    dispatch,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    (data) => ({ type: 'ActivityLoaded', requestId, data }),
    () => ({ type: 'ActivityFailed', requestId }),
  )
}

function fetchThenDispatch(
  url: string,
  dispatch: (message: Message) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  successMessage: (data: any) => Message,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorMessage: (error: any) => Message,
) {
  fetch(url)
    .then((res) => res.json())
    .then(
      (data) => dispatch(successMessage(data)),
      (error) => {
        console.error(error)
        dispatch(errorMessage(error))
      },
    )
}

function handleLoaderTimeout(
  effect: LoaderTimeoutEffect,
  dispatch: (message: Message) => void,
) {
  setTimeout(
    () =>
      dispatch({
        type: 'LoaderTimedOut',
        requestId: effect.requestId,
      }),
    300,
  )
}
