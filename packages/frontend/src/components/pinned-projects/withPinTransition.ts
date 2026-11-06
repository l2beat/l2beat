import { nameInView, withViewTransition } from '~/utils/viewTransition'

/**
 * Pins or unpins with the nav's project rows sliding to their new places,
 * e.g. from "Recently viewed" up to "Pinned", so the visitor sees where the
 * project went.
 */
export function withPinTransition(update: () => void) {
  withViewTransition(
    'pin',
    () => [
      ...nameInView('[data-pin-row]', (el) => el.dataset.pinRow, 'pin-row'),
      ...nameInView(
        '[data-pin-label]',
        (el) => el.dataset.pinLabel,
        'pin-label',
      ),
    ],
    update,
  )
}
