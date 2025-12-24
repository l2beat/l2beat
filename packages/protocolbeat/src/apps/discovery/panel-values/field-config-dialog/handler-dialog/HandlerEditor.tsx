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
  }, [file])

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

  return (
    <EditorView
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
