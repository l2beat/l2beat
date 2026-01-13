import { useEffect, useState } from 'react'
import { useEventListener } from './useEventListener'

type WindowSize = {
  width: number | undefined
  height: number | undefined
}

export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  })

  function onResize() {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  useEffect(onResize, [])
  useEventListener('resize', onResize)

  return size
}
