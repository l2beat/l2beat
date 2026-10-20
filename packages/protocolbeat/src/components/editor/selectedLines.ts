import {
  EditorSelection,
  type EditorState,
  type Extension,
  type Range,
  RangeSet,
  StateEffect,
  StateField,
} from '@codemirror/state'
import {
  Decoration,
  type DecorationSet,
  EditorView,
  GutterMarker,
  gutterLineClass,
  lineNumbers,
} from '@codemirror/view'

// Lines picked by clicking line numbers, shared by the code and diff line
// selectors. Line numbers are 1-based and inclusive, like in the URL.
export interface SelectedLines {
  startLine: number
  endLine: number
  anchorLine: number
}

export interface SelectedLinesHandlers {
  onLineNumberClick(
    view: EditorView,
    lineNumber: number,
    shiftKey: boolean,
  ): void
  onContentClick(view: EditorView): void
}

const SELECTED_BACKGROUND = 'rgba(154, 52, 18, 0.2)'
const SELECTED_GUTTER_BACKGROUND = 'rgba(154, 52, 18, 0.3)'
const SELECTED_BORDER = '#f97316'

export const setSelectedLines = StateEffect.define<SelectedLines | null>()

const selectedLinesField = StateField.define<SelectedLines | null>({
  create: () => null,
  update(selection, transaction) {
    for (const effect of transaction.effects) {
      if (effect.is(setSelectedLines)) {
        return effect.value
      }
    }
    return selection
  },
  provide: (field) => [
    EditorView.decorations.compute(['doc', field], (state) =>
      lineDecorations(state, state.field(field)),
    ),
    gutterLineClass.compute(['doc', field], (state) =>
      gutterMarkers(state, state.field(field)),
    ),
  ],
})

class SelectedLineGutterMarker extends GutterMarker {
  override elementClass = 'cm-selected-line-gutter'
}

const selectedLineGutterMarker = new SelectedLineGutterMarker()

// Box shadows instead of borders, so a selected line keeps its size.
const selectedLinesTheme = EditorView.theme({
  '.cm-lineNumbers .cm-gutterElement:hover': { cursor: 'pointer' },
  '.cm-line.cm-selected-line': { backgroundColor: SELECTED_BACKGROUND },
  '.cm-selected-line': {
    boxShadow: `inset 4px 0 ${SELECTED_BORDER}, inset -1px 0 ${SELECTED_BORDER}`,
  },
  '.cm-selected-line-first': {
    boxShadow: `inset 4px 0 ${SELECTED_BORDER}, inset -1px 0 ${SELECTED_BORDER}, inset 0 1px ${SELECTED_BORDER}`,
  },
  '.cm-selected-line-last': {
    boxShadow: `inset 4px 0 ${SELECTED_BORDER}, inset -1px 0 ${SELECTED_BORDER}, inset 0 -1px ${SELECTED_BORDER}`,
  },
  '.cm-selected-line-single': {
    boxShadow: `inset 4px 0 ${SELECTED_BORDER}, inset -1px 0 ${SELECTED_BORDER}, inset 0 1px ${SELECTED_BORDER}, inset 0 -1px ${SELECTED_BORDER}`,
  },
  '.cm-gutterElement.cm-selected-line-gutter': {
    backgroundColor: SELECTED_GUTTER_BACKGROUND,
  },
})

export function selectedLines(handlers: SelectedLinesHandlers): Extension {
  return [
    selectedLinesField,
    selectedLinesTheme,
    lineNumbers({
      domEventHandlers: {
        mousedown: (view, line, event) => {
          const lineNumber = view.state.doc.lineAt(line.from).number
          handlers.onLineNumberClick(
            view,
            lineNumber,
            (event as MouseEvent).shiftKey,
          )
          return true
        },
      },
    }),
    EditorView.domEventHandlers({
      mousedown: (_, view) => {
        handlers.onContentClick(view)
        return false
      },
    }),
  ]
}

export function getSelectedLines(view: EditorView): SelectedLines | null {
  return view.state.field(selectedLinesField, false) ?? null
}

// A plain click selects one line, a shift click extends from the anchor.
export function nextSelectedLines(
  current: SelectedLines | null,
  lineNumber: number,
  shiftKey: boolean,
): SelectedLines {
  if (current === null || !shiftKey) {
    return {
      startLine: lineNumber,
      endLine: lineNumber,
      anchorLine: lineNumber,
    }
  }
  return {
    startLine: Math.min(current.anchorLine, lineNumber),
    endLine: Math.max(current.anchorLine, lineNumber),
    anchorLine: lineNumber,
  }
}

export function scrollToSelectedLines(view: EditorView) {
  const selection = getSelectedLines(view)
  if (selection === null) {
    return
  }
  const lines = visibleLineNumbers(view.state, selection)
  if (lines === undefined) {
    return
  }
  view.dispatch({
    effects: EditorView.scrollIntoView(
      EditorSelection.range(
        view.state.doc.line(lines.startLine).from,
        view.state.doc.line(lines.endLine).from,
      ),
      { y: 'center' },
    ),
  })
}

// A URL can name lines past the end of the file; those are left out.
function visibleLineNumbers(
  state: EditorState,
  selection: SelectedLines,
): { startLine: number; endLine: number } | undefined {
  const startLine = Math.max(selection.startLine, 1)
  const endLine = Math.min(selection.endLine, state.doc.lines)
  if (startLine > endLine) {
    return undefined
  }
  return { startLine, endLine }
}

function lineDecorations(
  state: EditorState,
  selection: SelectedLines | null,
): DecorationSet {
  const lines = selection && visibleLineNumbers(state, selection)
  if (!lines) {
    return Decoration.none
  }
  const decorations: Range<Decoration>[] = []
  for (let number = lines.startLine; number <= lines.endLine; number++) {
    const position = selectedLinePosition(selection, number)
    decorations.push(
      Decoration.line({
        class: `cm-selected-line cm-selected-line-${position}`,
      }).range(state.doc.line(number).from),
    )
  }
  return Decoration.set(decorations)
}

function selectedLinePosition(
  selection: SelectedLines,
  lineNumber: number,
): 'single' | 'first' | 'last' | 'middle' {
  if (selection.startLine === selection.endLine) {
    return 'single'
  }
  if (lineNumber === selection.startLine) {
    return 'first'
  }
  if (lineNumber === selection.endLine) {
    return 'last'
  }
  return 'middle'
}

function gutterMarkers(
  state: EditorState,
  selection: SelectedLines | null,
): RangeSet<GutterMarker> {
  const lines = selection && visibleLineNumbers(state, selection)
  if (!lines) {
    return RangeSet.empty
  }
  const markers: Range<GutterMarker>[] = []
  for (let number = lines.startLine; number <= lines.endLine; number++) {
    markers.push(selectedLineGutterMarker.range(state.doc.line(number).from))
  }
  return RangeSet.of(markers)
}
