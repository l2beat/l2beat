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
  const tokens = await db.token.getAll()

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Tokens</h1>
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
            <Button className="mt-4">Add Token</Button>
          </div>
        </div>
      ) : (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Network Id</TableHead>
                <TableHead>Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens
                .sort((a, b) => a.address.localeCompare(b.address))
                .map((token) => (
                  <TableRow key={token.id}>
                    <TableCell className="font-mono">{token.id}</TableCell>
                    <TableCell>{token.networkId}</TableCell>
                    <TableCell>{token.address}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  )
}
