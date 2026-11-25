import { useLayoutEffect, useRef, useState } from 'react'
import { chase } from './liveView'

type View = [number, number]

/**
 * What the charts show of a window moved through the buffer: on its way to
 * `target` each frame once another window is asked for, so they follow a
 * drag and ease to where a press or a key puts the window. There at once
 * when not animated
 */
export function useLiveChase({
  target,
  windowKey,
  animate,
  ahead,
}: {
  target: View | undefined
  /** The window asked for: another one is chased, the same one moving on is not */
  windowKey: string
  animate: boolean
  /** Seconds the target has moved on since it was drawn */
  ahead: () => number
}) {
  const [chasing, setChasing] = useState<{ key: string; view: View }>()
  const shown = useRef<{ key: string; view: View }>(undefined)
  const goal = useRef({ target, ahead })
  goal.current = { target, ahead }

  const before = shown.current
  let next = chasing
  if (!animate || !target) next = undefined
  else if (before && before.key !== windowKey && chasing?.key !== windowKey) {
    next = { key: windowKey, view: before.view }
  }
  if (next !== chasing) setChasing(next)
  const view = next?.view ?? target
  const moving = next !== undefined

  useLayoutEffect(() => {
    shown.current = view && { key: windowKey, view }
  })

  useLayoutEffect(() => {
    if (!moving) return
    let frame = 0
    let at = performance.now()
    const step = () => {
      const now = performance.now()
      const elapsed = now - at
      at = now
      setChasing((current) => {
        const { target, ahead } = goal.current
        if (!current || !target) return undefined
        const by = ahead()
        const view = chase(
          current.view,
          [target[0] + by, target[1] + by],
          elapsed,
        )
        return view && { ...current, view }
      })
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [moving])

  return { view, moving }
}
