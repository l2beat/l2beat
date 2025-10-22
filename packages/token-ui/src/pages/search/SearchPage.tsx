import { UnixTime } from '@l2beat/shared-pure'
import { ArrowRightIcon, CoinsIcon } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
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
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/core/Table'
import { LoadingText } from '~/components/LoadingText'
import { AppLayout } from '~/layouts/AppLayout'
import type { AbstractToken, DeployedToken } from '~/mock/types'
import { api } from '~/react-query/trpc'
import { getDeployedTokenDisplayId } from '~/utils/getDisplayId'

export function SearchPage() {
  const { search } = useParams()
  const { data } = api.tokens.search.useQuery(search ?? '', {
    enabled: search !== '',
  })

  return (
    <AppLayout>
      <Card>
        <CardHeader>
          <CardTitle>Abstract Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.abstractTokens ? (
            <AbstractTokensTable tokens={data.abstractTokens} />
          ) : (
            <LoadingText />
          )}
        </CardContent>
      </Card>
      <Card className="mt-2">
        <CardHeader>
          <CardTitle>Deployed Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.deployedTokens ? (
            <DeployedTokensTable tokens={data.deployedTokens} />
          ) : (
            <LoadingText />
          )}
        </CardContent>
      </Card>
    </AppLayout>
  )
}

function AbstractTokensTable({ tokens }: { tokens: AbstractToken[] }) {
  if (tokens.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CoinsIcon />
          </EmptyMedia>
          <EmptyTitle>No Abstract Tokens</EmptyTitle>
          <EmptyContent>
            <Button asChild>
              <Link to="/tokens/new">Add new</Link>
            </Button>
          </EmptyContent>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Id</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Coingecko Id</TableHead>
          <TableHead>Issuer</TableHead>
          <TableHead>Icon Url</TableHead>
          <TableHead>Coingecko Listing Timestamp</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {tokens.map((token) => {
          return (
            <TableRow key={token.id}>
              <TableCell>{token.id}</TableCell>
              <TableCell>{token.symbol}</TableCell>
              <TableCell>{token.category}</TableCell>
              <TableCell>{token.coingeckoId ?? '-'}</TableCell>
              <TableCell>{token.issuer ?? 'unknown'}</TableCell>
              <TableCell>{token.iconUrl ?? '-'}</TableCell>
              <TableCell>
                {token.coingeckoListingTimestamp !== null
                  ? UnixTime.toYYYYMMDD(token.coingeckoListingTimestamp)
                  : '-'}
              </TableCell>
              <TableCell>
                <Button asChild variant="outline">
                  <Link to={`/tokens/${token.id}`}>
                    <ArrowRightIcon />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

function DeployedTokensTable({ tokens }: { tokens: DeployedToken[] }) {
  if (tokens.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CoinsIcon />
          </EmptyMedia>
          <EmptyTitle>No Deployed Tokens</EmptyTitle>
          <EmptyContent>
            <Button asChild>
              <Link to="/tokens/new?tab=deployed">Add new</Link>
            </Button>
          </EmptyContent>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead>Chain</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Abstract Token Id</TableHead>
          <TableHead>Decimals</TableHead>
          <TableHead>Deployment Timestamp</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {tokens.map((token) => {
          return (
            <TableRow key={getDeployedTokenDisplayId(token)}>
              <TableCell>{token.symbol}</TableCell>
              <TableCell>{token.chain}</TableCell>
              <TableCell>{token.address}</TableCell>
              <TableCell>
                {token.abstractTokenId ? (
                  <Link
                    to={`/tokens/${token.abstractTokenId}`}
                    className="underline"
                  >
                    {token.abstractTokenId}
                  </Link>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>{token.decimals}</TableCell>
              <TableCell>
                {UnixTime.toDate(token.deploymentTimestamp).toISOString()}
              </TableCell>
              <TableCell>
                <Button asChild variant="link">
                  <Link to={`/tokens/${token.chain}/${token.address}`}>
                    <ArrowRightIcon />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
