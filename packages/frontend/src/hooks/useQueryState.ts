import {
  type Dispatch,
  type SetStateAction,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { QueryParamCodec } from '~/utils/queryParamCodecs'
import { useEventCallback } from './useEventCallback'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'
import { useQueryParam } from './useQueryParam'

/**
 * `useState` kept in a URL search param, so the view survives a reload, Back
 * from another page and a shared link. The param is left out while the value
 * equals the default, and it replaces the history entry instead of adding
 * one, so Back still leaves the page.
 *
 * The server renders from the request URL (see `useQueryParam`), so the first
 * client render matches it.
 *
 * Pass a codec that is stable across renders (module scope or `useMemo`).
 */
export function useQueryState<T>(
  key: string,
  codec: QueryParamCodec<T>,
): [T, Dispatch<SetStateAction<T>>] {
  const defaultParam = useMemo(
    () => codec.serialize(codec.getDefault()),
    [codec],
  )
  const [param, setParam] = useQueryParam(key, defaultParam, {
    replaceState: true,
  })
  // Holds the value as it was set, so reselecting "1y" an hour later moves
  // the interval forward, and a calendar range isn't snapped to the preset
  // its param names. Read again only when the param changes elsewhere
  // (Back/Forward, another hook on the same key), or when the default it
  // stands for changes (e.g. a sort default that follows a metric).
  const [state, setState] = useState(() => read(codec, param))
  let current = state
  if (state.param !== param) {
    current = read(codec, param)
  } else if (state.codec !== codec) {
    current = state.isDefault
      ? { ...state, codec, value: codec.getDefault() }
      : { ...state, codec }
  }
  if (current !== state) setState(current)
  const value = current.value

  // Functional updates read the latest value, also when a handler calls
  // the setter twice before React re-renders.
  const latest = useRef(value)
  useIsomorphicLayoutEffect(() => {
    latest.current = value
  }, [value])

  const setValue = useEventCallback((action: SetStateAction<T>) => {
    const next = isUpdater(action) ? action(latest.current) : action
    latest.current = next
    const nextParam = codec.serialize(next)
    setState({
      param: nextParam,
      codec,
      value: next,
      isDefault: nextParam === defaultParam,
    })
    setParam(nextParam)
  })

  return [value, setValue]
}

interface Entry<T> {
  param: string
  codec: QueryParamCodec<T>
  value: T
  /** The param is missing, equals the default or doesn't parse. */
  isDefault: boolean
}

function read<T>(codec: QueryParamCodec<T>, param: string): Entry<T> {
  const parsed = codec.parse(param)
  const isDefault =
    parsed === undefined || param === codec.serialize(codec.getDefault())
  return {
    param,
    codec,
    value: parsed === undefined ? codec.getDefault() : parsed,
    isDefault,
  }
}

function isUpdater<T>(action: SetStateAction<T>): action is (prev: T) => T {
  return typeof action === 'function'
}
