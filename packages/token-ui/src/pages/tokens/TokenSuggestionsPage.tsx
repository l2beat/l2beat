import { CoinsIcon, ListPlusIcon, PlusIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '~/components/core/Button'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import {
  Empty,
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
import { ExplorerLink } from '~/components/ExplorerLink'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { api } from '~/react-query/trpc'
import { buildUrlWithParams } from '~/utils/buildUrlWithParams'

export function TokenSuggestionsPage() {
  const navigate = useNavigate()
  const { data: suggestions, isLoading: isLoadingSuggestions } =
    api.deployedTokens.suggestions.useQuery()
  const { data: chains, isLoading: isLoadingChains } =
    api.chains.getAll.useQuery()

  return (
    <AppLayout>
      <Card className="h-[calc(100vh-16px)]">
        <CardHeader>
          <CardTitle>By matching abstract tokens</CardTitle>
          {suggestions && suggestions.length > 0 && (
            <CardAction>
              <Button
                variant="outline"
                onClick={() =>
                  navigate('/tokens/new?tab=deployed', {
                    state: { queue: suggestions },
                  })
                }
              >
                <ListPlusIcon className="size-4" />
                Add all to queue
              </Button>
            </CardAction>
          )}
        </CardHeader>
        <CardContent className="h-full overflow-y-auto">
          {isLoadingSuggestions || isLoadingChains ? (
            <LoadingState className="h-full" />
          ) : suggestions?.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CoinsIcon />
                </EmptyMedia>
                <EmptyTitle>No suggestions found</EmptyTitle>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">#</TableHead>
                  <TableHead>Chain</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Suggested abstract token</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
                {suggestions?.map((suggestion, index) => {
                  const chain = chains?.find(
                    (chain) => chain.name === suggestion.chain,
                  )
                  return (
                    <TableRow
                      key={`${suggestion.chain}-${suggestion.address}-${suggestion.abstractTokenId}`}
                    >
                      <TableCell className="text-right tabular-nums">
                        {index + 1}
                      </TableCell>
                      <TableCell>{suggestion.chain}</TableCell>
                      <TableCell>
                        {chain?.explorerUrl ? (
                          <ExplorerLink
                            explorerUrl={chain?.explorerUrl}
                            value={suggestion.address}
                            type="address"
                          />
                        ) : (
                          suggestion.address
                        )}
                      </TableCell>
                      <TableCell>{suggestion.abstractTokenId}</TableCell>
                      <TableCell>
                        <Button
                          variant="link"
                          size="icon"
                          className="size-5"
                          asChild
                        >
                          <Link
                            to={buildUrlWithParams('/tokens/new', {
                              tab: 'deployed',
                              chain: suggestion.chain,
                              address: suggestion.address,
                              abstractTokenId: suggestion.abstractTokenId,
                            })}
                          >
                            <PlusIcon />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableHeader>
            </Table>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  )
}
