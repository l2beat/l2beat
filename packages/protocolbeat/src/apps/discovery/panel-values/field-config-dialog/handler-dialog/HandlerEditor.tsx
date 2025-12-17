import { useEffect, useMemo } from 'react'
import type { ApiHandlersResponse } from '../../../../../api/types'
import type {
  EditorContentCallback,
  EditorSaveCallback,
} from '../../../../../components/editor/code/editor'
import { useCodeStore } from '../../../../../components/editor/store'
import { EditorView } from '../../../../../components/editor/views/EditorView'

type HandlerEditorProps = {
  context: 'config' | 'template'
  fieldName: string
  contents: string
  selectedHandler: ApiHandlersResponse['handlers'][number] | undefined
  onSave: EditorSaveCallback
  onChange: EditorContentCallback
}

export function HandlerEditor({
  context,
  fieldName,
  contents,
  selectedHandler,
  onSave,
  onChange,
}: HandlerEditorProps) {
  const editorKey = `handler-${context}-${fieldName}`
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
  }, [editorKey, file])

  // monaco schema synchronization
  useEffect(() => {
    if (selectedHandler && editor) {
      const uriString = uri?.toString() ?? ''

      editor.setJsonDiagnostics({
        allowComments: true,
        validate: true,
        enableSchemaRequest: true,
        schemaValidation: 'error',
        schemas: [
          {
            // So we do not have to specify $schema property in the handler contents
            uri: uriString,
            fileMatch: [uriString],
            schema: selectedHandler.schema,
          },
        ],
      })
    }
  }, [selectedHandler, uri])

  // filling editor with basic handler structure when changing
  useEffect(() => {
    if (selectedHandler && editor) {
      const basicHandler = JSON.stringify(
        { type: selectedHandler.type },
        null,
        2,
      )
      editor.setFile({
        id: editorKey,
        name: editorKey,
        content: basicHandler,
        readOnly: false,
        language: 'json',
      })
    }
  }, [selectedHandler, editorKey])

  return (
    <EditorView
      features={{ lineSelection: false, rangeHighlight: false }}
      editorId={editorKey}
      callbacks={{
        onSave,
        onChange,
      }}
      files={[file]}
    />
  )
}
