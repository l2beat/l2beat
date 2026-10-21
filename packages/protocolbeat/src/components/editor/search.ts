import { search } from '@codemirror/search'
import { EditorView } from '@codemirror/view'

// Like Monaco, a match lands in the middle of the view, not on its edge.
export const centeredSearch = search({
  top: true,
  scrollToMatch: (range) => EditorView.scrollIntoView(range, { y: 'center' }),
})
