import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { getCode } from '../../../api/api'
import type { ApiCodeResponse } from '../../../api/types'
import { ActionNeededState } from '../../../components/ActionNeededState'
import { ErrorState } from '../../../components/ErrorState'
import { EditorView } from '../../../components/editor/EditorView'
import { type EditorFile, useCodeStore } from '../../../components/editor/store'
import { LoadingState } from '../../../components/LoadingState'
import { IS_READONLY } from '../../../config/readonly'
import { toShortenedAddress } from '../../../utils/toShortenedAddress'
import { useProjectData } from '../hooks/useProjectData'
import { RediscoverPrompt } from './RediscoverPrompt'

export function CodePanel() {
  const { project, selectedAddress, projectResponse, selected } =
    useProjectData()

  const hasCode = useMemo(
    () =>
      selected !== undefined &&
      'implementationNames' in selected &&
      selected.implementationNames !== undefined,
    [selected],
  )

  const codeResponse = useQuery({
    queryKey: ['projects', project, 'code', selectedAddress],
    enabled: selectedAddress !== undefined && hasCode,
    queryFn: () => {
      if (!selectedAddress) {
        throw new Error('Selected address is required')
      }
      return getCode(project, selectedAddress)
    },
    retry: 1,
  })

  const { getRange, getSourceIndex } = useCodeStore()

  const hasProxy = useMemo(() => {
    const sources = codeResponse.data?.sources

    if (!sources) {
      return false
    }

    return sources.length > 1
  }, [codeResponse.isPending, selectedAddress])

  const files = useMemo(
    () => getCodeFiles(codeResponse, selectedAddress, hasCode),
    [codeResponse, selectedAddress, hasCode],
  )

  const showRediscoverInfo = codeResponse.isError && !IS_READONLY

  const range = selectedAddress ? getRange(selectedAddress) : undefined

  if (projectResponse.isError) {
    return <ErrorState />
  }

  if (projectResponse.isPending) {
    return <LoadingState />
  }

  if (selected === undefined) {
    return <ActionNeededState message="Select a contract" />
  }

  const rangeInfo =
    codeResponse.isPending || !selectedAddress
      ? undefined
      : {
          index: getSourceIndex(selectedAddress),
          data: range,
        }

  return (
    <div className="flex h-full w-full select-none flex-col">
      {showRediscoverInfo && <RediscoverPrompt />}
      <EditorView
        editorId="code-panel"
        files={files}
        range={rangeInfo}
        initialFileIndex={hasProxy ? 1 : 0}
      />
    </div>
  )
}

function getCodeFiles(
  codeResponse: ReturnType<typeof useQuery<ApiCodeResponse>>,
  selectedAddress: string | undefined,
  hasCode: boolean,
): EditorFile[] {
  const addressName = selectedAddress
    ? toShortenedAddress(selectedAddress)
    : 'Loading'

  if (!hasCode) {
    return [
      {
        id: addressName,
        name: addressName,
        content: '// Entry has no code associated with it',
        readOnly: true,
        language: 'solidity',
      },
    ]
  }

  if (codeResponse.isPending) {
    return [
      {
        id: addressName,
        name: addressName,
        content: '// Loading',
        readOnly: true,
        language: 'solidity',
      },
    ]
  }

  if (codeResponse.isError) {
    return [
      {
        id: addressName,
        name: addressName,
        content: '// ERROR: Failed to find the code for this contract',
        readOnly: true,
        language: 'solidity',
      },
    ]
  }

  return codeResponse.data.sources.map((source) => ({
    id: source.name,
    name: source.name,
    content: source.code,
    readOnly: true,
    language: 'solidity' as const,
  }))
}
