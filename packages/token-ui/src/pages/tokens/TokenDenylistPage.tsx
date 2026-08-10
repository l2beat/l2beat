import { UnixTime } from '@l2beat/shared-pure'
import type { Plan } from '@l2beat/token-backend'
import { useMutation, useQuery } from '@tanstack/react-query'
import { TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { ButtonWithSpinner } from '~/components/ButtonWithSpinner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import { Input } from '~/components/core/Input'
import { Label } from '~/components/core/Label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/core/Table'
import { LoadingState } from '~/components/LoadingState'
import { PlanConfirmationDialog } from '~/components/PlanConfirmationDialog'
import { AppLayout } from '~/layouts/AppLayout'
import { useTRPC } from '~/react-query/trpc'

export function TokenDenylistPage() {
  const trpc = useTRPC()
  const [plan, setPlan] = useState<Plan | undefined>(undefined)
  const [chain, setChain] = useState('')
  const [address, setAddress] = useState('')
  const [reason, setReason] = useState('')

  const { data: entries, isLoading } = useQuery(
    trpc.tokenDenylist.getAll.queryOptions(),
  )

  const { mutate: planMutate, isPending } = useMutation(
    trpc.plan.generate.mutationOptions({
      onSuccess: (data) => {
        if (data.outcome === 'success') {
          setPlan(data.plan)
        } else {
          toast.error(data.error)
        }
      },
    }),
  )

  return (
    <AppLayout>
      <PlanConfirmationDialog
        plan={plan}
        setPlan={setPlan}
        onSuccess={() => {
          setChain('')
          setAddress('')
          setReason('')
        }}
      />
      <div className="mx-auto w-full max-w-5xl space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Denylist an address</CardTitle>
            <CardDescription>
              Bans the address from TokenDB: the deployed token (if catalogued)
              and every relation touching the address are deleted, and ingestion
              refuses to observe it again. The address does not have to be
              catalogued. Everything deleted stays recoverable from history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-end gap-2">
              <div className="grid gap-1">
                <Label htmlFor="denylist-chain">Chain</Label>
                <Input
                  id="denylist-chain"
                  value={chain}
                  onChange={(e) => setChain(e.target.value)}
                  placeholder="arbitrum"
                />
              </div>
              <div className="grid min-w-96 gap-1">
                <Label htmlFor="denylist-address">Address</Label>
                <Input
                  id="denylist-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="0x…"
                />
              </div>
              <div className="grid min-w-64 flex-1 gap-1">
                <Label htmlFor="denylist-reason">Reason</Label>
                <Input
                  id="denylist-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Test token used by team X"
                />
              </div>
              <ButtonWithSpinner
                isLoading={isPending}
                disabled={!chain || !address || !reason.trim()}
                onClick={() =>
                  planMutate({
                    type: 'DenylistDeployedTokenIntent',
                    pk: { chain, address },
                    reason,
                  })
                }
              >
                Denylist
              </ButtonWithSpinner>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Denylisted addresses</CardTitle>
            <CardDescription>
              Removing an entry only lifts the ban — deleted tokens and
              relations are re-created by ingestion from live transfers, or
              manually from history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState className="h-48" />
            ) : !entries || entries.length === 0 ? (
              <div className="text-muted-foreground text-sm">
                No denylisted addresses.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Chain</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={`${entry.chain}:${entry.address}`}>
                      <TableCell className="align-top">{entry.chain}</TableCell>
                      <TableCell className="break-all align-top">
                        {entry.address}
                      </TableCell>
                      <TableCell className="whitespace-normal align-top">
                        {entry.reason}
                      </TableCell>
                      <TableCell className="align-top">
                        {UnixTime.toYYYYMMDD(entry.createdAt)}
                      </TableCell>
                      <TableCell className="align-top">
                        <ButtonWithSpinner
                          variant="destructive"
                          size="icon"
                          isLoading={isPending}
                          onClick={() =>
                            planMutate({
                              type: 'RemoveTokenDenylistEntryIntent',
                              pk: {
                                chain: entry.chain,
                                address: entry.address,
                              },
                            })
                          }
                        >
                          <TrashIcon />
                        </ButtonWithSpinner>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
