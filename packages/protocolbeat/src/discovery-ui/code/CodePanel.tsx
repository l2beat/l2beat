import { useQuery } from '@tanstack/react-query'
import * as monaco from 'monaco-editor'
import './monaco-workers'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCode, getProject } from '../api/api'
import { useStore } from '../store'
import { useStore as useMultiViewStore } from '../multi-view/store'

export function CodePanel() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }
  const projectResponse = useQuery({
    queryKey: ['projects', project],
    queryFn: () => getProject(project),
  })
  const selectedAddress = useStore((state) => state.selected[0])
  const codeResponse = useQuery({
    queryKey: ['projects', project, 'code', selectedAddress],
    enabled: selectedAddress !== undefined,
    queryFn: () => getCode(project, selectedAddress),
  })

  if (projectResponse.isLoading || codeResponse.isLoading) {
    return <div>Loading</div>
  }
  if (projectResponse.isError || codeResponse.isError) {
    return <div>Error</div>
  }
  return <CodeView code={codeResponse.data.sources[0]?.code ?? '// No code'} />
}

function CodeView({ code }: { code: string }) {
  const monacoEl = useRef(null)
  const [editor, setEditor] = useState<
    monaco.editor.IStandaloneCodeEditor | undefined
  >(undefined)
  const panels = useMultiViewStore((state) => state.panels)

  useEffect(() => {
    if (!monacoEl.current) {
      return
    }
    const editor = monaco.editor.create(monacoEl.current, {
      language: 'sol',
      minimap: { enabled: false },
    })
    setEditor(editor)

    function onResize() {
      editor.layout()
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      editor.dispose()
    }
  }, [setEditor])

  useEffect(() => {
    if (editor) {
      editor.setValue(code)
    }
  }, [editor, code])

  useEffect(() => {
    editor?.layout()
  }, [editor, panels])

  return <div className="h-full w-full" ref={monacoEl} />
}
