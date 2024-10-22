import { type TokenMetaRecord } from '@l2beat/database'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { TableControls } from '~/components/table-controls'
import { Button } from '~/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { db } from '~/db'
import { getServerPagination } from '~/lib/server-pagination/server'

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const networks = await db.network.getAll()
  // TODO: proper pagination support in repository
  const tokenMeta = (await db.tokenMeta.getBySource('Aggregate')).reduce(
    (acc, meta) => {
      acc[meta.tokenId] = meta
      return acc
    },
    {} as Record<string, TokenMetaRecord>,
  )
  const allTokens = (await db.token.getAll())
    .sort((a, b) => {
      const aMeta = tokenMeta[a.id]
      const bMeta = tokenMeta[b.id]
      if (!aMeta?.name && !bMeta?.name) return 0
      if (!aMeta?.name) return 1
      if (!bMeta?.name) return -1
      return aMeta.name.localeCompare(bMeta.name)
    })
    // TODO: this should be probably moved (or done in DB)
    .filter((token) => {
      if (!searchParams.search) return true
      const search = (searchParams.search as string).toLowerCase()
      const meta = tokenMeta[token.id]
      return (
        token.address.toLowerCase().includes(search) ||
        meta?.name?.toLowerCase().includes(search) ||
        meta?.symbol?.toLowerCase().includes(search)
      )
    })

  const count = allTokens.length
  const pagination = getServerPagination({
    count,
    searchParams,
  })
  const tokens = allTokens.slice(
    pagination.skip,
    pagination.skip + pagination.take,
  )

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">Tokens</h1>
        <Link href="/tokens/new">
          <Button size="sm">Add Token</Button>
        </Link>
      </div>
      {tokens.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no tokens
            </h3>
            <p className="text-sm text-muted-foreground">
              You can add a token by clicking the button below.
            </p>
            <Link href="/tokens/new">
              <Button className="mt-4">Add Token</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead className="w-full">Network</TableHead>
                <TableHead>Address</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens
                .sort((a, b) => a.address.localeCompare(b.address))
                .map((token) => (
                  <TableRow key={token.id}>
                    <TableCell className="whitespace-nowrap">
                      {tokenMeta[token.id]?.name ?? 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {tokenMeta[token.id]?.symbol ?? 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {networks.find((n) => n.id === token.networkId)?.name ??
                        `Unknown ${token.networkId}`}
                    </TableCell>
                    <TableCell className="font-mono">{token.address}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/tokens/${token.id}`} key={token.id}>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="size-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TableControls count={count} />
        </div>
      )}
    </>
  )
}
