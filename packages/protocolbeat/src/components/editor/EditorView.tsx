import { useEffect, useState } from 'react'
import { CodeView } from './CodeView'
import { EditorFileTabs } from './EditorFileTabs'
import type { EditorCallbacks } from './editor'
import { type EditorFile, type Range, useCodeStore } from './store'

type Props = {
  editorId: string
  callbacks?: EditorCallbacks
  files: EditorFile[]
  initialFileIndex?: number
  range?: {
    data?: Range
    index?: number
  }
  disableTabs?: boolean
}

export function EditorView(props: Props) {
  const [dirtyFiles, setDirtyFiles] = useState<Record<string, boolean>>({})
  const [activeFileIndex, setActiveFileIndex] = useState(0)

  const editor = useCodeStore((store) => store.editors[props.editorId])
  const { resetRange } = useCodeStore()

  const setDirtyFile = (fileId: string, dirty: boolean) => {
    setDirtyFiles((prev) => ({ ...prev, [fileId]: dirty }))
  }

  useEffect(() => {
    if (editor && props.files.length > 0) {
      const activeFile = props.files[activeFileIndex]
      editor.detachListeners()
      if (activeFile) {
        if (!activeFile.readOnly) {
          editor.onSave((content) => {
            const result = props.callbacks?.onSave?.(content)
            setDirtyFile(activeFile.id, false)
            activeFile.content = result ?? content
            return activeFile.content
          })

          editor.onChange((content) => {
            props.callbacks?.onChange?.(content)
            setDirtyFile(activeFile.id, content !== activeFile.content)
          })
        }

        editor.setFile(activeFile)
      }
    }
  }, [editor, props.files, activeFileIndex])

  useEffect(() => {
    if (
      props.files.length > 0 &&
      props.initialFileIndex !== undefined &&
      props.range?.index === undefined &&
      props.range?.data === undefined
    ) {
      setActiveFileIndex(props.initialFileIndex)
    }
  }, [
    props.files,
    props.initialFileIndex,
    props.range?.index,
    props.range?.data,
  ])

  useEffect(() => {
    if (
      props.range?.data !== undefined &&
      props.range.index !== undefined &&
      editor
    ) {
      const shouldTrigger = activeFileIndex === props.range.index

      if (!shouldTrigger) {
        setActiveFileIndex(props.range.index)
        return
      }

      const { startOffset, length } = props.range.data
      resetRange()
      editor.showRange(startOffset, length)
    }
  }, [editor, props.range, activeFileIndex])

  return (
    <div className="flex h-full w-full select-none flex-col">
      {props.disableTabs ? null : (
        <EditorFileTabs
          files={props.files.map((file, index) => ({
            ...file,
            isDirty: dirtyFiles[file.id] ?? false,
            isActive: index === activeFileIndex,
            onClick: () => setActiveFileIndex(index),
          }))}
        />
      )}
      <CodeView editorKey={props.editorId} />
    </div>
  )
}
