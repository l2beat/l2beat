import {
  EditorSelection,
  Facet,
  Prec,
  StateEffect,
  StateField,
  type Text,
} from '@codemirror/state'
import {
  Decoration,
  EditorView,
  keymap,
  type Panel,
  showPanel,
} from '@codemirror/view'

interface GoToLineState {
  readonly target: number | undefined
}

const openEffect = StateEffect.define<null>()
const closeEffect = StateEffect.define<null>()
const previewEffect = StateEffect.define<number | undefined>()

const targetLine = Decoration.line({ class: 'cm-goto-target' })

const goToLineField = StateField.define<GoToLineState | null>({
  create: () => null,
  update(value, transaction) {
    let result = value
    if (result?.target !== undefined && transaction.docChanged) {
      result = { target: transaction.changes.mapPos(result.target) }
    }
    for (const effect of transaction.effects) {
      if (effect.is(openEffect)) {
        result = { target: undefined }
      } else if (effect.is(closeEffect)) {
        result = null
      } else if (effect.is(previewEffect) && result !== null) {
        result = { target: effect.value }
      }
    }
    return result
  },
  provide: (field) => [
    showPanel.from(field, (value) =>
      value === null ? null : createGoToLineWidget,
    ),
    EditorView.decorations.from(field, (value) => (view) => {
      if (value?.target === undefined) {
        return Decoration.none
      }
      const line = view.state.doc.lineAt(value.target)
      return Decoration.set([targetLine.range(line.from)])
    }),
  ],
})

// Ctrl-g on every platform, like VS Code, where it also wins over findNext,
// in the find widget too.
export const goToLine = [
  goToLineField,
  Prec.high(
    keymap.of([
      {
        key: 'Ctrl-g',
        run: openGoToLine,
        scope: 'editor search-panel',
        preventDefault: true,
      },
    ]),
  ),
]

// Shows a target that the editor hides before the cursor moves there, like a
// fold that the cursor alone does not open.
export const goToLineReveal =
  Facet.define<(view: EditorView, position: number) => void>()

// One constructor for the panel's lifetime, a new one would recreate it.
function createGoToLineWidget(view: EditorView): Panel {
  return new GoToLineWidget(view)
}

function openGoToLine(view: EditorView): boolean {
  const open = view.dom.querySelector<HTMLInputElement>('.cm-goto-field')
  if (open !== null) {
    open.select()
    return true
  }
  view.dispatch({ effects: openEffect.of(null) })
  return true
}

// Like VS Code, the view follows the typed line without moving the cursor,
// Enter moves it there and Escape returns the view to where it was.
class GoToLineWidget implements Panel {
  readonly dom: HTMLElement
  readonly top = true
  private readonly originScroll: StateEffect<unknown>
  private readonly originOuterScroll: ScrollOffset[]
  private readonly field = document.createElement('input')
  private readonly message = document.createElement('div')

  constructor(private readonly view: EditorView) {
    this.originScroll = view.scrollSnapshot()
    this.originOuterScroll = readOuterScroll(view)
    this.field.className = 'cm-find-field cm-goto-field'
    this.field.ariaLabel = 'Go to line'
    this.field.placeholder = 'line:character'
    this.field.spellcheck = false
    const box = document.createElement('div')
    box.className = 'cm-find-box'
    box.append(this.field)
    this.message.className = 'cm-goto-message'
    this.dom = document.createElement('div')
    this.dom.className = 'cm-goto'
    this.dom.append(box, this.message)
    this.field.addEventListener('input', () => this.preview())
    this.field.addEventListener('keydown', (event) => this.keydown(event))
    this.field.addEventListener('blur', () => this.close())
    this.showMessage(undefined)
  }

  mount() {
    this.field.focus()
  }

  private keydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault()
      this.returnToOrigin([closeEffect.of(null)])
      this.view.focus()
    } else if (event.key === 'Enter') {
      event.preventDefault()
      this.accept()
    }
  }

  private preview() {
    const target = parsePosition(this.view.state.doc, this.field.value)
    this.showMessage(target)
    if (target === undefined) {
      this.returnToOrigin([previewEffect.of(undefined)])
      return
    }
    this.view.dispatch({
      effects: [
        previewEffect.of(target),
        EditorView.scrollIntoView(target, { y: 'center' }),
      ],
    })
  }

  private accept() {
    const target = parsePosition(this.view.state.doc, this.field.value)
    if (target === undefined) {
      return
    }
    for (const reveal of this.view.state.facet(goToLineReveal)) {
      reveal(this.view, target)
    }
    this.view.dispatch({
      selection: EditorSelection.cursor(target),
      effects: [
        closeEffect.of(null),
        EditorView.scrollIntoView(target, { y: 'center' }),
      ],
    })
    this.view.focus()
  }

  private close() {
    if (this.view.state.field(goToLineField) === null) {
      return
    }
    this.view.dispatch({ effects: closeEffect.of(null) })
  }

  // The snapshot replaces a pending scroll to the preview, but only restores
  // the editor's own scroller, and a merge view scrolls an outer element.
  private returnToOrigin(effects: StateEffect<unknown>[]) {
    this.view.dispatch({ effects: [...effects, this.originScroll] })
    for (const offset of this.originOuterScroll) {
      offset.element.scrollTop = offset.top
      offset.element.scrollLeft = offset.left
    }
  }

  private showMessage(target: number | undefined) {
    const doc = this.view.state.doc
    if (target === undefined) {
      const head = this.view.state.selection.main.head
      const line = doc.lineAt(head)
      this.message.textContent = `Current Line: ${line.number}, Character: ${head - line.from + 1}. Type a line number between 1 and ${doc.lines} to navigate to.`
      return
    }
    const line = doc.lineAt(target)
    const character = target - line.from + 1
    this.message.textContent =
      character === 1
        ? `Go to line ${line.number}.`
        : `Go to line ${line.number}, character ${character}.`
  }
}

interface ScrollOffset {
  element: HTMLElement
  top: number
  left: number
}

function readOuterScroll(view: EditorView): ScrollOffset[] {
  const offsets: ScrollOffset[] = []
  let element = parentOf(view.scrollDOM)
  while (element !== null) {
    offsets.push({
      element,
      top: element.scrollTop,
      left: element.scrollLeft,
    })
    element = parentOf(element)
  }
  return offsets
}

// Biome's type inference runs out on parentElement read in a loop.
function parentOf(element: HTMLElement): HTMLElement | null {
  return element.parentElement
}

export function parsePosition(doc: Text, value: string): number | undefined {
  const parts = value.trim().replace(',', ':').split(':')
  if (parts.length > 2) {
    return undefined
  }
  const lineNumber = parsePositiveInteger(parts[0] ?? '')
  const columnNumber = parsePositiveInteger(parts[1] ?? '1')
  if (lineNumber === undefined || columnNumber === undefined) {
    return undefined
  }
  const line = doc.line(Math.min(lineNumber, doc.lines))
  return line.from + Math.min(columnNumber - 1, line.length)
}

function parsePositiveInteger(text: string): number | undefined {
  if (text.length === 0) {
    return undefined
  }
  for (const character of text) {
    if (character < '0' || character > '9') {
      return undefined
    }
  }
  const value = Number(text)
  return value >= 1 ? value : undefined
}
