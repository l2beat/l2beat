import { useEffect, useRef } from 'react'

/** The first frame after a long pause (hidden tab) counts as a short one, so nothing jumps ahead */
export function useAnimationFrame(
  onFrame: (dt: number, now: number) => void,
  running: boolean,
) {
  const callback = useRef(onFrame)
  callback.current = onFrame
  useEffect(() => {
    if (!running) return
    let last = performance.now()
    let id = requestAnimationFrame(function tick(now) {
      const dt = Math.min((now - last) / 1000, 1 / 15)
      last = now
      callback.current(dt, now / 1000)
      id = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(id)
  }, [running])
}
