import { useRef, useState } from 'react'
import { useInterval } from '~/hooks/useInterval'
import { useIsOnScreen } from '~/hooks/useIsOnScreen'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'

/**
 * Steps through a figure's states while it is on screen. Hovering pauses it;
 * picking a state stops it for good, so it never overrides the reader.
 */
export function useFigureAutoplay(steps: number, intervalMs: number) {
  const ref = useRef<HTMLDivElement>(null)
  const onScreen = useIsOnScreen(ref)
  const reducedMotion = usePrefersReducedMotion()
  const [step, setStep] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [picked, setPicked] = useState(false)

  const playing = onScreen && !reducedMotion && !hovered && !picked
  useInterval(
    () => setStep((s) => (s + 1) % steps),
    playing ? intervalMs : null,
  )

  return {
    step,
    playing,
    /** On screen and motion allowed: whether ambient motion should run. */
    animate: onScreen && !reducedMotion,
    reducedMotion,
    /** The reader's choice; stops the autoplay. */
    pick: (next: number) => {
      setPicked(true)
      setStep(next)
    },
    containerProps: {
      ref,
      onPointerEnter: (e: React.PointerEvent) => {
        if (e.pointerType === 'mouse') setHovered(true)
      },
      onPointerLeave: () => setHovered(false),
    },
  }
}
