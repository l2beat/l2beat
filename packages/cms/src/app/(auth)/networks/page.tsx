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
  const allNetworks = (await db.network.getAll())
    .filter((network) => {
      if (!searchParams.search) return true
      const search = (searchParams.search as string).toLowerCase()
      return (
        network.name.toLowerCase().includes(search) ||
        network.chainId.toString().includes(search) ||
        network.coingeckoId?.toLowerCase().includes(search)
      )
    })
    .sort((a, b) => a.name.localeCompare(b.name))
  const count = allNetworks.length
  const pagination = getServerPagination({
    count,
    searchParams,
  })
  const networks = allNetworks.slice(
    pagination.skip,
    pagination.skip + pagination.take,
  )

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">Networks</h1>
        <Link href="/networks/new">
          <Button size="sm">Add Network</Button>
        </Link>
      </div>
      {networks.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no networks
            </h3>
            <p className="text-sm text-muted-foreground">
              You can add a network by clicking the button below.
            </p>
            <Button className="mt-4">Add Network</Button>
          </div>
        </div>
      ) : (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Chain ID</TableHead>
                <TableHead>CoinGecko ID</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {networks
                .sort((a, b) => a.chainId - b.chainId)
                .map((network) => (
                  <TableRow key={network.id}>
                    <TableCell>{network.name}</TableCell>
                    <TableCell>
                      {network.chainId} (0x{network.chainId.toString(16)})
                    </TableCell>
                    <TableCell>{network.coingeckoId}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/networks/${network.id}`} key={network.id}>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="size-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TableControls count={allNetworks.length} />
        </div>
      )}
    </>
  )
}
