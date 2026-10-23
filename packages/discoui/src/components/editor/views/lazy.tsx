import { lazy, Suspense } from 'react'
import { LoadingState } from '../../LoadingState'
import type { DiffViewProps } from './DiffView'
import type { EditorViewProps } from './EditorView'

// The editors are a large part of the bundle, so they load with the first
// editor on screen instead of with every page.
const LazyEditorView = lazy(() =>
  import('./EditorView').then((module) => ({ default: module.EditorView })),
)
const LazyJsonEditorView = lazy(() =>
  import('./JsonEditorView').then((module) => ({
    default: module.JsonEditorView,
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

// JSON panels load the language service with them, code panels never do.
export function JsonEditorView(props: EditorViewProps) {
  return (
    <Suspense fallback={<LoadingState />}>
      <LazyJsonEditorView {...props} />
    </Suspense>
  )
}
