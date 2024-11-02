import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import type { editor as editorType } from 'monaco-editor'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCode, getProject } from '../api/api'
import { IconCodeFile } from '../icons/IconCodeFile'
import { useMultiViewStore } from '../multi-view/store'
import { usePanelStore } from '../store/store'
import { create } from './editor'

export function CodePanel() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }
  const projectResponse = useQuery({
    queryKey: ['projects', project],
    queryFn: () => getProject(project),
  })
  const selectedAddress = usePanelStore((state) => state.selected[0])
  const codeResponse = useQuery({
    queryKey: ['projects', project, 'code', selectedAddress],
    enabled: selectedAddress !== undefined,
    queryFn: () => getCode(project, selectedAddress),
  })
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    setCurrent(0)
  }, [codeResponse.data])

  if (projectResponse.isPending || codeResponse.isPending) {
    return <div>Loading</div>
  }
  if (projectResponse.isError || codeResponse.isError) {
    return <div>Error</div>
  }
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex gap-1 border-b border-b-latte px-1 pt-1">
        {codeResponse.data.sources.map((x, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={clsx(
              'flex h-6 items-center gap-1 px-2 text-sm',
              current === i && 'bg-sun text-black',
            )}
          >
            <IconCodeFile />
            {x.name}
          </button>
        ))}
      </div>
      <CodeView
        code={codeResponse.data.sources[current]?.code ?? '// No code'}
      />
    </div>
  )
}

function CodeView({ code }: { code: string }) {
  const monacoEl = useRef(null)
  const [editor, setEditor] = useState<
    editorType.IStandaloneCodeEditor | undefined
  >(undefined)
  const panels = useMultiViewStore((state) => state.panels)
  const pickedUp = useMultiViewStore((state) => state.pickedUp)

  useEffect(() => {
    if (!monacoEl.current) {
      return
    }

    const editor = create(monacoEl.current)
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
  }, [editor, panels, pickedUp])

  return <div className="h-full w-full" ref={monacoEl} />
}
