import { ArrowRightIcon, CoinsIcon, ListPlusIcon, PlusIcon } from 'lucide-react'
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
  const { data: suggestions, isLoading } =
    api.deployedTokens.getSuggestionsByPartialTransfers.useQuery()

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
                    state: {
                      queue: suggestions.map((suggestion) => ({
                        chain: suggestion.chain,
                        address: suggestion.address,
                        abstractTokenId: suggestion.abstractToken.id,
                      })),
                    },
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
          {isLoading ? (
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
                  <TableHead>Transactions</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
                {suggestions?.map((suggestion, index) => {
                  return (
                    <TableRow
                      key={`${suggestion.chain}-${suggestion.address}-${suggestion.abstractToken.id}`}
                    >
                      <TableCell className="text-right tabular-nums">
                        {index + 1}
                      </TableCell>
                      <TableCell>{suggestion.chain}</TableCell>
                      <TableCell>
                        {suggestion.explorerUrl ? (
                          <ExplorerLink
                            explorerUrl={suggestion.explorerUrl}
                            value={suggestion.address}
                            type="address"
                          />
                        ) : (
                          suggestion.address
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              suggestion.abstractToken.iconUrl ??
                              '/images/token-placeholder.png'
                            }
                            className="size-5"
                          />
                          {suggestion.abstractToken.symbol}
                        </div>
                        {suggestion.abstractToken.issuer && (
                          <p>Issued by {suggestion.abstractToken.issuer}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <TransactionsCell txs={suggestion.txs} />
                      </TableCell>
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
                              abstractTokenId: suggestion.abstractToken.id,
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

function TransactionsCell({
  txs,
}: {
  txs: {
    srcTxHash: string | undefined
    srcChain: string
    srcExplorerUrl: string | undefined
    dstTxHash: string | undefined
    dstChain: string
    dstExplorerUrl: string | undefined
    transferId: string
    plugin: string
  }[]
}) {
  return txs.map((tx) => {
    return (
      <div key={tx.transferId} className="flex items-center gap-1">
        <span>{tx.plugin}:</span>
        {tx.srcExplorerUrl && tx.srcTxHash ? (
          <ExplorerLink
            explorerUrl={tx.srcExplorerUrl}
            value={tx.srcTxHash}
            type="tx"
          >
            {tx.srcChain}
          </ExplorerLink>
        ) : (
          <span>
            {tx.srcChain}:{tx.srcTxHash ?? '<no hash captured>'}
          </span>
        )}
        <ArrowRightIcon className="size-4" />{' '}
        {tx.dstExplorerUrl && tx.dstTxHash ? (
          <ExplorerLink
            explorerUrl={tx.dstExplorerUrl}
            value={tx.dstTxHash}
            type="tx"
          >
            {tx.dstChain}
          </ExplorerLink>
        ) : (
          <span>
            {tx.dstChain}:{tx.dstTxHash ?? '<no hash captured>'}
          </span>
        )}
      </div>
    )
  })
}
