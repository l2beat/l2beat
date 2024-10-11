import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { TableControls } from '~/components/table-controls'
import { Button } from '~/components/ui/button'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '~/components/ui/table'
import { db } from '~/db'
import { getServerPagination } from '~/lib/server-pagination/server'

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const allBridges = await db.externalBridge.getAll()
  const count = allBridges.length
  const pagination = getServerPagination({
    count,
    searchParams,
  })
  const bridges = allBridges.slice(
    pagination.skip,
    pagination.skip + pagination.take,
  )

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">3rd Party Bridges</h1>
        <Link href="/bridges/new">
          <Button size="sm">Add Bridge</Button>
        </Link>
      </div>
      {bridges.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no bridges
            </h3>
            <p className="text-sm text-muted-foreground">
              You can add a bridge by clicking the button below.
            </p>
            <Button className="mt-4">Add Bridge</Button>
          </div>
        </div>
      ) : (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Handler</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {bridges
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((bridge) => (
                  <TableRow key={bridge.id}>
                    <TableCell className="font-mono">{bridge.id}</TableCell>
                    <TableCell>{bridge.name}</TableCell>
                    <TableCell>{bridge.type ?? 'None'}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/bridges/${bridge.id}`} key={bridge.id}>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="size-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TableControls count={allBridges.length} />
        </div>
      )}
    </>
  )
}
