import { UnixTime } from '@l2beat/shared-pure'
import { CoinsIcon, LinkIcon } from 'lucide-react'
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
import { ExplorerLink } from '~/components/ExplorerLink'
import { ExternalLink } from '~/components/ExternalLink'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import type { AbstractToken, DeployedToken } from '~/mock/types'
import { api } from '~/react-query/trpc'
import type { ChainRecord } from '../../../../database/dist/repositories/ChainRepository'

export function SearchPage() {
  const { search } = useParams()
  const { data } = api.search.all.useQuery(search ?? '', {
    enabled: search !== '',
  })

  return (
    <AppLayout className="space-y-2">
      {!data ? (
        <LoadingState className="h-full" />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Abstract Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <AbstractTokensTable tokens={data.abstractTokens} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Deployed Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <DeployedTokensTable
                tokens={data.deployedTokens}
                chains={data.chains}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Chains</CardTitle>
            </CardHeader>
            <CardContent>
              <ChainsTable chains={data.chains} />
            </CardContent>
          </Card>
        </>
      )}
    </AppLayout>
  )
}

function ChainsTable({ chains }: { chains: ChainRecord[] }) {
  if (chains.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LinkIcon />
          </EmptyMedia>
          <EmptyTitle>No Chains</EmptyTitle>
          <EmptyContent>
            <Button asChild>
              <Link to="/chains/new">Add new</Link>
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
          <TableHead>Name</TableHead>
          <TableHead>Chain ID</TableHead>
          <TableHead>Explorer URL</TableHead>
          <TableHead>Aliases</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {chains.map((chain) => {
          return (
            <TableRow key={chain.name}>
              <TableCell>
                <Link to={`/chains/${chain.name}`} className="underline">
                  {chain.name}
                </Link>
              </TableCell>
              <TableCell>{chain.chainId}</TableCell>
              <TableCell>
                {chain.explorerUrl ? (
                  <ExternalLink href={chain.explorerUrl}>
                    {chain.explorerUrl}
                  </ExternalLink>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                {chain.aliases && chain.aliases.length > 0
                  ? chain.aliases.join(', ')
                  : '-'}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
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
          <TableHead>Issuer</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Coingecko Id</TableHead>
          <TableHead>Coingecko Listing Timestamp</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tokens.map((token) => {
          return (
            <TableRow key={token.id}>
              <TableCell>
                <Link to={`/tokens/${token.id}`} className="underline">
                  {token.id}
                </Link>
              </TableCell>
              <TableCell>{token.issuer ?? 'unknown'}</TableCell>
              <TableCell>
                <img
                  src={token.iconUrl ?? '/images/token-placeholder.png'}
                  width={24}
                  height={24}
                  className="mr-2 inline rounded-full"
                />
                <span>{token.symbol}</span>
              </TableCell>
              <TableCell>{token.category}</TableCell>
              <TableCell>{token.coingeckoId ?? '-'}</TableCell>
              <TableCell>
                {token.coingeckoListingTimestamp !== null
                  ? UnixTime.toYYYYMMDD(token.coingeckoListingTimestamp)
                  : '-'}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

function DeployedTokensTable({
  tokens,
  chains,
}: {
  tokens: DeployedToken[]
  chains: ChainRecord[]
}) {
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {tokens.map((token) => {
          const explorerUrl = chains.find(
            (chain) => chain.name === token.chain,
          )?.explorerUrl
          return (
            <TableRow key={`${token.chain}+${token.address}`}>
              <TableCell>
                <Link
                  to={`/tokens/${token.chain}/${token.address}`}
                  className="underline"
                >
                  {token.symbol}
                </Link>
              </TableCell>
              <TableCell>{token.chain}</TableCell>
              <TableCell>
                {token.address.startsWith('0x') && explorerUrl ? (
                  <ExplorerLink
                    explorerUrl={explorerUrl}
                    value={token.address}
                    type="address"
                  />
                ) : (
                  token.address
                )}
              </TableCell>
              <TableCell>
                {token.abstractTokenId && (
                  <Link
                    to={`/tokens/${token.abstractTokenId}`}
                    className="underline"
                  >
                    {token.abstractTokenId}
                  </Link>
                )}
              </TableCell>
              <TableCell>{token.decimals}</TableCell>
              <TableCell>
                {UnixTime.toDate(token.deploymentTimestamp).toISOString()}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
