import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor/esm/vs/editor/edcore.main'
import 'monaco-editor/esm/vs/language/json/monaco.contribution'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

import * as solidity from './languages/solidity'

import type { editor } from 'monaco-editor/esm/vs/editor/editor.api'
import { cyrb64 } from './cyrb-hash'
import { theme } from './theme'

let monacoInitialized = false
const knownElements: Map<HTMLElement, DiffEditor> = new Map()

export interface Diff {
  deletions: number
  additions: number
}

export interface LineSelection {
  side: 'left' | 'right'
  startLine: number
  endLine: number
  anchorLine: number
}

export class DiffEditor {
  private readonly editor: monaco.editor.IStandaloneDiffEditor
  private models: Record<string, editor.IDiffEditorModel | null> = {}
  private viewStates: Record<string, editor.IDiffEditorViewState | null> = {}
  private currentCodeHash: string = ''
  private readonly element: HTMLElement
  private isSwapped: boolean = false
  private selectedLines: LineSelection | null = null
  private leftDecorationIds: string[] = []
  private rightDecorationIds: string[] = []
  private selectionChangeListeners: Array<
    (selection: LineSelection | null) => void
  > = []

  constructor(element: HTMLElement) {
    this.element = element

    if (monacoInitialized === false) {
      monacoInitialized = true
      init()
    }

    const existingEditor = knownElements.get(element)
    if (existingEditor) {
      existingEditor.dispose()
    }

    this.editor = monaco.editor.createDiffEditor(element, {
      minimap: { enabled: false },
      readOnly: true,
      colorDecorators: false,
      renderWhitespace: 'none',
      renderControlCharacters: false,
      fontFamily:
        "ui-monospace, Menlo, Monaco, 'Cascadia Code', 'Source Code Pro', Consolas, 'DejaVu Sans Mono', monospace",
      // @ts-expect-error Thanks you Microsoft
      'bracketPairColorization.enabled': false,
      model: null, // Prevent Monaco from creating a default model
    })

    this.setupLineSelectionHandlers()
    knownElements.set(element, this)
  }

  setDiff(codeLeft: string, codeRight: string) {
    const currentModel = this.editor.getModel()

    if (currentModel) {
      this.models[this.currentCodeHash] = currentModel
      this.viewStates[this.currentCodeHash] = this.editor.saveViewState()
    }

    const newCodeHash = cyrb64(cyrb64(codeLeft) + cyrb64(codeRight))
    this.currentCodeHash = newCodeHash

    if (this.models[newCodeHash] === undefined) {
      const [originalCode, modifiedCode] = this.isSwapped
        ? [codeRight, codeLeft]
        : [codeLeft, codeRight]

      this.models[newCodeHash] = {
        original: monaco.editor.createModel(originalCode, 'solidity'),
        modified: monaco.editor.createModel(modifiedCode, 'solidity'),
      }
    }

    this.editor.setModel(this.models[newCodeHash] ?? null)
    this.editor.restoreViewState(this.viewStates[newCodeHash] ?? null)
  }

  onComputedDiff(listener: (diff: Diff) => void) {
    this.editor.onDidUpdateDiff(() => {
      const changes = this.editor.getLineChanges() ?? []
      let deletions = 0
      let additions = 0

      for (const c of changes) {
        if (c.originalEndLineNumber > 0) {
          deletions += c.originalEndLineNumber - c.originalStartLineNumber + 1
        }
        if (c.modifiedEndLineNumber > 0) {
          additions += c.modifiedEndLineNumber - c.modifiedStartLineNumber + 1
        }
      }

      listener({ deletions, additions })
    })
  }

  onSelectionChange(listener: (selection: LineSelection | null) => void) {
    this.selectionChangeListeners.push(listener)

    // Return a function to unsubscribe
    return () => {
      const index = this.selectionChangeListeners.indexOf(listener)
      if (index > -1) {
        this.selectionChangeListeners.splice(index, 1)
      }
    }
  }

  swapSides(): boolean {
    const currentModel = this.editor.getModel()
    if (!currentModel) return this.isSwapped

    const viewState = this.editor.saveViewState()

    this.editor.setModel({
      original: currentModel.modified,
      modified: currentModel.original,
    })

    if (viewState) {
      this.editor.restoreViewState({
        original: viewState.modified,
        modified: viewState.original,
      })
    }

    this.isSwapped = !this.isSwapped
    return this.isSwapped
  }

  getIsSwapped(): boolean {
    return this.isSwapped
  }

  resize() {
    this.editor.layout()
  }

  setFolding(folding: boolean) {
    this.editor.updateOptions({
      hideUnchangedRegions: {
        enabled: folding,
      },
    })
  }

  toNextDiff() {
    this.editor.goToDiff('next')
  }

  toPreviousDiff() {
    this.editor.goToDiff('previous')
  }

  clearSelection() {
    this.selectedLines = null
    this.updateLineDecorations()
    this.notifySelectionChange()
  }

  private setupLineSelectionHandlers() {
    this.editor.getOriginalEditor().onMouseDown((e) => {
      if (e.target.type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS) {
        this.handleLineClick(
          'left',
          e.target.position?.lineNumber ?? 0,
          e.event.shiftKey,
        )
      } else {
        this.clearSelection()
      }
    })

    this.editor.getModifiedEditor().onMouseDown((e) => {
      if (e.target.type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS) {
        this.handleLineClick(
          'right',
          e.target.position?.lineNumber ?? 0,
          e.event.shiftKey,
        )
      } else {
        this.clearSelection()
      }
    })
  }

  setSelection(selection: LineSelection | null) {
    this.selectedLines = selection
    this.updateLineDecorations()
    this.notifySelectionChange()
  }

  scrollToSelection() {
    if (!this.selectedLines) return

    const { side } = this.selectedLines

    const editor =
      side === 'left'
        ? this.editor.getOriginalEditor()
        : this.editor.getModifiedEditor()

    const range = new monaco.Range(
      this.selectedLines.startLine,
      1,
      this.selectedLines.endLine,
      1,
    )
    editor.revealRangeInCenter(range)
  }

  private handleLineClick(
    side: 'left' | 'right',
    lineNumber: number,
    shiftKey: boolean,
  ) {
    if (!lineNumber) return

    if (!this.selectedLines || !shiftKey || this.selectedLines.side !== side) {
      this.selectedLines = {
        side,
        startLine: lineNumber,
        endLine: lineNumber,
        anchorLine: lineNumber,
      }
    } else {
      this.selectedLines = {
        side,
        startLine: Math.min(this.selectedLines.anchorLine, lineNumber),
        endLine: Math.max(this.selectedLines.anchorLine, lineNumber),
        anchorLine: lineNumber,
      }
    }

    this.updateLineDecorations()
    this.notifySelectionChange()
  }

  private notifySelectionChange() {
    this.selectionChangeListeners.forEach((listener) => {
      listener(this.selectedLines)
    })
  }

  private updateLineDecorations() {
    this.leftDecorationIds = this.editor
      .getOriginalEditor()
      .deltaDecorations(this.leftDecorationIds, [])
    this.rightDecorationIds = this.editor
      .getModifiedEditor()
      .deltaDecorations(this.rightDecorationIds, [])

    if (!this.selectedLines) return

    const decorations: editor.IModelDeltaDecoration[] = []
    const isMultiLine =
      this.selectedLines.startLine !== this.selectedLines.endLine

    for (
      let line = this.selectedLines.startLine;
      line <= this.selectedLines.endLine;
      line++
    ) {
      let className = 'selected-line-highlight'

      if (!isMultiLine) {
        className = 'selected-line-highlight-single'
      } else if (line === this.selectedLines.startLine) {
        className = 'selected-line-highlight-first'
      } else if (line === this.selectedLines.endLine) {
        className = 'selected-line-highlight-last'
      }

      decorations.push({
        range: new monaco.Range(line, 1, line, 1),
        options: {
          isWholeLine: true,
          className,
          marginClassName: 'selected-line-margin',
        },
      })
    }

    if (this.selectedLines.side === 'left') {
      this.leftDecorationIds = this.editor
        .getOriginalEditor()
        .deltaDecorations([], decorations)
    } else {
      this.rightDecorationIds = this.editor
        .getModifiedEditor()
        .deltaDecorations([], decorations)
    }
  }

  dispose() {
    Object.values(this.models).forEach((model) => {
      if (model) {
        model.original.dispose()
        model.modified.dispose()
      }
    })
    this.models = {}
    this.viewStates = {}

    this.leftDecorationIds = []
    this.rightDecorationIds = []
    this.selectionChangeListeners = []

    knownElements.delete(this.element)

    this.editor.dispose()
  }
}

function init() {
  // @ts-ignore
  self.MonacoEnvironment = {
    getWorker(_: unknown, label: string) {
      if (label === 'editorWorkerService') {
        return new editorWorker()
      }
      console.error('Unknown worker type!', label)
      return new editorWorker()
    },
  }

  monaco.languages.register({ id: 'solidity' })
  monaco.languages.setMonarchTokensProvider('solidity', solidity.language)
  monaco.languages.setLanguageConfiguration('solidity', solidity.configuration)

  monaco.editor.defineTheme('default', theme)
  monaco.editor.setTheme('default')
}

function encodeSelection(selection: LineSelection): string {
  const prefix = selection.side === 'left' ? 'L' : 'R'
  if (selection.startLine === selection.endLine) {
    return `${prefix}${selection.startLine}`
  }
  return `${prefix}${selection.startLine}-${selection.endLine}`
}

function decodeSelection(encoded: string): LineSelection | null {
  const match = encoded.match(/^([LR])(\d+)(?:-(\d+))?$/)
  if (!match) {
    return null
  }

  const side = match[1] === 'L' ? 'left' : 'right'
  // biome-ignore lint/style/noNonNullAssertion: we checked match[2] exists
  const startLine = parseInt(match[2]!, 10)
  // biome-ignore lint/style/noNonNullAssertion: we checked match[3] exists
  const endLine = match[3] ? parseInt(match[3]!, 10) : startLine

  return { side, startLine, endLine, anchorLine: endLine }
}

export const LineSelection = {
  decode: decodeSelection,
  encode: encodeSelection,
}
