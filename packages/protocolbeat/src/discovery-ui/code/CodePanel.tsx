import { useQuery } from '@tanstack/react-query'
import { useStore } from '../store'
import { getCode, getProject } from '../api/api'
import { useParams } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import * as monaco from 'monaco-editor'

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

  useEffect(() => {
    if (!monacoEl.current) {
      return
    }
    const editor = monaco.editor.create(monacoEl.current, {
      value: code,
      language: 'sol',
      theme: '',
      minimap: { enabled: false },
    })

    return () => editor?.dispose()
  }, [code])

  return <div className="h-full w-full" ref={monacoEl}></div>
}
