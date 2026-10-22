import { type ReactNode, useEffect, useState } from 'react'
import { CodeEditorComponent } from '../code/CodeEditorComponent'
import type { EditorCallbacks } from '../code/editor'
import { useCodeSettings } from '../code/hooks/useCodeSettings'
import { LineSelector } from '../code/plugins/lineSelector'
import { RangeHighlightPlugin } from '../code/plugins/range'
import { EditorFileTabs } from '../components/EditorFileTabs'
import type { JsonSupport } from '../languages/json'
import { type EditorFile, type Range, useCodeStore } from '../store'

export type EditorViewProps = {
  editorId: string
  callbacks?: EditorCallbacks
  files: EditorFile[]
  initialFileIndex?: number
  range?: {
    data?: Range
    index?: number
  }
  disableTabs?: boolean
  tabActions?: ReactNode
  features?: {
    lineSelection: boolean
    rangeHighlight: boolean
    goToDefinition?: boolean
  }
  onActiveFileChange?: (file: EditorFile | undefined) => void
  json?: JsonSupport
}

export function EditorView(props: EditorViewProps) {
  const { features = { lineSelection: false, rangeHighlight: true } } = props
  const [activeFileIndex, setActiveFileIndex] = useState(
    () => pickFileIndex(props) ?? 0,
  )
  // A new file list picks its tab while rendering, so the editor never opens
  // the file at the previous index on the way.
  const [shownFiles, setShownFiles] = useState(props.files)
  if (shownFiles !== props.files) {
    setShownFiles(props.files)
    const index = pickFileIndex(props)
    if (index !== undefined) {
      setActiveFileIndex(index)
    }
  }

  const editor = useCodeStore((store) => store.editors[props.editorId])
  const { setDirtyFile, getIsDirtyFile } = useCodeStore()
  const { resetRange, initialSelection, setSelection } = useCodeSettings()

  useEffect(() => {
    if (!editor) {
      return
    }
    const loadDisposable = editor.onLoad(() => {
      const plugin = editor.getPlugin(LineSelector)
      if (plugin) {
        plugin.setSelection(initialSelection)
        plugin.scrollToSelection()
      }
    })
    return () => loadDisposable.dispose()
  }, [editor, initialSelection])

  useEffect(() => {
    return editor?.getPlugin(LineSelector)?.onSelectionChange((selection) => {
      setSelection(selection)
    })
  }, [editor])

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
            return isNewContentOk ? content : activeFile.content
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

  useEffect(() => {
    props.onActiveFileChange?.(props.files[activeFileIndex])
  }, [props.onActiveFileChange, props.files, activeFileIndex])

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
      editor
        .getPlugin(RangeHighlightPlugin)
        ?.showRange(startOffset, length, { highlight: true })
    }
  }, [editor, props.range, activeFileIndex])

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
          actions={props.tabActions}
        />
      )}
      <CodeEditorComponent
        editorKey={props.editorId}
        features={features}
        json={props.json}
      />
    </div>
  )
}

function pickFileIndex(props: EditorViewProps): number | undefined {
  return props.range?.data !== undefined
    ? props.range.index
    : props.initialFileIndex
}
