import { StateEffect } from '@codemirror/state'
import {
  Decoration,
  type DecorationSet,
  EditorView,
  keymap,
  ViewPlugin,
  type ViewUpdate,
} from '@codemirror/view'
import type { EditorPlugin } from '../../plugin'

export interface DefinitionHandlers {
  goToDefinition(offset: number): void
  findReferences(offset: number): void
  goBack(): void
}

interface WordRange {
  from: number
  to: number
}

const setUnderline = StateEffect.define<WordRange | null>()

const underlineMark = Decoration.mark({ class: 'underline cursor-pointer' })

const underliner = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet = Decoration.none
    range: WordRange | null = null

    update(update: ViewUpdate) {
      this.decorations = this.decorations.map(update.changes)
      for (const transaction of update.transactions) {
        for (const effect of transaction.effects) {
          if (effect.is(setUnderline)) {
            this.range = effect.value
            this.decorations =
              effect.value === null
                ? Decoration.none
                : Decoration.set(
                    underlineMark.range(effect.value.from, effect.value.to),
                  )
          }
        }
      }
    }
  },
  { decorations: (plugin) => plugin.decorations },
)

export class GoToDefinitionPlugin implements EditorPlugin {
  // Control on every platform, as Cmd+- on macOS zooms the page.
  readonly extension = [
    underliner,
    keymap.of([
      {
        key: 'F12',
        run: () => this.run((offset) => this.handlers?.goToDefinition(offset)),
      },
      {
        key: 'Shift-F12',
        run: () => this.run((offset) => this.handlers?.findReferences(offset)),
      },
      {
        key: 'Ctrl--',
        run: () => {
          this.handlers?.goBack()
          return true
        },
      },
    ]),
    EditorView.domEventHandlers({
      mousedown: (event, view) => {
        const word = linkedWord(view, event)
        if (word === undefined) {
          return false
        }
        event.preventDefault()
        this.underline(null)
        view.focus()
        view.dispatch({ selection: { anchor: word.offset } })
        this.handlers?.goToDefinition(word.offset)
        return true
      },
      mousemove: (event, view) => {
        this.underline(linkedWord(view, event)?.range ?? null)
        return false
      },
      mouseleave: () => {
        this.underline(null)
        return false
      },
      keyup: () => {
        this.underline(null)
        return false
      },
    }),
  ]
  private handlers: DefinitionHandlers | undefined

  constructor(readonly view: EditorView) {}

  dispose() {
    this.handlers = undefined
  }

  setHandlers(handlers: DefinitionHandlers | undefined) {
    this.handlers = handlers
  }

  cursorOffset(): number {
    return this.view.state.selection.main.head
  }

  private run(action: (offset: number) => void): boolean {
    this.underline(null)
    action(this.cursorOffset())
    return true
  }

  private underline(range: WordRange | null) {
    const current = this.view.plugin(underliner)?.range ?? null
    if (range?.from === current?.from && range?.to === current?.to) {
      return
    }
    this.view.dispatch({ effects: setUnderline.of(range) })
  }
}

function linkedWord(
  view: EditorView,
  event: MouseEvent,
): { offset: number; range: WordRange } | undefined {
  if (!event.metaKey && !event.ctrlKey) {
    return undefined
  }
  const offset = view.posAtCoords({ x: event.clientX, y: event.clientY })
  if (offset === null) {
    return undefined
  }
  const word = view.state.wordAt(offset)
  if (word === null) {
    return undefined
  }
  return { offset, range: { from: word.from, to: word.to } }
}
