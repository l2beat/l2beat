import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor/esm/vs/editor/edcore.main'
import 'monaco-editor/esm/vs/language/json/monaco.contribution'

import type { editor } from 'monaco-editor/esm/vs/editor/editor.api'
import { cyrb64 } from '../hashes/cyrb-hash'
import { EditorPluginStore } from '../pluginStore'
import {
  getSharedDiffProvider,
  type LineRange,
  type LineRangeMapping,
} from './customDiffProvider'

export interface Change {
  readonly left: [number, number]
  readonly right: [number, number]
}

export interface Diff {
  deletions: number
  additions: number
  changes: Change[]
}

export class DiffEditor extends EditorPluginStore<'diff'> {
  private models: Record<string, editor.IDiffEditorModel | null> = {}
  private viewStates: Record<string, editor.IDiffEditorViewState | null> = {}
  private currentCodeHash = ''
  private originalAlignmentZoneIds = new Set<string>()
  private modifiedAlignmentZoneIds = new Set<string>()

  constructor(element: HTMLElement) {
    super(element, 'diff')
    // Hide our alignment zones from Monaco's diff-alignment computation.
    // `getAdditionalLineHeights` (diffEditorViewZones.js:500) walks the
    // inner editor's getWhitespaces() and treats anything not in its
    // private ignore-set as content needing compensation on the other
    // side. Since the public ignore-set isn't reachable, we filter our
    // IDs out at the API boundary instead. The inner editor's own
    // rendering/layout uses viewLayout.getWhitespaces() directly
    // (codeEditorWidget.js:388) and is unaffected.
    this.shadowGetWhitespaces(
      this.editor.getOriginalEditor(),
      this.originalAlignmentZoneIds,
    )
    this.shadowGetWhitespaces(
      this.editor.getModifiedEditor(),
      this.modifiedAlignmentZoneIds,
    )
    this.callbacks.push(
      this.editor.onDidUpdateDiff(() => this.syncAlignmentZones()),
    )
  }

  private shadowGetWhitespaces(
    innerEditor: monaco.editor.ICodeEditor,
    ourIds: Set<string>,
  ) {
    const target = innerEditor as unknown as {
      getWhitespaces: () => {
        id: string
        afterLineNumber: number
        height: number
      }[]
    }
    const original = target.getWhitespaces.bind(target)
    target.getWhitespaces = () => original().filter((w) => !ourIds.has(w.id))
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
      this.models[newCodeHash] = {
        original: monaco.editor.createModel(codeLeft, 'solidity'),
        modified: monaco.editor.createModel(codeRight, 'solidity'),
      }
    }

    this.editor.setModel(this.models[newCodeHash] ?? null)
    this.editor.restoreViewState(this.viewStates[newCodeHash] ?? null)
  }

  onComputedDiff(listener: (diff: Diff) => void): monaco.IDisposable {
    const disposable = this.editor.onDidUpdateDiff(() => {
      const lineChanges = this.editor.getLineChanges() ?? []
      let deletions = 0
      let additions = 0

      const changes: Change[] = []
      for (const c of lineChanges) {
        changes.push({
          left: [c.originalStartLineNumber, c.originalEndLineNumber],
          right: [c.modifiedStartLineNumber, c.modifiedEndLineNumber],
        })

        if (c.originalEndLineNumber > 0) {
          deletions += c.originalEndLineNumber - c.originalStartLineNumber + 1
        }
        if (c.modifiedEndLineNumber > 0) {
          additions += c.modifiedEndLineNumber - c.modifiedStartLineNumber + 1
        }
      }

      listener({ deletions, additions, changes })
    })

    return this.trackDisposable(disposable)
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

  // For each filtered range, add a view zone on the side with fewer lines
  // so Monaco's alignment for the kept changes still lines up. This covers
  // fully dropped changes and the lead/trail slices around a narrowed change.
  // Monaco listens to onDidChangeViewZones and re-runs its alignment pass
  // when our zones land (diffEditorViewZones.js:64-69).
  private syncAlignmentZones() {
    const model = this.editor.getModel()
    if (!model) {
      return
    }

    const alignmentGaps = getSharedDiffProvider().getAlignmentGaps(
      model.modified,
    )

    this.padShorterSide(
      this.editor.getOriginalEditor(),
      this.originalAlignmentZoneIds,
      alignmentGaps,
      (d) => d.original,
      (d) => d.modified,
    )
    this.padShorterSide(
      this.editor.getModifiedEditor(),
      this.modifiedAlignmentZoneIds,
      alignmentGaps,
      (d) => d.modified,
      (d) => d.original,
    )
  }

  private padShorterSide(
    innerEditor: monaco.editor.ICodeEditor,
    ourIds: Set<string>,
    gaps: readonly LineRangeMapping[],
    hereSide: (d: LineRangeMapping) => LineRange,
    otherSide: (d: LineRangeMapping) => LineRange,
  ) {
    innerEditor.changeViewZones((accessor) => {
      for (const id of ourIds) {
        accessor.removeZone(id)
      }
      ourIds.clear()
      for (const gap of gaps) {
        const here = hereSide(gap)
        const other = otherSide(gap)
        const delta =
          other.endLineNumberExclusive -
          other.startLineNumber -
          (here.endLineNumberExclusive - here.startLineNumber)
        if (delta <= 0) {
          continue
        }
        const domNode = document.createElement('div')
        domNode.className = 'diagonal-fill'
        const id = accessor.addZone({
          afterLineNumber: here.endLineNumberExclusive - 1,
          heightInLines: delta,
          domNode,
          showInHiddenAreas: true,
          suppressMouseDown: true,
        })
        ourIds.add(id)
      }
    })
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
    this.disposeCallbacks()
    this.disposePlugins()
    this.editor.dispose()
  }
}
