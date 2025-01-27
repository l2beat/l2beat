import { useState } from 'react'
import { useSearchParams } from 'react-router'

export function useSearchParamsState<T>(
  initializer: T,
  key: string,
  serialize: (arg: T) => string,
  deserialize: (arg: string) => T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialValue = searchParams.has(key)
    ? deserialize(searchParams.get(key) as string)
    : initializer

  const [state, setState] = useState<T>(initialValue)
  const setParamsAndState: React.Dispatch<React.SetStateAction<T>> = (arg) => {
    setState((prevState) => {
      const newState =
        typeof arg === 'function' ? (arg as (prev: T) => T)(prevState) : arg
      const value = serialize(newState)

      setSearchParams((prevParams) => {
        const newParams = new URLSearchParams(prevParams)
        newParams.set(key, value)
        return newParams
      })

      return newState
    })
  }

  return [state, setParamsAndState]
}
