import type { AnalyzerResultApiResponse } from '@l2beat/shared-pure'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { getAnalyzers, getCode, runAnalyzer } from '../../../api/api'
import { ActionNeededState } from '../../../components/ActionNeededState'
import { Button } from '../../../components/Button'
import { ErrorState } from '../../../components/ErrorState'
import { LoadingState } from '../../../components/LoadingState'
import { Select } from '../../../components/Select'
import { useProjectData } from '../hooks/useProjectData'
import { getDefaultSourceName, hasSourceCode } from '../utils/sourceCode'

export function AnalyzePanel() {
  const { project, selectedAddress, projectResponse, selected } =
    useProjectData()

  const hasCode = hasSourceCode(selected)

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

  const analyzersResponse = useQuery({
    queryKey: ['analyzers'],
    queryFn: getAnalyzers,
    enabled: false,
    retry: 1,
  })

  const [preferredAnalyzer, setPreferredAnalyzer] = useState<string>()
  const [preferredSource, setPreferredSource] = useState<string>()

  const sources = codeResponse.data?.sources ?? []
  const analyzers = analyzersResponse.data ?? []

  const selectedSource = useMemo(
    () =>
      sources.some((source) => source.name === preferredSource)
        ? preferredSource
        : getDefaultSourceName(sources),
    [preferredSource, sources],
  )

  const selectedAnalyzer = useMemo(
    () =>
      analyzers.some((analyzer) => analyzer.id === preferredAnalyzer)
        ? preferredAnalyzer
        : analyzers[0]?.id,
    [preferredAnalyzer, analyzers],
  )

  const selectedAnalyzerDetails = useMemo(
    () => analyzers.find((analyzer) => analyzer.id === selectedAnalyzer),
    [analyzers, selectedAnalyzer],
  )

  const analyzeMutation = useMutation({
    mutationFn: (input: {
      address: string
      analyzerId: string
      entrypoint: string
    }) =>
      runAnalyzer(project, input.address, input.analyzerId, input.entrypoint),
  })

  if (projectResponse.isError) {
    return <ErrorState />
  }

  if (projectResponse.isPending) {
    return <LoadingState />
  }

  if (selected === undefined) {
    return <ActionNeededState message="Select a contract" />
  }

  if (!hasCode) {
    return <ActionNeededState message="Selected entry has no code" />
  }

  const canRun =
    selectedAddress !== undefined &&
    selectedAnalyzer !== undefined &&
    selectedSource !== undefined &&
    !codeResponse.isPending &&
    !analyzeMutation.isPending

  return (
    <div className="flex h-full flex-col gap-4 p-4 text-coffee-100">
      <div className="grid gap-3">
        <Button
          className="w-fit"
          disabled={analyzersResponse.isFetching}
          onClick={() => analyzersResponse.refetch()}
        >
          {analyzersResponse.isFetching
            ? 'Discovering...'
            : 'Discover analyzers'}
        </Button>

        {analyzersResponse.isError && (
          <div className="text-aux-red text-xs">
            {analyzersResponse.error.message}
          </div>
        )}

        <div className="grid gap-1">
          <div className="font-bold text-coffee-200 text-xs uppercase">
            Analyzer
          </div>
          <Select.Root
            value={selectedAnalyzer}
            onValueChange={setPreferredAnalyzer}
            disabled={analyzers.length === 0}
          >
            <Select.Trigger placeholder="Select analyzer" />
            <Select.Content>
              {analyzers.map((analyzer) => (
                <Select.Item key={analyzer.id} value={analyzer.id}>
                  {analyzer.title}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          {selectedAnalyzerDetails && (
            <p className="text-coffee-200 text-xs leading-relaxed">
              {selectedAnalyzerDetails.description}
            </p>
          )}
        </div>

        <div className="grid gap-1">
          <div className="font-bold text-coffee-200 text-xs uppercase">
            Entrypoint
          </div>
          <Select.Root
            value={selectedSource}
            onValueChange={setPreferredSource}
            disabled={sources.length === 0 || codeResponse.isPending}
          >
            <Select.Trigger placeholder="Select entrypoint" />
            <Select.Content>
              {sources.map((source) => (
                <Select.Item key={source.name} value={source.name}>
                  {source.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          {codeResponse.isError && (
            <div className="text-aux-red text-xs">Failed to load code</div>
          )}
        </div>

        <Button
          className="w-fit"
          disabled={!canRun}
          onClick={() => {
            if (!selectedAddress || !selectedAnalyzer || !selectedSource) {
              return
            }
            analyzeMutation.mutate({
              address: selectedAddress,
              analyzerId: selectedAnalyzer,
              entrypoint: selectedSource,
            })
          }}
        >
          {analyzeMutation.isPending ? 'Running...' : 'Run'}
        </Button>
      </div>

      {analyzeMutation.variables?.address === selectedAddress && (
        <ResultView
          result={analyzeMutation.data}
          error={analyzeMutation.error}
        />
      )}
    </div>
  )
}

function ResultView(props: {
  result: AnalyzerResultApiResponse | undefined
  error: Error | null
}) {
  if (props.error) {
    return (
      <pre className="whitespace-pre-wrap text-aux-red text-xs">
        {props.error.message}
      </pre>
    )
  }

  if (!props.result) {
    return null
  }

  if (props.result.status === 'error') {
    return (
      <pre className="whitespace-pre-wrap text-aux-red text-xs">
        {props.result.error.message}
        {props.result.error.details
          ? `\n\n${JSON.stringify(props.result.error.details, null, 2)}`
          : ''}
      </pre>
    )
  }

  return (
    <div className="grid gap-3">
      <pre className="whitespace-pre-wrap text-sm leading-relaxed">
        {props.result.output.text}
      </pre>
      {props.result.output.data && (
        <pre className="overflow-x-auto whitespace-pre text-coffee-200 text-xs">
          {JSON.stringify(props.result.output.data, null, 2)}
        </pre>
      )}
    </div>
  )
}
