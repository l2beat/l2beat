import { UnixTime } from '@l2beat/shared-pure'
import type { Plan, RouterOutputs } from '@l2beat/token-backend'
import { useMutation, useQuery } from '@tanstack/react-query'
import { BanIcon, TrashIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ButtonWithSpinner } from '~/components/ButtonWithSpinner'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/core/Dialog'
import { Label } from '~/components/core/Label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/core/Table'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/core/Tabs'
import { Textarea } from '~/components/core/TextArea'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/Tooltip'
import {
  DeployedTokenForm,
  DeployedTokenSchema,
  setDeployedTokenExistsError,
} from '~/components/forms/DeployedTokenForm'
import { LoadingState } from '~/components/LoadingState'
import { PlanConfirmationDialog } from '~/components/PlanConfirmationDialog'
import { useQueryState } from '~/hooks/useQueryState'
import { AppLayout } from '~/layouts/AppLayout'
import type { DeployedToken } from '~/mock/types'
import { useTRPC } from '~/react-query/trpc'
import { dateTimeInputToUnixTimestamp } from '~/utils/dateTimeInputToUnixTimestamp'
import { validateResolver } from '~/utils/validateResolver'

export function DeployedTokenPage() {
  const trpc = useTRPC()
  const { chain, address } = useParams()
  const { data } = useQuery(
    trpc.deployedTokens.findByChainAndAddress.queryOptions(
      {
        chain: chain ?? '',
        address: address ?? '',
      },
      {
        enabled: chain !== '' && address !== '',
      },
    ),
  )

  if (!chain || !address || data === null) {
    return <Navigate to="/not-found" replace />
  }

  return (
    <AppLayout>
      {data === undefined ? (
        <LoadingState className="h-full" />
      ) : (
        <DeployedTokenView token={data} />
      )}
    </AppLayout>
  )
}

function DeployedTokenView({ token }: { token: DeployedToken }) {
  const trpc = useTRPC()
  const [plan, setPlan] = useState<Plan | undefined>(undefined)

  const [abstractTokenId] = useQueryState('abstractTokenId', '')
  const form = useForm<DeployedTokenSchema>({
    resolver: validateResolver(DeployedTokenSchema),
    defaultValues: {
      ...token,
      abstractTokenId: token.abstractTokenId ?? undefined,
      comment: token.comment ?? undefined,
      deploymentTimestamp: UnixTime.toDate(token.deploymentTimestamp)
        .toISOString()
        .slice(0, -5),
      metadata: token.metadata ?? undefined,
    },
  })

  const { data: abstractTokens, isLoading: areAbstractTokensLoading } =
    useQuery(trpc.abstractTokens.getAll.queryOptions())
  const { data: relations, isLoading: areRelationsLoading } = useQuery(
    trpc.deployedTokens.getRelations.queryOptions({
      chain: token.chain,
      address: token.address,
    }),
  )
  const { data: mintingPlugins, isLoading: areMintingPluginsLoading } =
    useQuery(
      trpc.deployedTokens.getMintingPlugins.queryOptions({
        chain: token.chain,
        address: token.address,
      }),
    )

  useEffect(() => {
    if (abstractTokenId) {
      form.setValue('abstractTokenId', abstractTokenId, { shouldDirty: true })
    }
  }, [abstractTokenId, form.setValue])

  const { mutate: planMutate, isPending: isPending } = useMutation(
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

  const { data: chains, isLoading: isLoadingChains } = useQuery(
    trpc.chains.getAll.queryOptions(),
  )

  function onSubmit(values: DeployedTokenSchema) {
    if (deployedTokenExistsLoading) return
    if (deployedTokenExists) {
      setDeployedTokenExistsError(form)
      return
    }
    planMutate({
      type: 'UpdateDeployedTokenIntent',
      pk: {
        address: values.address,
        chain: values.chain,
      },
      update: {
        abstractTokenId: values.abstractTokenId || null,
        comment: values.comment || null,
        decimals: values.decimals,
        symbol: values.symbol,
        deploymentTimestamp: dateTimeInputToUnixTimestamp(
          values.deploymentTimestamp,
        ),
        metadata: values.metadata ?? undefined,
      },
    })
  }

  const chain = form.watch('chain')
  const address = form.watch('address')
  const { data: deployedTokenExists, isLoading: deployedTokenExistsLoading } =
    useQuery(
      trpc.deployedTokens.checkIfExists.queryOptions(
        {
          chain,
          address,
        },
        {
          enabled:
            !!chain &&
            !!address &&
            (address !== form.formState.defaultValues?.address ||
              chain !== form.formState.defaultValues?.chain),
        },
      ),
    )

  useEffect(() => {
    if (deployedTokenExistsLoading) return
    if (address === token.address && chain === token.chain) {
      form.setValue('address', token.address)
      form.setValue('chain', token.chain)
      return
    }
    if (deployedTokenExists) {
      setDeployedTokenExistsError(form)
    } else {
      form.clearErrors('address')
      form.clearErrors('chain')
    }
  }, [
    deployedTokenExists,
    deployedTokenExistsLoading,
    form,
    address,
    chain,
    token.address,
    token.chain,
  ])

  return (
    <>
      <PlanConfirmationDialog
        plan={plan}
        setPlan={setPlan}
        onSuccess={() => {
          form.reset(form.getValues())
        }}
      />
      <Tabs defaultValue="details" className="mx-auto w-full max-w-5xl gap-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="relations">Relations</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <div className="flex w-full gap-2">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Deployed Token
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DeployedTokenForm
                  form={form}
                  onSubmit={onSubmit}
                  isFormDisabled={isPending}
                  tokenDetails={{
                    data: deployedTokenExists
                      ? {
                          error: {
                            type: 'already-exists',
                            message:
                              'Deployed token with given address and chain already exists',
                          },
                          data: undefined,
                          warnings: [],
                        }
                      : undefined,
                    loading: deployedTokenExistsLoading,
                  }}
                  abstractTokens={{
                    data: abstractTokens,
                    loading: areAbstractTokensLoading,
                  }}
                  chains={{
                    data: chains,
                    loading: isLoadingChains,
                  }}
                  autofill={undefined}
                >
                  <ButtonWithSpinner
                    isLoading={isPending}
                    disabled={
                      Object.keys(form.formState.dirtyFields).length === 0
                    }
                    className="w-full"
                    type="submit"
                  >
                    Update
                  </ButtonWithSpinner>
                </DeployedTokenForm>
              </CardContent>
            </Card>
            <div className="mt-2 flex flex-col gap-2">
              <ButtonWithSpinner
                variant="destructive"
                size="icon"
                onClick={() => {
                  planMutate({
                    type: 'DeleteDeployedTokenIntent',
                    pk: {
                      address: token.address,
                      chain: token.chain,
                    },
                  })
                }}
                isLoading={isPending}
              >
                <TrashIcon />
              </ButtonWithSpinner>
              <DenylistTokenButton
                isPending={isPending}
                onConfirm={(reason) => {
                  planMutate({
                    type: 'AddTokenToDenylistIntent',
                    pk: {
                      address: token.address,
                      chain: token.chain,
                    },
                    reason,
                  })
                }}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="relations">
          <div className="space-y-4">
            <MintingPluginsSection
              plugins={mintingPlugins ?? []}
              loading={areMintingPluginsLoading}
            />
            <TokenRelationsSection
              entries={relations ?? []}
              loading={areRelationsLoading}
            />
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}

/**
 * Bans the token's address from TokenDB via `AddTokenToDenylistIntent` —
 * one plan that adds the denylist entry and deletes the token, so the blast
 * radius shows in the confirmation dialog. Relations stay recorded (they
 * are observations); the relations graph filters them out.
 */
function DenylistTokenButton({
  isPending,
  onConfirm,
}: {
  isPending: boolean
  onConfirm: (reason: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <BanIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Denylist — delete the token and ban the address from ever being
          re-catalogued
        </TooltipContent>
      </Tooltip>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Denylist this token?</DialogTitle>
            <DialogDescription>
              The deployed token will be deleted, ingestion will refuse to
              catalogue the address again, and the relations graph will hide its
              edges. The deleted record stays recoverable from history. The ban
              can be lifted on the Denylist page.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-1">
            <Label htmlFor="denylist-reason">Reason</Label>
            <Textarea
              id="denylist-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Test token used by team X"
            />
          </div>
          <DialogFooter>
            <ButtonWithSpinner
              variant="destructive"
              isLoading={isPending}
              disabled={!reason.trim()}
              onClick={() => {
                setOpen(false)
                onConfirm(reason)
              }}
            >
              Denylist
            </ButtonWithSpinner>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

type TokenRelationsResponse = RouterOutputs['deployedTokens']['getRelations']
type TokenRelationEntry = TokenRelationsResponse[number]

// A symmetric (burnAndMint) pair also shows as minted — both of its endpoints
// are — so the minted description must not claim anything about the other
// side; the Bridge type column is where the mechanism shows.
const RELATION_ROLE_DESCRIPTIONS: Record<TokenRelationEntry['role'], string> = {
  locked: 'Locked here, minted there',
  minted: 'Minted on this side',
  unknown: 'Locked side not observed',
}

// The same answer the Role column gives one relation at a time, summarized by
// `getMintingPluginsFor`: seeing both agree is a cheap correctness check.
function MintingPluginsSection({
  plugins,
  loading,
}: {
  plugins: string[]
  loading: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Minting plugins</CardTitle>
        <CardDescription>
          Plugins observed minting this token — the relations below in which
          this token's role is minted.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingState className="h-10" />
        ) : plugins.length === 0 ? (
          <div className="text-muted-foreground text-sm">
            No plugin has been observed minting this token.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {plugins.map((plugin) => (
              <Badge key={plugin} variant="secondary">
                {plugin}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// A single list: relations are facts about a pair of tokens, not directed
// edges, so there is no inbound/outbound split. What differs per relation is
// this token's role, which the Role column states.
function TokenRelationsSection({
  entries,
  loading,
}: {
  entries: TokenRelationEntry[]
  loading: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Relations</CardTitle>
        <CardDescription>
          Non-swapping interop transfers observed between this token and another
          one.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingState className="h-48" />
        ) : entries.length === 0 ? (
          <div className="text-muted-foreground text-sm">No relations.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Other token</TableHead>
                <TableHead>This token's role</TableHead>
                <TableHead>Plugin</TableHead>
                <TableHead>Bridge type</TableHead>
                <TableHead>Transfer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map(
                ({
                  relation,
                  role,
                  otherEndpoint,
                  otherToken,
                  otherEndpointDenylisted,
                }) => (
                  <TableRow
                    key={[
                      relation.tokenAChain,
                      relation.tokenAAddress,
                      relation.tokenBChain,
                      relation.tokenBAddress,
                      relation.plugin,
                      relation.bridgeType,
                    ].join(':')}
                  >
                    <TableCell className="min-w-56 whitespace-normal align-top">
                      {otherToken ? (
                        <Link
                          to={`/tokens/${otherToken.chain}/${otherToken.address}`}
                          className="font-medium underline"
                        >
                          {otherToken.symbol} on {otherToken.chain}
                        </Link>
                      ) : (
                        <span className="font-medium">
                          {otherEndpointDenylisted
                            ? 'Denylisted address'
                            : 'Missing token'}
                        </span>
                      )}
                      {otherEndpointDenylisted && (
                        <span
                          className="ml-1"
                          title="This address is denylisted — the observed relation is shown, but the address is banned from TokenDB"
                        >
                          🚫
                        </span>
                      )}
                      <div className="break-all text-muted-foreground text-xs">
                        {otherToken
                          ? otherToken.address
                          : `${otherEndpoint.chain}:${otherEndpoint.address}`}
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="font-medium">{role}</div>
                      <div className="text-muted-foreground text-xs">
                        {RELATION_ROLE_DESCRIPTIONS[role]}
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      {relation.plugin}
                    </TableCell>
                    <TableCell className="align-top">
                      {relation.bridgeType}
                    </TableCell>
                    <TableCell className="whitespace-normal align-top">
                      <details>
                        <summary className="cursor-pointer text-muted-foreground text-xs">
                          JSON
                        </summary>
                        <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-muted p-2 text-xs">
                          {JSON.stringify(relation.transfer, null, 2)}
                        </pre>
                      </details>
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
