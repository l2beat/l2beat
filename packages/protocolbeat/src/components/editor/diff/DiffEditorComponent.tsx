import { useEffect, useRef } from 'react'
import { useCodeStore } from '../store'
import { DiffEditor } from './diffEditor'
import { LineSelector } from './plugins/lineSelector'

interface DiffEditorComponentProps {
  editorKey: string
}

export function DiffEditorComponent({ editorKey }: DiffEditorComponentProps) {
  const monacoEl = useRef<HTMLDivElement>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const { setDiffEditor, getDiffEditor, removeDiffEditor } = useCodeStore()

  useEffect(() => {
    const element = monacoEl.current

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

    const resizeObserver = new ResizeObserver(() => {
      editor.resize()
    })
    resizeObserver.observe(element)
    resizeObserverRef.current = resizeObserver

    return () => {
      resizeObserver.disconnect()
      editor.dispose()
      removeDiffEditor(editorKey)
    }
  }, [editorKey, setDiffEditor, getDiffEditor, removeDiffEditor])

  return <div className="h-full w-full" ref={monacoEl} />
}
