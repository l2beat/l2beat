import { nameInView, withViewTransition } from '~/utils/viewTransition'
import { recordProjectVisit, type SavedProject } from './pinnedProjectsStore'

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

/**
 * Records the visit to a project's page. Its row in "Recently viewed",
 * drawn from the list as it was, rises to the top once the page has
 * arrived, which a second transition would cut short, and React has taken
 * the lists over from their prerendered copy. A row already first, or out
 * of view, just stays.
 */
export function recordVisit(project: SavedProject) {
  const row = [
    ...document.querySelectorAll<HTMLElement>('[data-pin-row]'),
  ].find((el) => el.dataset.pinRow === project.href && el.offsetWidth > 0)
  // A tab opened in the background runs no frames to wait on; a page
  // reached from the keyboard moves nothing.
  const rises =
    !document.hidden &&
    !document.documentElement.hasAttribute('data-keyboard-arrival') &&
    row?.previousElementSibling &&
    row.closest('[data-nav-group="Recently viewed"]')
  if (!rises) {
    recordProjectVisit(project)
    return
  }
  whenSettled(() => withPinTransition(() => recordProjectVisit(project)))
}

/**
 * Runs `run` on the first frame with no page transition and live lists, or
 * at once if the tab goes hidden first: it would run no more frames, and
 * the visit must still be saved.
 */
function whenSettled(run: () => void) {
  let done = false
  const go = () => {
    if (done) return
    done = true
    document.removeEventListener('visibilitychange', onHide)
    run()
  }
  const onHide = () => {
    if (document.hidden) go()
  }
  document.addEventListener('visibilitychange', onHide)
  const check = (framesLeft: number) => {
    if (done) return
    const settled =
      !document.documentElement.hasAttribute('data-page-transition') &&
      document.querySelector('[data-role="pinned-projects"]')
    if (settled || framesLeft === 0) go()
    else requestAnimationFrame(() => check(framesLeft - 1))
  }
  check(120)
}
