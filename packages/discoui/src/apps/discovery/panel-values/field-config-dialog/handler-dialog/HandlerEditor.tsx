import { useEffect, useMemo } from 'react'
import type { ApiHandlersResponse } from '../../../../../api/types'
import type {
  EditorContentCallback,
  EditorSaveCallback,
} from '../../../../../components/editor/code/editor'
import { useCodeStore } from '../../../../../components/editor/store'
import { JsonEditorView } from '../../../../../components/editor/views/lazy'

type HandlerEditorProps = {
  context: 'config' | 'template'
  fieldName: string
  editorKey: string
  contents: string
  selectedHandler: ApiHandlersResponse['handlers'][number] | undefined
  onSave: EditorSaveCallback
  onChange: EditorContentCallback
}

export function HandlerEditor({
  editorKey,
  contents,
  selectedHandler,
  onSave,
  onChange,
}: HandlerEditorProps) {
  const editor = useCodeStore((store) => store.editors[editorKey])

  const file = useMemo(() => {
    return {
      id: editorKey,
      name: editorKey,
      content: contents ?? '',
      readOnly: false,
      language: 'json',
    } as const
  }, [editorKey, contents])

  const uri = useMemo(() => {
    return editor?.createUri(file)
  }, [file, editor])

  useEffect(() => {
    if (selectedHandler && editor && uri) {
      // Upsert schema for this specific handler without overwriting other schemas
      editor.upsertJsonSchema({
        uri,
        fileMatch: [uri],
        schema:
          selectedHandler.schema === null ? undefined : selectedHandler.schema,
      })
    }

    return () => {
      if (editor && uri) {
        editor.removeJsonSchema(uri)
      }
    }
  }, [selectedHandler, uri, editor])

  return (
    <JsonEditorView
      features={{ lineSelection: false, rangeHighlight: false }}
      editorId={editorKey}
      disableTabs
      callbacks={{
        onSave,
        onChange,
      }}
      files={[file]}
    />
  )
}
