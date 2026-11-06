import { type AnimationEvent, useState } from 'react'

/**
 * Lets a dismissed card play its exit animation before `close` hides it;
 * with reduced motion it closes at once. Spread `onAnimationEnd` on the
 * element whose classes take `leaving`.
 */
export function useDismissal(close: () => void) {
  const [leaving, setLeaving] = useState(false)
  return {
    leaving,
    dismiss: () => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) close()
      else setLeaving(true)
    },
    onAnimationEnd: (event: AnimationEvent) => {
      if (leaving && event.target === event.currentTarget) close()
    },
  }
}
