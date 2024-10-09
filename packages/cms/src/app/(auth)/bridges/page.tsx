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

export default async function Page() {
  const bridges = await db.externalBridge.getAll()

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Bridges</h1>
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
                <TableHead>Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bridges
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((bridge) => (
                  <TableRow key={bridge.id}>
                    <TableCell className="font-mono">{bridge.id}</TableCell>
                    <TableCell>{bridge.name}</TableCell>
                    <TableCell>{bridge.type}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  )
}
