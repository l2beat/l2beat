import type { State } from '../State'

export function registerViewportContainer(
  _state: State,
  container: HTMLElement | null,
): Partial<State> {
  return {
    viewportContainer: container ?? undefined,
  }
}
