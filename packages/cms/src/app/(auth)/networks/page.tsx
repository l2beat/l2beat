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
  const networks = await db.network.getAll()

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Networks</h1>
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
                <TableHead>Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>ChainId</TableHead>
                <TableHead>CoinGecko Id</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {networks
                .sort((a, b) => a.chainId - b.chainId)
                .map((network) => (
                  <TableRow key={network.id}>
                    <TableCell className="font-mono">{network.id}</TableCell>
                    <TableCell>{network.name}</TableCell>
                    <TableCell>
                      {network.chainId} (0x{network.chainId.toString(16)})
                    </TableCell>
                    <TableCell>{network.coingeckoId}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  )
}
