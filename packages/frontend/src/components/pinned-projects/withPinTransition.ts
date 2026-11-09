import { nameInView, withViewTransition } from '~/utils/viewTransition'
import { recordProjectVisit, type SavedProject } from './pinnedProjectsStore'

/**
 * Pins or unpins with the nav's project rows sliding to their new places,
 * e.g. from "Recently viewed" up to "Pinned", so the visitor sees where the
 * project went. The row of `lift`, the project that moves, travels above the
 * rows it passes.
 */
export function withPinTransition(update: () => void, lift?: string) {
  withViewTransition(
    'pin',
    () => {
      const rows = nameInView(
        '[data-pin-row]',
        (el) => el.dataset.pinRow,
        'pin-row',
      )
      for (const row of rows) {
        if (row.dataset.pinRow === lift) {
          row.style.setProperty('view-transition-class', 'pin-row pin-lift')
        }
      }
      return [
        ...rows,
        ...nameInView(
          '[data-pin-label]',
          (el) => el.dataset.pinLabel,
          'pin-label',
        ),
      ]
    },
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
  // Saved once, whichever comes first: the transition's update, or the tab
  // going hidden, when it is saved at once, as a hidden tab may be closed
  // before the transition's update runs.
  let saved = false
  const save = () => {
    if (saved) return
    saved = true
    document.removeEventListener('visibilitychange', onHide)
    recordProjectVisit(project)
  }
  const onHide = () => {
    if (document.hidden) save()
  }
  document.addEventListener('visibilitychange', onHide)
  whenSettled(() => {
    if (!saved) withPinTransition(save, project.href)
  })
}

/** Runs `run` on the first frame with no page transition and live lists. */
function whenSettled(run: () => void, framesLeft = 120) {
  const settled =
    !document.documentElement.hasAttribute('data-page-transition') &&
    document.querySelector('[data-role="pinned-projects"]')
  if (settled || framesLeft === 0) run()
  else requestAnimationFrame(() => whenSettled(run, framesLeft - 1))
}
