import { useEffect, useRef } from 'react'
import { Editor } from './editor'
import { useCodeStore } from './store'

export function CodeView({
  editorKey = 'default',
}: {
  editorKey?: string
  readOnly?: boolean
}) {
  const monacoEl = useRef<HTMLDivElement>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const { setEditor, getEditor, removeEditor } = useCodeStore()

  useEffect(() => {
    const element = monacoEl.current

    if (!element) {
      return
    }

    const existingEditor = getEditor(editorKey)

    if (existingEditor) {
      return
    }

    const editor = new Editor(element)
    setEditor(editorKey, editor)

    const resizeObserver = new ResizeObserver(() => {
      editor.resize()
    })
    resizeObserver.observe(element)
    resizeObserverRef.current = resizeObserver

    return () => {
      resizeObserver.disconnect()
      editor.dispose()
      removeEditor(editorKey)
    }
  }, [editorKey, setEditor, getEditor, removeEditor])

  return <div className="h-full w-full" ref={monacoEl} />
}
