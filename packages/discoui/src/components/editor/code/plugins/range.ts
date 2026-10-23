import { EditorSelection, StateEffect } from '@codemirror/state'
import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  type ViewUpdate,
} from '@codemirror/view'
import colors from '../../../../colors.json'
import type { EditorPlugin } from '../../plugin'

const setHighlight = StateEffect.define<{ from: number; to: number } | null>()

const highlightMark = Decoration.mark({ class: 'cm-range-highlight' })

// A view plugin rather than a state field: switching files swaps the state
// and recreates view plugins, so a highlight never outlives its file's tab.
const highlighter = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet = Decoration.none

    update(update: ViewUpdate) {
      this.decorations = this.decorations.map(update.changes)
      for (const transaction of update.transactions) {
        for (const effect of transaction.effects) {
          if (effect.is(setHighlight)) {
            this.decorations =
              effect.value === null || effect.value.from === effect.value.to
                ? Decoration.none
                : Decoration.set(
                    highlightMark.range(effect.value.from, effect.value.to),
                  )
          }
        }
      }
    }
  },
  { decorations: (plugin) => plugin.decorations },
)

// An outline, unlike a border, leaves the text where it is.
const highlightTheme = EditorView.theme({
  '.cm-range-highlight': {
    backgroundColor: colors.coffee['600'],
    outline: `2px solid ${colors.aux.amber}`,
    borderRadius: '2px',
  },
})

export class RangeHighlightPlugin implements EditorPlugin {
  readonly extension = [highlighter, highlightTheme]
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
      selection: { anchor: from },
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
