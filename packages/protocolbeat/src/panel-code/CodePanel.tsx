import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getCode, getProject } from '../api/api'
import type { ApiCodeResponse } from '../api/types'
import { findSelected } from '../common/findSelected'
import { toShortenedAddress } from '../common/toShortenedAddress'
import { CodeView } from '../components/editor/CodeView'
import { useCodeStore } from '../components/editor/store'
import { isReadOnly } from '../config'
import { usePanelStore } from '../store/store'
import { RediscoverPrompt } from './RediscoverPrompt'
import { EditorFileTabs } from '../components/editor/EditorFileTabs'

const editorId = 'code-panel'

export function CodePanel() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }
  const projectResponse = useQuery({
    queryKey: ['projects', project],
    queryFn: () => getProject(project),
  })
  const editor = useCodeStore((store) => store.editors[editorId])
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

  useEffect(() => {
    if (editor && sources.length > 0) {
      const activeFile =
        sourceIndex !== undefined ? sources[sourceIndex] : undefined

      if (activeFile) {
        editor.setFile({
          id: activeFile.name,
          name: activeFile.name,
          content: activeFile.code,
          language: 'solidity',
          readOnly: true,
        })
      }
    }
  }, [editor, sources, sourceIndex])

  if (projectResponse.isError) {
    return <div>Error</div>
  }

  if (projectResponse.isPending) {
    return <div>Loading</div>
  }

  if (selected === undefined) {
    return <div>Select a contract</div>
  }

  console.log('range', passedRange)

  return (
    <div className="flex h-full w-full select-none flex-col">
      <EditorFileTabs
        files={sources.map((x, i) => ({
          id: x.name,
          name: x.name,
          readOnly: true,
          isActive: sourceIndex === i,
          onClick: () => setSourceIndex(selectedAddress ?? 'Loading', i),
        }))}
      />
      {showRediscoverInfo && <RediscoverPrompt chain={selected.chain} />}
      <CodeView range={passedRange} editorKey={editorId} />
    </div>
  )
}
