import { type Dispatch, type SetStateAction, useMemo, useRef } from 'react'
import type { QueryParamCodec } from '~/utils/queryParamCodecs'
import { useEventCallback } from './useEventCallback'
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
  const value = useMemo(
    () => codec.parse(param) ?? codec.getDefault(),
    [codec, param],
  )

  // Functional updates read the latest value, also when a handler calls
  // the setter twice before React re-renders.
  const latest = useRef(value)
  latest.current = value

  const setValue = useEventCallback((action: SetStateAction<T>) => {
    const next = isUpdater(action) ? action(latest.current) : action
    latest.current = next
    setParam(codec.serialize(next))
  })

  return [value, setValue]
}

function isUpdater<T>(action: SetStateAction<T>): action is (prev: T) => T {
  return typeof action === 'function'
}
