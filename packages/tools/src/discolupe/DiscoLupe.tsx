import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'
import { SortDirection, Table } from './Table'
import { DiscoLupeProject, fetchData } from './data'

export interface Props {
  searchParams: { sort?: string; dir?: SortDirection }
  projects: DiscoLupeProject[]
}

export function DiscoLupe() {
  const result = useQuery({
    queryKey: ['discolupe-data'],
    queryFn: fetchData,
  })

  const [searchParams, _] = useSearchParams()

  if (result.isPending) {
    return <div>Loading...</div>
  }

  if (result.isError) {
    return <div>{`Error... ${result.error}`}</div>
  }

  const sort = {
    byColumnId: searchParams.get('sort') ?? 'qx',
    direction: (searchParams.get('dir') as SortDirection) ?? 'asc',
  }

  return (
    <div className="h-full overflow-x-scroll">
      <Table projects={result.data.data.projects} sort={sort} />
    </div>
  )
}
