import { useEffect, useState } from 'react'
import { CodeView } from './CodeView'
import { EditorFileTabs } from './EditorFileTabs'
import { type EditorFile, useCodeStore } from './store'
import type { EditorCallbacks } from './editor'

type Props = {
  editorId: string
  callbacks?: EditorCallbacks
  files: EditorFile[]
}

export function EditorView(props: Props) {
  const [dirtyFiles, setDirtyFiles] = useState<Record<string, boolean>>({})
  const [activeFileIndex, setActiveFileIndex] = useState(0)

  const editor = useCodeStore((store) => store.editors[props.editorId])

  const setDirtyFile = (fileId: string, dirty: boolean) => {
    setDirtyFiles((prev) => ({ ...prev, [fileId]: dirty }))
  }

  useEffect(() => {
    if (props.files.length > 0) {
      setActiveFileIndex(0)
    }
  }, [props.files])

  useEffect(() => {
    if (editor && props.files.length > 0) {
      const activeFile = props.files[activeFileIndex]
      if (activeFile) {
        editor.setFile(activeFile, {
          onSave: (content) => {
            setDirtyFile(activeFile.id, false)
            props.callbacks?.onSave?.(content)
          },
          onChange: (content) => {
            setDirtyFile(activeFile.id, content !== activeFile.content)
            props.callbacks?.onChange?.(content)
          },
        })
      }
    }
  }, [editor, props.files, activeFileIndex])

  if (props.files.length === 0) {
    return <div>No files</div>
  }

  return (
    <div className="flex h-full w-full select-none flex-col">
      <EditorFileTabs
        files={props.files.map((file, index) => ({
          ...file,
          isDirty: dirtyFiles[file.id] ?? false,
          isActive: index === activeFileIndex,
          onClick: () => setActiveFileIndex(index),
        }))}
      />
      <CodeView range={undefined} editorKey={props.editorId} />
    </div>
  )
}
