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

export default async function Page(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const searchParams = await props.searchParams
  const allEntities = (await db.entity.getAll())
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter((entity) => {
      if (!searchParams.search) return true
      const search = (searchParams.search as string).toLowerCase()
      return entity.name.toLowerCase().includes(search)
    })
  const count = allEntities.length
  const pagination = getServerPagination({
    count,
    searchParams,
  })
  const entities = allEntities.slice(
    pagination.skip,
    pagination.skip + pagination.take,
  )

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">Links</h1>
        <Link href="/entities/new">
          <Button size="sm">Add Entity</Button>
        </Link>
      </div>
      {entities.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no entities
            </h3>
            <p className="text-muted-foreground text-sm">
              You can add a entities by clicking the button below.
            </p>
            <Link href="/entities/new">
              <Button className="mt-4">Add Entity</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {entities
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((entity) => (
                  <TableRow key={entity.id}>
                    <TableCell>{entity.name}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/entities/${entity.id}`} key={entity.id}>
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
