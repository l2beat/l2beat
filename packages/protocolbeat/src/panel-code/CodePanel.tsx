import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCode, getProject } from '../api/api'
import { toShortenedAddress } from '../common/toShortenedAddress'
import { IconCodeFile } from '../icons/IconCodeFile'
import { useMultiViewStore } from '../multi-view/store'
import { usePanelStore } from '../store/store'
import { Editor } from './editor'

export function CodePanel() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }
  const projectResponse = useQuery({
    queryKey: ['projects', project],
    queryFn: () => getProject(project),
  })
  const selectedAddress = usePanelStore((state) => state.selected)
  const codeResponse = useQuery({
    queryKey: ['projects', project, 'code', selectedAddress],
    enabled: selectedAddress !== undefined,
    queryFn: () => getCode(project, selectedAddress),
  })
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const hasProxy =
      codeResponse.isSuccess && codeResponse.data.sources.length > 1
    setCurrent(hasProxy ? 1 : 0)
  }, [codeResponse.data])

  if (projectResponse.isError || codeResponse.isError) {
    return <div>Error</div>
  }

  const response = codeResponse.data?.sources ?? []
  const sources =
    response.length === 0
      ? [
          {
            name: selectedAddress
              ? toShortenedAddress(selectedAddress)
              : 'Loading',
            code: codeResponse.isPending ? '// Loading' : '// No code',
          },
        ]
      : response

  return (
    <div className="flex h-full w-full select-none flex-col">
      <div className="flex gap-1 overflow-x-auto border-b border-b-coffee-600 px-1 pt-1">
        {sources.map((x, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={clsx(
              'flex h-6 items-center gap-1 px-2 text-sm',
              current === i && 'bg-autumn-300 text-black',
            )}
          >
            <IconCodeFile />
            {x.name}
          </button>
        ))}
      </div>
      <CodeView code={sources[current]?.code ?? '// No code'} />
    </div>
  )
}

function CodeView({ code }: { code: string }) {
  const monacoEl = useRef(null)
  const [editor, setEditor] = useState<Editor | undefined>(undefined)
  const panels = useMultiViewStore((state) => state.panels)
  const pickedUp = useMultiViewStore((state) => state.pickedUp)

  useEffect(() => {
    if (!monacoEl.current) {
      return
    }

    const editor = new Editor(monacoEl.current)
    setEditor(editor)

    function onResize() {
      editor.resize()
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      editor.destruct()
    }
  }, [setEditor])

  useEffect(() => {
    editor?.setCode(code)
  }, [editor, code])

  useEffect(() => {
    editor?.resize()
  }, [editor, panels, pickedUp])

  return <div className="h-full w-full" ref={monacoEl} />
}
