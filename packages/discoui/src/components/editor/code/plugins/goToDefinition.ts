import { type Extension, StateEffect } from '@codemirror/state'
import {
  Decoration,
  type DecorationSet,
  EditorView,
  keymap,
  ViewPlugin,
  type ViewUpdate,
} from '@codemirror/view'
import type { EditorPlugin } from '../../plugin'
import {
  type PeekContent,
  type PeekOrigin,
  peekExtension,
  peekOrigin,
  togglePeek,
} from './peek'

// The view is the code panel's own or a peek inside it.
export interface DefinitionRequest {
  view: EditorView
  offset: number
  origin: PeekOrigin | undefined
}

export interface DefinitionHandlers {
  goToDefinition(request: DefinitionRequest): void
  goToContract(request: DefinitionRequest): void
  findReferences(request: DefinitionRequest): void
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
  readonly extension: Extension = [
    underliner,
    peekExtension,
    keymap.of([
      {
        key: 'F12',
        run: (view) =>
          this.run(view, (request) => this.handlers?.goToDefinition(request)),
      },
      {
        key: 'Shift-F12',
        run: (view) =>
          this.run(view, (request) => this.handlers?.findReferences(request)),
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
        underline(view, null)
        view.focus()
        view.dispatch({ selection: { anchor: word.offset } })
        const request = requestAt(view, word.offset)
        if (event.shiftKey) {
          this.handlers?.goToContract(request)
        } else {
          this.handlers?.goToDefinition(request)
        }
        return true
      },
      mousemove: (event, view) => {
        underline(view, linkedWord(view, event)?.range ?? null)
        return false
      },
      mouseleave: (_, view) => {
        underline(view, null)
        return false
      },
      keyup: (_, view) => {
        underline(view, null)
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

  peek(request: DefinitionRequest, content: PeekContent) {
    togglePeek(request.view, request.offset, content, this.extension)
  }

  private run(
    view: EditorView,
    action: (request: DefinitionRequest) => void,
  ): boolean {
    underline(view, null)
    action(requestAt(view, view.state.selection.main.head))
    return true
  }
}

function requestAt(view: EditorView, offset: number): DefinitionRequest {
  return { view, offset, origin: view.state.facet(peekOrigin) }
}

function underline(view: EditorView, range: WordRange | null) {
  const current = view.plugin(underliner)?.range ?? null
  if (range?.from === current?.from && range?.to === current?.to) {
    return
  }
  view.dispatch({ effects: setUnderline.of(range) })
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
