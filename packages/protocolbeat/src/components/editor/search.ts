import { search } from '@codemirror/search'
import type { SelectionRange } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

// Like Monaco, a match off screen lands in the middle of the view, not on
// its edge, and a match on screen does not move the view.
export const centeredSearch = search({
  top: true,
  scrollToMatch: (range, view) =>
    EditorView.scrollIntoView(range, {
      y: isOnScreen(view, range) ? 'nearest' : 'center',
    }),
})

function isOnScreen(view: EditorView, range: SelectionRange): boolean {
  const start = view.coordsAtPos(range.from)
  const end = view.coordsAtPos(range.to)
  if (start === null || end === null) {
    return false
  }
  const screen = view.scrollDOM.getBoundingClientRect()
  return start.top >= screen.top && end.bottom <= screen.bottom
}
