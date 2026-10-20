import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import type { ToMonaco } from '../../monacoInit'
import type { EditorPlugin } from '../../pluginStore'

type ForType = 'code'

export interface DefinitionHandlers {
  goToDefinition(offset: number): void
  findReferences(offset: number): void
  goBack(): void
}

export class GoToDefinitionPlugin implements EditorPlugin<ForType> {
  private handlers: DefinitionHandlers | undefined
  private readonly disposables: monaco.IDisposable[] = []
  private readonly underline: monaco.editor.IEditorDecorationsCollection

  constructor(readonly editor: ToMonaco<ForType>) {
    this.underline = editor.createDecorationsCollection()
  }

  activate() {
    this.disposables.push(
      this.editor.addAction({
        id: 'l2beat.goToDefinition',
        label: 'Go to Definition',
        keybindings: [monaco.KeyCode.F12],
        contextMenuGroupId: 'navigation',
        contextMenuOrder: 1,
        run: () => this.goToDefinitionAt(this.editor.getPosition()),
      }),
      this.editor.addAction({
        id: 'l2beat.findReferences',
        label: 'Find All References',
        keybindings: [monaco.KeyMod.Shift | monaco.KeyCode.F12],
        contextMenuGroupId: 'navigation',
        contextMenuOrder: 2,
        run: () => {
          const offset = this.cursorOffset()
          if (offset !== undefined) {
            this.handlers?.findReferences(offset)
          }
        },
      }),
      this.editor.addAction({
        id: 'l2beat.goBack',
        label: 'Go Back',
        keybindings: [controlKey() | monaco.KeyCode.Minus],
        contextMenuGroupId: 'navigation',
        contextMenuOrder: 3,
        run: () => this.handlers?.goBack(),
      }),
      this.editor.onMouseDown((e) => {
        if (isLinkGesture(e)) {
          e.event.preventDefault()
          this.goToDefinitionAt(e.target.position)
        }
      }),
      this.editor.onMouseMove((e) => {
        this.underlineWordAt(isLinkGesture(e) ? e.target.position : null)
      }),
      this.editor.onMouseLeave(() => this.underlineWordAt(null)),
      this.editor.onKeyUp(() => this.underlineWordAt(null)),
    )
  }

  dispose() {
    this.handlers = undefined
    this.underline.clear()
    for (const disposable of this.disposables) {
      disposable.dispose()
    }
    this.disposables.length = 0
  }

  setHandlers(handlers: DefinitionHandlers | undefined) {
    this.handlers = handlers
  }

  cursorOffset(): number | undefined {
    const position = this.editor.getPosition()
    return position === null
      ? undefined
      : this.editor.getModel()?.getOffsetAt(position)
  }

  private goToDefinitionAt(position: monaco.Position | null) {
    const model = this.editor.getModel()
    if (position === null || model === null) {
      return
    }
    this.underlineWordAt(null)
    this.handlers?.goToDefinition(model.getOffsetAt(position))
  }

  private underlineWordAt(position: monaco.Position | null) {
    const word =
      position === null
        ? null
        : this.editor.getModel()?.getWordAtPosition(position)
    if (position === null || !word) {
      this.underline.clear()
      return
    }
    const range = new monaco.Range(
      position.lineNumber,
      word.startColumn,
      position.lineNumber,
      word.endColumn,
    )
    this.underline.set([
      { range, options: { inlineClassName: 'underline cursor-pointer' } },
    ])
  }
}

function isLinkGesture(
  e: monaco.editor.IEditorMouseEvent,
): e is monaco.editor.IEditorMouseEvent & {
  target: { position: monaco.Position }
} {
  const held = e.event.metaKey || e.event.ctrlKey
  return (
    held &&
    e.target.type === monaco.editor.MouseTargetType.CONTENT_TEXT &&
    e.target.position !== null
  )
}

// Control on every platform, as WinCtrl is the Windows key outside macOS and
// Cmd+- on macOS zooms the page.
function controlKey(): number {
  return navigator.platform.includes('Mac')
    ? monaco.KeyMod.WinCtrl
    : monaco.KeyMod.CtrlCmd
}
