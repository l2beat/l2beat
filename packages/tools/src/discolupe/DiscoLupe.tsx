import { useQuery } from '@tanstack/react-query'
import { Table } from './Table'
import { DiscoLupeProject, fetchData } from './data'

export interface Props {
  projects: DiscoLupeProject[]
}

export function DiscoLupe() {
  const result = useQuery({
    queryKey: ['discolupe-data'],
    queryFn: fetchData,
  })

  if (result.isPending) {
    return <div>Loading...</div>
  }

  if (result.isError) {
    return <div>{`Error... ${result.error}`}</div>
  }

  return (
    <div className="h-full overflow-x-scroll">
      <Table projects={result.data.data.projects} />
    </div>
  )
}
