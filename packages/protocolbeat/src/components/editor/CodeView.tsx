import { useEffect } from 'react'

import { useRef } from 'react'
import { useMultiViewStore } from '../../multi-view/store'
import { Editor } from './editor'
import { useCodeStore } from './store'
import type { Range } from './store'

export function CodeView({
  range,
  editorKey = 'default',
}: {
  range: Range | undefined
  editorKey?: string
  readOnly?: boolean
}) {
  const monacoEl = useRef(null)
  const { setEditor, getEditor, showRange } = useCodeStore()
  const editor = getEditor(editorKey)
  const panels = useMultiViewStore((state) => state.panels)
  const pickedUp = useMultiViewStore((state) => state.pickedUp)
  const fullScreen = useMultiViewStore((state) => state.fullScreen)
  const files = useCodeStore((state) => state.files[editorKey]) ?? []

  useEffect(() => {
    if (!monacoEl.current) {
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
      // Dispose editor when component unmounts
      editor.dispose()
    }
  }, [setEditor, editorKey])

  useEffect(() => {
    if (editor && files.length > 0) {
      editor.registerFiles(files)
    }
  }, [editor, files])

  useEffect(() => {
    editor?.resize()
  }, [editor, panels, pickedUp, fullScreen])

  useEffect(() => {
    if (range !== undefined) {
      showRange(undefined)
      const { startOffset, length } = range
      editor?.showRange(startOffset, length)
    }
  }, [editor, range])

  return <div className="h-full w-full" ref={monacoEl} />
}
