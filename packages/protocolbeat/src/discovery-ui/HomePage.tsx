import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getProjects } from './api/api'

export function HomePage() {
  const result = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })

  if (result.isLoading) {
    return <div>Loading</div>
  }

  if (result.isError) {
    return <div>Error</div>
  }

  return (
    <div>
      <h1>Home</h1>
      <ol>
        {result.data.map((entry, i) => (
          <li key={i}>
            <Link to={`/ui/p/${entry.name}`}>
              {entry.name} ({entry.chains.length} chains)
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
