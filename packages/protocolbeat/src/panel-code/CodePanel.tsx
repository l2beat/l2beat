import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { getCode, getProject } from '../api/api'
import type { ApiCodeResponse } from '../api/types'
import { findSelected } from '../common/findSelected'
import { toShortenedAddress } from '../common/toShortenedAddress'
import { isReadOnly } from '../config'
import { IconCodeFile } from '../icons/IconCodeFile'
import { useMultiViewStore } from '../multi-view/store'
import { usePanelStore } from '../store/store'
import { RediscoverPrompt } from './RediscoverPrompt'
import { Editor } from './editor'
import { type Range, useCodeStore } from './store'

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

  const selected = projectResponse.data
    ? findSelected(projectResponse.data.entries, selectedAddress)
    : undefined

  const hasCode: boolean =
    selected !== undefined &&
    'implementationNames' in selected &&
    selected.implementationNames !== undefined

  const codeResponse = useQuery({
    queryKey: ['projects', project, 'code', selectedAddress],
    enabled: selectedAddress !== undefined && hasCode,
    queryFn: () => getCode(project, selectedAddress),
    retry: 1,
  })
  const { getSourceIndex, setSourceIndex, range } = useCodeStore()
  useEffect(() => {
    if (codeResponse.isSuccess && selectedAddress !== undefined) {
      if (getSourceIndex(selectedAddress) === undefined) {
        const hasProxy = codeResponse.data.sources.length > 1
        setSourceIndex(selectedAddress, hasProxy ? 1 : 0)
      }
    }
  }, [codeResponse.data])
  const sourceIndex = getSourceIndex(selectedAddress ?? 'Loading')

  if (projectResponse.isError) {
    return <div>Error</div>
  }

  if (projectResponse.isPending) {
    return <div>Loading</div>
  }

  if (selected === undefined) {
    return <div>Select a contract</div>
  }

  let showRediscoverInfo = false
  const response = codeResponse.data?.sources ?? []
  let sources: ApiCodeResponse['sources'] = []
  if (!hasCode) {
    sources = [
      {
        name: selectedAddress ? toShortenedAddress(selectedAddress) : 'Loading',
        code: '// Entry has no code associated with it',
      },
    ]
  } else if (codeResponse.isPending) {
    sources = [
      {
        name: selectedAddress ? toShortenedAddress(selectedAddress) : 'Loading',
        code: '// Loading',
      },
    ]
  } else if (codeResponse.isError) {
    showRediscoverInfo = !isReadOnly
    sources = [
      {
        name: selectedAddress ? toShortenedAddress(selectedAddress) : 'Loading',
        code: '// ERROR: Failed to find the code for this contract',
      },
    ]
  } else {
    sources = response
  }

  const passedRange = codeResponse.isPending ? undefined : range

  return (
    <div className="flex h-full w-full select-none flex-col">
      <div className="flex flex-shrink-0 flex-grow gap-1 overflow-x-auto border-b border-b-coffee-600 px-1 pt-1">
        {sources.map((x, i) => (
          <button
            key={i}
            onClick={() => setSourceIndex(selectedAddress ?? 'Loading', i)}
            className={clsx(
              'flex h-6 items-center gap-1 px-2 text-sm',
              sourceIndex === i && 'bg-autumn-300 text-black',
            )}
          >
            <IconCodeFile />
            {x.name}
          </button>
        ))}
      </div>
      {showRediscoverInfo && <RediscoverPrompt chain={selected.chain} />}
      <CodeView
        code={sources[sourceIndex ?? 0]?.code ?? '// No code'}
        range={passedRange}
      />
    </div>
  )
}

function CodeView({ code, range }: { code: string; range: Range | undefined }) {
  const monacoEl = useRef(null)
  const { editor, setEditor, showRange } = useCodeStore()
  const panels = useMultiViewStore((state) => state.panels)
  const pickedUp = useMultiViewStore((state) => state.pickedUp)
  const fullScreen = useMultiViewStore((state) => state.fullScreen)

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
    }
  }, [setEditor])

  useEffect(() => {
    editor?.setCode(code)
  }, [editor, code])

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
