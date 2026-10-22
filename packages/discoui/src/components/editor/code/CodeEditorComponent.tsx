import { useEffect, useRef } from 'react'
import type { JsonSupport } from '../languages/json'
import { useCodeStore } from '../store'
import { Editor } from './editor'
import { GoToDefinitionPlugin } from './plugins/goToDefinition'
import { LineSelector } from './plugins/lineSelector'
import { RangeHighlightPlugin } from './plugins/range'

type CodeEditorComponentProps = {
  editorKey: string
  features: {
    lineSelection: boolean
    rangeHighlight: boolean
    goToDefinition?: boolean
  }
  json?: JsonSupport
}

export function CodeEditorComponent({
  features,
  editorKey,
  json,
}: CodeEditorComponentProps) {
  const editorElement = useRef<HTMLDivElement>(null)
  const editorRef = useRef<Editor | null>(null)
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

    if (features.goToDefinition) {
      editor.usePlugin(GoToDefinitionPlugin)
    }

    setEditor(editorKey, editor)
    editorRef.current = editor

    return () => {
      editorRef.current = null
      removeEditor(editorKey, editor)
      editor.dispose()
    }
  }, [editorKey, setEditor, removeEditor])

  return (
    <div
      className="h-full min-h-0 w-full"
      ref={editorElement}
      onKeyDown={(event) => event.stopPropagation()}
      onKeyUp={(event) => {
        if (!opensGlobalSearch(editorRef.current, event)) {
          event.stopPropagation()
        }
      }}
    />
  )
}

// Read-only code has no use for '/', so it reaches the global search shortcut.
// The find panel's input lives outside the content and still types it.
function opensGlobalSearch(
  editor: Editor | null,
  event: React.KeyboardEvent,
): boolean {
  if (editor === null || event.key !== '/') {
    return false
  }
  return editor.view.state.readOnly && event.target === editor.view.contentDOM
}
