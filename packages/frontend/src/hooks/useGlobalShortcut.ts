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
          ...document.querySelectorAll('[role="dialog"]'),
        ].length === 0
      if (!isEnabled) return

      event.preventDefault()
      callback()
    }
  })
}
