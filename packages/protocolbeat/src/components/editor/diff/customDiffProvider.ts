// @ts-expect-error - internal Monaco module, not in public types
import { LineRange as MonacoLineRange } from 'monaco-editor/esm/vs/editor/common/core/lineRange'
// @ts-expect-error - internal Monaco module, not in public types
import { linesDiffComputers } from 'monaco-editor/esm/vs/editor/common/diff/linesDiffComputers'
// @ts-expect-error - internal Monaco module, not in public types
import { DetailedLineRangeMapping as MonacoDetailedLineRangeMapping } from 'monaco-editor/esm/vs/editor/common/diff/rangeMapping'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import {
  alignmentGaps,
  type ChangeDecision,
  decideChanges,
  type LineRange,
  type LineRangeMapping,
} from './utils/diffFilter'

export type { LineRange, LineRangeMapping } from './utils/diffFilter'

const EMPTY_DROPPED: readonly LineRangeMapping[] = Object.freeze([])

let considerComments = false
let singleton: CustomDiffProvider | null = null

export function getSharedDiffProvider(): CustomDiffProvider {
  if (!singleton) {
    singleton = new CustomDiffProvider()
  }
  return singleton
}

export function setConsiderComments(value: boolean): void {
  if (considerComments === value) {
    return
  }
  considerComments = value
  singleton?.fireChange()
}

export class CustomDiffProvider {
  private readonly _onDidChange = new monaco.Emitter<void>()
  readonly onDidChange = this._onDidChange.event
  // Keyed by the modified model so entries get GC'd when the model is disposed.
  private readonly droppedByModified = new WeakMap<
    monaco.editor.ITextModel,
    LineRangeMapping[]
  >()

  fireChange(): void {
    this._onDidChange.fire()
  }

  getDroppedChanges(
    modified: monaco.editor.ITextModel,
  ): readonly LineRangeMapping[] {
    return this.droppedByModified.get(modified) ?? EMPTY_DROPPED
  }

  computeDiff(
    original: monaco.editor.ITextModel,
    modified: monaco.editor.ITextModel,
    options: {
      ignoreTrimWhitespace: boolean
      maxComputationTimeMs: number
      computeMoves: boolean
    },
    _token: monaco.CancellationToken,
  ) {
    const originalLines = original.getLinesContent()
    const modifiedLines = modified.getLinesContent()

    const result = linesDiffComputers
      .getDefault()
      .computeDiff(originalLines, modifiedLines, options)

    const { changes, dropped } = applyDecisions(
      result.changes,
      originalLines.join('\n'),
      modifiedLines.join('\n'),
      considerComments,
    )

    this.droppedByModified.set(modified, dropped)

    return Promise.resolve({
      identical: changes.length === 0,
      quitEarly: result.hitTimeout,
      changes,
      moves: result.moves,
    })
  }
}

function applyDecisions(
  monacoChanges: LineRangeMapping[],
  originalSource: string,
  modifiedSource: string,
  considerComments: boolean,
): { changes: LineRangeMapping[]; dropped: LineRangeMapping[] } {
  let decisions: ChangeDecision[]
  try {
    decisions = decideChanges(
      monacoChanges,
      originalSource,
      modifiedSource,
      considerComments,
    )
  } catch (error) {
    console.error(
      '[customDiffProvider] decideChanges failed; falling back to raw diff',
      error,
    )
    return { changes: monacoChanges, dropped: [] }
  }

  const kept: LineRangeMapping[] = []
  const dropped: LineRangeMapping[] = []
  for (let i = 0; i < monacoChanges.length; i++) {
    const decision = decisions[i] as ChangeDecision
    const outer = monacoChanges[i] as LineRangeMapping
    if (decision.kind === 'keep') {
      kept.push(outer)
    } else if (decision.kind === 'narrow') {
      kept.push(buildMonacoMapping(decision.original, decision.modified))
    }
    dropped.push(...alignmentGaps(outer, decision))
  }
  return { changes: kept, dropped }
}

function buildMonacoMapping(
  original: LineRange,
  modified: LineRange,
): LineRangeMapping {
  return new MonacoDetailedLineRangeMapping(
    new MonacoLineRange(
      original.startLineNumber,
      original.endLineNumberExclusive,
    ),
    new MonacoLineRange(
      modified.startLineNumber,
      modified.endLineNumberExclusive,
    ),
    undefined,
  )
}
