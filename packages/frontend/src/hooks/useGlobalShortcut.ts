import { useEventListener } from './useEventListener'

export function useGlobalShortcut(key: string, callback: () => void) {
  useEventListener('keydown', (event) => {
    if (
      event.key.toLowerCase() === key.toLowerCase() &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      !event.shiftKey
    ) {
      const isEnabled =
        [
          ...document.querySelectorAll('[data-radix-popper-content-wrapper]'),
          // The mobile nav stays mounted while closed, and inert.
          ...document.querySelectorAll('[role="dialog"]:not([inert])'),
        ].length === 0
      if (!isEnabled) return

      event.preventDefault()
      callback()
    }
  })
}
