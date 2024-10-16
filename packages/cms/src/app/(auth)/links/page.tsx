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
  const allLinks = (await db.externalBridge.getAll())
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter((bridge) => {
      if (!searchParams.search) return true
      const search = (searchParams.search as string).toLowerCase()
      return (
        bridge.name.toLowerCase().includes(search) ||
        bridge.type?.toLowerCase().includes(search)
      )
    })
  const count = allLinks.length
  const pagination = getServerPagination({
    count,
    searchParams,
  })
  const links = allLinks.slice(
    pagination.skip,
    pagination.skip + pagination.take,
  )

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">Links</h1>
        <Link href="/links/new">
          <Button size="sm">Add Link</Button>
        </Link>
      </div>
      {links.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no links
            </h3>
            <p className="text-sm text-muted-foreground">
              You can add a links by clicking the button below.
            </p>
            <Link href="/links/new">
              <Button className="mt-4">Add Link</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Handler</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {links
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>{link.name}</TableCell>
                    <TableCell>{link.type ?? 'None'}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/links/${link.id}`} key={link.id}>
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
