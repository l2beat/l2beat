import { EditorSelection, StateEffect, StateField } from '@codemirror/state'
import { Decoration, type DecorationSet, EditorView } from '@codemirror/view'
import colors from '../../../../colors.json'
import type { EditorPlugin } from '../../plugin'

const setHighlight = StateEffect.define<{ from: number; to: number } | null>()

const highlightMark = Decoration.mark({ class: 'cm-range-highlight' })

const highlightField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(highlight, transaction) {
    let next = highlight.map(transaction.changes)
    for (const effect of transaction.effects) {
      if (effect.is(setHighlight)) {
        next =
          effect.value === null || effect.value.from === effect.value.to
            ? Decoration.none
            : Decoration.set(
                highlightMark.range(effect.value.from, effect.value.to),
              )
      }
    }
    return next
  },
  provide: (field) => EditorView.decorations.from(field),
})

// An outline, unlike a border, leaves the text where it is.
const highlightTheme = EditorView.theme({
  '.cm-range-highlight': {
    backgroundColor: colors.coffee['600'],
    outline: `2px solid ${colors.aux.amber}`,
    borderRadius: '2px',
  },
})

export class RangeHighlightPlugin implements EditorPlugin {
  readonly extension = [highlightField, highlightTheme]
  private highlightTimeout: ReturnType<typeof setTimeout> | null = null

  constructor(readonly view: EditorView) {}

  dispose() {
    if (this.highlightTimeout !== null) {
      clearTimeout(this.highlightTimeout)
      this.highlightTimeout = null
    }
  }

  showRange(
    startOffset: number,
    length: number,
    options?: {
      highlight?: boolean
      highlightDuration?: number
    },
  ) {
    const docLength = this.view.state.doc.length
    const from = Math.min(startOffset, docLength)
    const to = Math.min(startOffset + length, docLength)
    const highlight = options?.highlight ? { from, to } : null

    this.view.dispatch({
      effects: [
        setHighlight.of(highlight),
        EditorView.scrollIntoView(EditorSelection.range(from, to), {
          y: 'center',
        }),
      ],
    })

    if (highlight === null) {
      return
    }

    if (this.highlightTimeout !== null) {
      clearTimeout(this.highlightTimeout)
    }

    this.highlightTimeout = setTimeout(() => {
      this.highlightTimeout = null
      this.clearHighlight()
    }, options?.highlightDuration ?? 3000)
  }

  clearHighlight() {
    this.view.dispatch({ effects: setHighlight.of(null) })
  }
}
