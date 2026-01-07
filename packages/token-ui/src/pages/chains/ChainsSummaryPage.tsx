import { LinkIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '~/components/core/Empty'
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/core/Table'
import { ExternalLink } from '~/components/ExternalLink'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { api } from '~/react-query/trpc'
import type { ChainApi } from '../../../../database/dist/repositories/ChainRepository'

export function ChainsSummaryPage() {
  const { data, isLoading: isChainsLoading } = api.chains.getAll.useQuery()
  return (
    <AppLayout>
      <Card className="h-[calc(100vh-16px)] overflow-y-auto">
        <CardHeader>
          <CardTitle>Chains</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          {isChainsLoading ? (
            <LoadingState className="h-full" />
          ) : data?.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <LinkIcon />
                </EmptyMedia>
                <EmptyTitle>No chains</EmptyTitle>
                <EmptyContent>
                  <Button asChild>
                    <Link to="/tokens/new?tab=deployed">Add new</Link>
                  </Button>
                </EmptyContent>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Chain ID</TableHead>
                  <TableHead>Explorer URL</TableHead>
                  <TableHead>Aliases</TableHead>
                  <TableHead>APIs</TableHead>
                </TableRow>
                {data?.map((chain) => (
                  <TableRow key={chain.name}>
                    <TableCell>
                      <Link to={`/chains/${chain.name}`} className="underline">
                        {chain.name}
                      </Link>
                    </TableCell>
                    <TableCell>{chain.chainId}</TableCell>
                    <TableCell>
                      {chain.explorerUrl && (
                        <ExternalLink href={chain.explorerUrl}>
                          {chain.explorerUrl}
                        </ExternalLink>
                      )}
                    </TableCell>
                    <TableCell>{chain.aliases}</TableCell>
                    <TableCell>
                      <ApiCell api={chain.apis} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableHeader>
            </Table>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  )
}

function ApiCell({ api }: { api: ChainApi[] | null }) {
  return (
    <div className="flex gap-1">
      {api?.map((api) => (
        <Badge key={api.type}>{api.type}</Badge>
      ))}
    </div>
  )
}
