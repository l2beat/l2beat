import { defaultKeymap } from '@codemirror/commands'
import { bracketMatching } from '@codemirror/language'
import { highlightSelectionMatches } from '@codemirror/search'
import {
  EditorState,
  type Extension,
  Facet,
  StateEffect,
  StateField,
} from '@codemirror/state'
import {
  Decoration,
  drawSelection,
  EditorView,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  ViewPlugin,
  type ViewUpdate,
  WidgetType,
} from '@codemirror/view'
import { assert } from '@l2beat/shared-pure'
import colors from '../../../../colors.json'
import { indentGuides } from '../../indentGuides'
import { solidity } from '../../languages/solidity'
import { theme } from '../../theme'

export interface PeekOrigin {
  address: string
  sourceIndex: number
  offset: number
}

export interface PeekContent {
  key: string
  title: string
  location: string
  owner: string
  text: string
  firstLine: number
  origin: PeekOrigin
  onOpen: () => void
}

// Where a peek's text sits in its file. The code panel's own view has none.
export const peekOrigin = Facet.define<PeekOrigin, PeekOrigin | undefined>({
  combine: (values) => values[0],
})

const openPeek = StateEffect.define<PeekWidget>()
const closePeek = StateEffect.define<PeekWidget>()

const peeks = StateField.define<readonly PeekWidget[]>({
  create: () => [],
  update(value, transaction) {
    if (transaction.docChanged) {
      return []
    }
    let next = value
    for (const effect of transaction.effects) {
      if (effect.is(openPeek)) {
        next = [...next, effect.value]
      } else if (effect.is(closePeek)) {
        next = next.filter((peek) => peek !== effect.value)
      }
    }
    return next
  },
  provide: (field) =>
    EditorView.decorations.from(field, (list) =>
      Decoration.set(
        list.map((widget) =>
          Decoration.widget({ widget, block: true, side: 1 }).range(
            widget.position,
          ),
        ),
        true,
      ),
    ),
})

// Peeking what is already open under the same line closes it.
export function togglePeek(
  view: EditorView,
  offset: number,
  content: PeekContent,
  nested: Extension,
) {
  // A peek scrolled out of its parent's viewport loses its view.
  if (!view.dom.isConnected) {
    return
  }
  const position = view.state.doc.lineAt(offset).to
  const open = view.state
    .field(peeks)
    .find(
      (peek) => peek.position === position && peek.content.key === content.key,
    )
  view.dispatch({
    effects:
      open === undefined
        ? openPeek.of(new PeekWidget(position, content, nested))
        : closePeek.of(open),
  })
}

class PeekWidget extends WidgetType {
  // Kept while the widget is out of the viewport, so peeks inside survive.
  private state: EditorState | undefined
  private height = -1
  private mounted: { editor: EditorView; observer: ResizeObserver } | undefined

  constructor(
    readonly position: number,
    readonly content: PeekContent,
    private readonly nested: Extension,
  ) {
    super()
  }

  override get estimatedHeight() {
    return this.height
  }

  override toDOM(host: EditorView): HTMLElement {
    assert(this.mounted === undefined, 'Peek shown twice')
    const root = document.createElement('div')
    root.className = 'cm-peek'
    root.append(this.header(host))
    const editor = new EditorView({
      parent: root,
      state: this.state ?? this.createState(),
    })
    // The host measures its blocks only when asked, and peeks opened inside
    // this one change its height.
    const observer = new ResizeObserver(() => {
      const isFirstLayout = this.height === -1
      this.height = root.offsetHeight
      host.requestMeasure()
      if (isFirstLayout) {
        root.scrollIntoView({ block: 'nearest', inline: 'nearest' })
      }
    })
    observer.observe(root)
    this.mounted = { editor, observer }
    return root
  }

  override destroy() {
    assert(this.mounted !== undefined, 'Peek destroyed twice')
    this.state = this.mounted.editor.state
    this.mounted.observer.disconnect()
    this.mounted.editor.destroy()
    this.mounted = undefined
  }

  private createState(): EditorState {
    const { text, firstLine, origin } = this.content
    return EditorState.create({
      doc: text,
      extensions: [
        peekEditor,
        lineNumbers({ formatNumber: (line) => String(line + firstLine - 1) }),
        peekOrigin.of(origin),
        this.nested,
      ],
    })
  }

  private header(host: EditorView): HTMLElement {
    const header = document.createElement('div')
    header.className =
      'flex items-center gap-3 border-coffee-600 border-b bg-coffee-800 px-2 py-1 font-sans text-xs'
    const { title, location, owner, onOpen } = this.content
    const close = () => host.dispatch({ effects: closePeek.of(this) })
    header.append(
      element('span', 'font-bold font-mono text-coffee-200', title),
      element('button', 'text-autumn-300 hover:underline', location, onOpen),
      element('span', 'truncate text-coffee-400', owner),
      element(
        'button',
        'ml-auto text-coffee-400 hover:text-coffee-200',
        '✕',
        close,
      ),
    )
    return header
  }
}

function element(
  tag: 'span' | 'button',
  className: string,
  text: string,
  onClick?: () => void,
): HTMLElement {
  const result = document.createElement(tag)
  result.className = className
  result.textContent = text
  if (onClick !== undefined) {
    result.addEventListener('click', onClick)
  }
  return result
}

// Peeks stay in sight while the code under them scrolls sideways.
const peekBounds = ViewPlugin.fromClass(
  class {
    constructor(view: EditorView) {
      this.measure(view)
    }

    update(update: ViewUpdate) {
      if (update.geometryChanged) {
        this.measure(update.view)
      }
    }

    measure(view: EditorView) {
      view.requestMeasure({
        key: this,
        read: () => {
          const left = view.contentDOM.offsetLeft
          return { left, width: view.scrollDOM.clientWidth - left }
        },
        write: ({ left, width }) => {
          view.dom.style.setProperty('--peek-left', `${left}px`)
          view.dom.style.setProperty('--peek-width', `${width}px`)
        },
      })
    }
  },
)

const PEEK_MARGIN = 8

const peekTheme = EditorView.theme({
  '.cm-peek': {
    position: 'sticky',
    left: `calc(var(--peek-left) + ${PEEK_MARGIN}px)`,
    boxSizing: 'border-box',
    width: `calc(var(--peek-width) - ${2 * PEEK_MARGIN}px)`,
    margin: `4px ${PEEK_MARGIN}px`,
    border: `1px solid ${colors.coffee['600']}`,
    borderLeft: `3px solid ${colors.autumn['300']}`,
    borderRadius: '3px',
    overflow: 'hidden',
  },
  '&.cm-peek-editor': { height: 'auto', maxHeight: '60vh' },
  '&.cm-peek-editor .cm-scroller': { overflow: 'auto' },
})

export const peekExtension: Extension = [
  peeks,
  peekBounds,
  peekTheme,
  keymap.of([
    {
      key: 'Escape',
      run: (view) => {
        const last = view.state.field(peeks).at(-1)
        if (last === undefined) {
          return false
        }
        view.dispatch({ effects: closePeek.of(last) })
        return true
      },
    },
  ]),
]

const peekEditor: Extension = [
  EditorState.readOnly.of(true),
  EditorView.editorAttributes.of({ class: 'cm-peek-editor' }),
  highlightSpecialChars(),
  drawSelection(),
  bracketMatching(),
  highlightSelectionMatches({ highlightWordAroundCursor: true }),
  indentGuides,
  solidity,
  theme,
  keymap.of(defaultKeymap),
]
