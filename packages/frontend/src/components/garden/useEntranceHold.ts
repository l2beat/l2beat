import { useIsClient } from '~/hooks/useIsClient'

/**
 * The server paints the plants at frame zero and hydration then stalls the
 * main thread mid-entrance, which reads as a stutter. Holding every animation
 * under the caller until React has mounted lets the entrance run in one go.
 * The pause is !important because each plant sets its animation inline.
 */
export function useEntranceHold(): string | undefined {
  return useIsClient() ? undefined : '**:[animation-play-state:paused]!'
}
