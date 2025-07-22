import { useQuery } from '@tanstack/react-query'
import { ErrorState } from '../common/ErrorState'
import { LoadingState } from '../common/LoadingState'
import { fetchData } from './src/fetchData'
import type { DiscoLupeProject } from './src/model'
import { Table } from './Table'

export interface Props {
  projects: DiscoLupeProject[]
}

export function DiscoLupe() {
  const result = useQuery({
    queryKey: ['discolupe-data'],
    queryFn: fetchData,
  })

  if (result.isPending) {
    return <LoadingState />
  }

  if (result.isError) {
    return <ErrorState />
  }

  return (
    <div className="h-full overflow-x-scroll">
      <Table projects={result.data.data.projects} />
    </div>
  )
}
