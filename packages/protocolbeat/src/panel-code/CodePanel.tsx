import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import type { editor as editorType } from 'monaco-editor'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCode, getProject } from '../api/api'
import { toShortenedAddress } from '../common/toShortenedAddress'
import { IconCodeFile } from '../icons/IconCodeFile'
import { useMultiViewStore } from '../multi-view/store'
import { usePanelStore } from '../store/store'
import { create } from './editor'

import { editor } from 'monaco-editor/esm/vs/editor/editor.api'
const viewStates: Record<string, editor.ICodeEditorViewState | null> = {}

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
      viewStates[cyrb64(editor.getValue())] = editor.saveViewState()
      editor.setValue(code)
      editor.restoreViewState(viewStates[cyrb64(code)] ?? null)
    }
  }, [editor, code])

  useEffect(() => {
    editor?.layout()
  }, [editor, panels, pickedUp])

  return <div className="h-full w-full" ref={monacoEl} />
}

function cyrb64(str: string, seed: number = 0) {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507)
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507)
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  h2 = h2 >>> 0
  h1 = h1 >>> 0

  return h2.toString(36).padStart(7, '0') + h1.toString(36).padStart(7, '0')
}
