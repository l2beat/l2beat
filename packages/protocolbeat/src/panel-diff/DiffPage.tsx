import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getFlatSource } from '../api/api'
import { DiffView } from '../components/editor/DiffView'

export function DiffPage() {
  const { address1, address2 } = useParams()
  if (!address1 || !address2) {
    throw new Error('Cannot use component outside of project page!')
  }

  const response = useQuery({
    queryKey: ['flat-source', address1, address2],
    queryFn: async () => {
      return [
        await getFlatSource(address1),
        await getFlatSource(address2),
      ] as const
    },
  })

  if (response.isPending) {
    return <div>Loading</div>
  }

  if (response.isError) {
    return <div>Error</div>
  }

  const [leftCode, rightCode] = response.data
  return (
    <DiffView
      leftAddress={address1}
      leftCode={leftCode}
      rightAddress={address2}
      rightCode={rightCode}
    />
  )
}
