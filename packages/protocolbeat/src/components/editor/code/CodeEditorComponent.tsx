import { useEffect, useRef } from 'react'
import { useCodeStore } from '../store'
import { Editor } from './editor'
import { LineSelector } from './plugins/lineSelector'
import { RangeHighlightPlugin } from './plugins/range'

type CodeEditorComponentProps = {
  editorKey: string
  features: {
    lineSelection: boolean
    rangeHighlight: boolean
  }
}

export function CodeEditorComponent({
  features,
  editorKey,
}: CodeEditorComponentProps) {
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
      return () => {
        existingEditor.dispose()
        removeEditor(editorKey)
      }
    }

    const editor = new Editor(element)

    if (features.lineSelection) {
      editor.usePlugin(LineSelector)
    }

    if (features.rangeHighlight) {
      editor.usePlugin(RangeHighlightPlugin)
    }

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
