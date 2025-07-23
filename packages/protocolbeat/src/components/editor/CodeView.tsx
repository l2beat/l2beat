import { useEffect, useRef } from 'react'
import { useMultiViewStore } from '../../multi-view/store'
import { Editor } from './editor'
import { useCodeStore } from './store'

export function CodeView({
  editorKey = 'default',
}: {
  editorKey?: string
  readOnly?: boolean
}) {
  const monacoEl = useRef(null)
  const { setEditor, getEditor, removeEditor } = useCodeStore()
  const editor = getEditor(editorKey)
  const panels = useMultiViewStore((state) => state.panels)
  const pickedUp = useMultiViewStore((state) => state.pickedUp)
  const fullScreen = useMultiViewStore((state) => state.fullScreen)

  useEffect(() => {
    if (!monacoEl.current) {
      return
    }

    const existingEditor = getEditor(editorKey)
    if (existingEditor) {
      return
    }

    const editor = new Editor(monacoEl.current)
    setEditor(editorKey, editor)

    function onResize() {
      editor.resize()
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      // Remove editor from store and dispose it when component unmounts
      editor.dispose()
      removeEditor(editorKey)
    }
  }, [setEditor, editorKey, removeEditor, getEditor])

  useEffect(() => {
    editor?.resize()
  }, [editor, panels, pickedUp, fullScreen])

  return <div className="h-full w-full" ref={monacoEl} />
}
