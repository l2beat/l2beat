import { useEffect, useRef, useState } from 'react'
import type { EditorCallbacks } from '../code/editor'
import { EditorFileTabs } from '../components/EditorFileTabs'
import { type EditorFile, useCodeStore } from '../store'
import { MonacoJsonEditor } from './MonacoJsonEditor'
import { useMonacoJsonEditorStore } from './store'

export type MonacoJsonEditorViewProps = {
  editorId: string
  callbacks?: EditorCallbacks
  files: EditorFile[]
  disableTabs?: boolean
}

export function MonacoJsonEditorView(props: MonacoJsonEditorViewProps) {
  const [activeFileIndex, setActiveFileIndex] = useState(0)

  const editor = useMonacoJsonEditorStore(
    (store) => store.editors[props.editorId],
  )
  const { setDirtyFile, getIsDirtyFile } = useCodeStore()

  useEffect(() => {
    if (editor && props.files.length > 0) {
      const activeFile = props.files[activeFileIndex]
      if (activeFile) {
        let changeDisposable: { dispose: () => void } | undefined
        if (!activeFile.readOnly) {
          editor.onSave((content) => {
            const isNewContentOk = props.callbacks?.onSave?.(content)
            if (isNewContentOk) {
              setDirtyFile(props.editorId, activeFile.id, false)
            }
            return activeFile.content
          })

          changeDisposable = editor.onChange((content) => {
            props.callbacks?.onChange?.(content)
            setDirtyFile(
              props.editorId,
              activeFile.id,
              content !== activeFile.content,
            )
          })
        }

        editor.setFile(activeFile)

        return () => {
          changeDisposable?.dispose()
        }
      }
    }
  }, [editor, props.files, activeFileIndex])

  return (
    <div className="flex h-full w-full select-none flex-col">
      {props.disableTabs ? null : (
        <EditorFileTabs
          files={props.files.map((file, index) => ({
            ...file,
            isDirty: getIsDirtyFile(props.editorId, file.id),
            isActive: index === activeFileIndex,
            onClick: () => setActiveFileIndex(index),
          }))}
        />
      )}
      <MonacoJsonEditorComponent editorKey={props.editorId} />
    </div>
  )
}

function MonacoJsonEditorComponent({ editorKey }: { editorKey: string }) {
  const monacoEl = useRef<HTMLDivElement>(null)
  const { setEditor, removeEditor } = useMonacoJsonEditorStore()

  useEffect(() => {
    const element = monacoEl.current

    if (!element) {
      return
    }

    const editor = new MonacoJsonEditor(element)
    setEditor(editorKey, editor)

    const resizeObserver = new ResizeObserver(() => {
      editor.resize()
    })
    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
      removeEditor(editorKey, editor)
      editor.dispose()
    }
  }, [editorKey, setEditor, removeEditor])

  return (
    <div
      className="h-full w-full"
      ref={monacoEl}
      onKeyDown={(event) => event.stopPropagation()}
      onKeyUp={(event) => event.stopPropagation()}
    />
  )
}
