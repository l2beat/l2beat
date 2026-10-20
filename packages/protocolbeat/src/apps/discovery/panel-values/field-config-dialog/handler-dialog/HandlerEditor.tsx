import { useEffect, useMemo } from 'react'
import type { ApiHandlersResponse } from '../../../../../api/types'
import type {
  EditorContentCallback,
  EditorSaveCallback,
} from '../../../../../components/editor/code/editor'
import { useMonacoJsonEditorStore } from '../../../../../components/editor/monaco-json/store'
import { MonacoJsonEditorView } from '../../../../../components/editor/views/lazy'

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
  const editor = useMonacoJsonEditorStore((store) => store.editors[editorKey])

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

  // monaco schema synchronization
  useEffect(() => {
    if (selectedHandler && editor && uri) {
      const uriString = uri.toString()

      // Upsert schema for this specific handler without overwriting other schemas
      editor.upsertJsonSchema({
        uri: uriString,
        fileMatch: [uriString],
        schema:
          selectedHandler.schema === null ? undefined : selectedHandler.schema,
      })
    }

    return () => {
      if (editor && uri) {
        editor.removeJsonSchema(uri.toString())
      }
    }
  }, [selectedHandler, uri, editor])

  return (
    <MonacoJsonEditorView
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
