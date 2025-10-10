import { useNavigate, useParams } from 'react-router-dom'
import { AppLayout } from '~/layouts/AppLayout'
import { api } from '~/react-query/trpc'
import { AbstractTokenView } from './AbstractTokenView'
import { DeployedTokenView } from './DeployedTokenView'

export function TokensPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data } = api.tokens.getById.useQuery(id ?? '', {
    enabled: id !== '',
  })
  if (!id || data === null) {
    navigate('/not-found')
    return
  }

  return (
    <AppLayout>
      {data === undefined ? (
        <div className="text-muted-foreground text-sm">Loading...</div>
      ) : data.type === 'abstract' ? (
        <AbstractTokenView token={data.token} />
      ) : (
        <DeployedTokenView token={data.token} />
      )}
    </AppLayout>
  )
}
