import { useEffect, useState } from 'react'
import { CodeView } from './CodeView'
import { EditorFileTabs } from './EditorFileTabs'
import { useCodeStore } from './store'

type Props = {
  editorId: string
}

export function EditorView(props: Props) {
  const files = useCodeStore((store) => store?.files?.[props.editorId] ?? [])
  const [activeFileIndex, setActiveFileIndex] = useState(0)

  const editor = useCodeStore((store) => store.editors[props.editorId])

  useEffect(() => {
    if (editor && files.length > 0) {
      const activeFile = files[activeFileIndex]
      if (activeFile) {
        editor.setActiveFile(activeFile)
      }
    }
  }, [editor, files, activeFileIndex])

  if (files.length === 0) {
    return <div>No files</div>
  }

  return (
    <div className="flex h-full w-full select-none flex-col">
      <EditorFileTabs
        files={files.map((file, index) => ({
          ...file,
          isActive: index === activeFileIndex,
          onClick: () => setActiveFileIndex(index),
        }))}
      />
      <CodeView range={undefined} editorKey={props.editorId} />
    </div>
  )
}
