import { lazy, Suspense } from 'react'
import { LoadingState } from '../../LoadingState'
import type { MonacoJsonEditorViewProps } from '../monaco-json/MonacoJsonEditorView'
import type { DiffViewProps } from './DiffView'
import type { EditorViewProps } from './EditorView'

// Monaco is most of the bundle, so it loads with the first editor on screen
// instead of with every page.
const LazyEditorView = lazy(() =>
  import('./EditorView').then((module) => ({ default: module.EditorView })),
)
const LazyMonacoJsonEditorView = lazy(() =>
  import('../monaco-json/MonacoJsonEditorView').then((module) => ({
    default: module.MonacoJsonEditorView,
  })),
)
const LazyDiffView = lazy(() =>
  import('./DiffView').then((module) => ({ default: module.DiffView })),
)

export function EditorView(props: EditorViewProps) {
  return (
    <Suspense fallback={<LoadingState />}>
      <LazyEditorView {...props} />
    </Suspense>
  )
}

export function DiffView(props: DiffViewProps) {
  return (
    <Suspense fallback={<LoadingState />}>
      <LazyDiffView {...props} />
    </Suspense>
  )
}

export function MonacoJsonEditorView(props: MonacoJsonEditorViewProps) {
  return (
    <Suspense fallback={<LoadingState />}>
      <LazyMonacoJsonEditorView {...props} />
    </Suspense>
  )
}
