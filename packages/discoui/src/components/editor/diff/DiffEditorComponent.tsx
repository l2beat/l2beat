import { useEffect, useRef } from 'react'
import { useCodeStore } from '../store'
import { DiffEditor } from './diffEditor'
import { LineSelector } from './plugins/lineSelector'

interface DiffEditorComponentProps {
  editorKey: string
}

export function DiffEditorComponent({ editorKey }: DiffEditorComponentProps) {
  const editorElement = useRef<HTMLDivElement>(null)
  const { setDiffEditor, getDiffEditor, removeDiffEditor } = useCodeStore()

  useEffect(() => {
    const element = editorElement.current

    if (!element) {
      return
    }

    const existingEditor = getDiffEditor(editorKey)

    if (existingEditor) {
      return () => {
        existingEditor.dispose()
        removeDiffEditor(editorKey)
      }
    }

    const editor = new DiffEditor(element)

    editor.usePlugin(LineSelector)

    setDiffEditor(editorKey, editor)

    return () => {
      editor.dispose()
      removeDiffEditor(editorKey)
    }
  }, [editorKey, setDiffEditor, getDiffEditor, removeDiffEditor])

  return (
    <div
      className="flex min-h-0 w-full flex-1 bg-coffee-900 [&>.cm-mergeView]:h-full [&>.cm-mergeView]:min-w-0 [&>.cm-mergeView]:flex-1 [&>.cm-mergeView]:[scrollbar-width:none]"
      ref={editorElement}
    />
  )
}
