import { useEffect, useRef } from 'react'
import type { JsonSupport } from '../languages/json'
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
  json?: JsonSupport
}

export function CodeEditorComponent({
  features,
  editorKey,
  json,
}: CodeEditorComponentProps) {
  const editorElement = useRef<HTMLDivElement>(null)
  const { setEditor, removeEditor } = useCodeStore()

  useEffect(() => {
    const element = editorElement.current

    if (!element) {
      return
    }

    const editor = new Editor(element, json)

    if (features.lineSelection) {
      editor.usePlugin(LineSelector)
    }

    if (features.rangeHighlight) {
      editor.usePlugin(RangeHighlightPlugin)
    }

    setEditor(editorKey, editor)

    return () => {
      removeEditor(editorKey, editor)
      editor.dispose()
    }
  }, [editorKey, setEditor, removeEditor])

  return (
    <div
      className="h-full min-h-0 w-full"
      ref={editorElement}
      onKeyDown={(event) => event.stopPropagation()}
      onKeyUp={(event) => event.stopPropagation()}
    />
  )
}
