import type { Line, Range, Text } from '@codemirror/state'
import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  type ViewUpdate,
} from '@codemirror/view'
import colors from '../../colors.json'

const INDENT_WIDTH = 4
const LINE_PADDING_LEFT = '6px'

// One vertical line per indent level, drawn as a background of the whole
// line, so a guide costs no DOM and runs through blank lines too.
const guideTheme = EditorView.theme({
  '.cm-line.cm-indent-guides': {
    backgroundImage: `repeating-linear-gradient(to right, ${colors.coffee['800']} 0 1px, transparent 1px ${INDENT_WIDTH}ch)`,
    backgroundPosition: `${LINE_PADDING_LEFT} 0`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: `calc(var(--indent-levels) * ${INDENT_WIDTH}ch) 100%`,
  },
})

const guideDecorations: Decoration[] = []

function guideDecoration(levels: number): Decoration {
  let decoration = guideDecorations[levels]
  if (decoration === undefined) {
    decoration = Decoration.line({
      class: 'cm-indent-guides',
      attributes: { style: `--indent-levels: ${levels}` },
    })
    guideDecorations[levels] = decoration
  }
  return decoration
}

const guidePlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet

    constructor(view: EditorView) {
      this.decorations = visibleGuides(view)
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = visibleGuides(update.view)
      }
    }
  },
  { decorations: (plugin) => plugin.decorations },
)

export const indentGuides = [guidePlugin, guideTheme]

function visibleGuides(view: EditorView): DecorationSet {
  const doc = view.state.doc
  const ranges: Range<Decoration>[] = []
  for (const { from, to } of view.visibleRanges) {
    const lastLineNumber = doc.lineAt(to).number
    for (
      let number = doc.lineAt(from).number;
      number <= lastLineNumber;
      number++
    ) {
      const line = doc.line(number)
      const levels = guideLevels(doc, line)
      if (levels > 0) {
        ranges.push(guideDecoration(levels).range(line.from))
      }
    }
  }
  return Decoration.set(ranges)
}

// A line shows a guide for every indent level it sits in. A blank line sits
// in the levels shared by the lines around it.
function guideLevels(doc: Text, line: Line): number {
  const indent = indentWidth(line.text)
  if (indent !== undefined) {
    return Math.ceil(indent / INDENT_WIDTH)
  }
  const above = nearestIndent(doc, line.number, -1)
  const below = nearestIndent(doc, line.number, 1)
  return Math.ceil(Math.min(above, below) / INDENT_WIDTH)
}

function nearestIndent(doc: Text, lineNumber: number, step: 1 | -1): number {
  for (
    let number = lineNumber + step;
    number >= 1 && number <= doc.lines;
    number += step
  ) {
    const indent = indentWidth(doc.line(number).text)
    if (indent !== undefined) {
      return indent
    }
  }
  return 0
}

export function indentWidth(text: string): number | undefined {
  let width = 0
  for (const character of text) {
    if (character === ' ') {
      width++
    } else if (character === '\t') {
      width += INDENT_WIDTH - (width % INDENT_WIDTH)
    } else {
      return width
    }
  }
  return undefined
}
