import { UnixTime } from '@l2beat/shared-pure'
import type { Plan, RouterOutputs } from '@l2beat/token-backend'
import { useMutation, useQuery } from '@tanstack/react-query'
import { TrashIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ButtonWithSpinner } from '~/components/ButtonWithSpinner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
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
            <ButtonWithSpinner
              variant="destructive"
              className="mt-2"
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
          </div>
        </TabsContent>
        <TabsContent value="relations">
          <div className="space-y-4">
            <TokenRelationsSection
              title="Outgoing relations"
              description="This token is the source/from token."
              otherTokenHeader="To token"
              direction="outgoing"
              entries={relations?.outgoing ?? []}
              loading={areRelationsLoading}
            />
            <TokenRelationsSection
              title="Incoming relations"
              description="This token is the target/to token."
              otherTokenHeader="From token"
              direction="incoming"
              entries={relations?.incoming ?? []}
              loading={areRelationsLoading}
            />
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}

type TokenRelationsResponse = RouterOutputs['deployedTokens']['getRelations']
type TokenRelationEntry = TokenRelationsResponse['incoming'][number]

function TokenRelationsSection({
  title,
  description,
  otherTokenHeader,
  direction,
  entries,
  loading,
}: {
  title: string
  description: string
  otherTokenHeader: string
  direction: 'outgoing' | 'incoming'
  entries: TokenRelationEntry[]
  loading: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
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
                <TableHead>{otherTokenHeader}</TableHead>
                <TableHead>Plugin</TableHead>
                <TableHead>Burn</TableHead>
                <TableHead>Mint</TableHead>
                <TableHead>Bridge type</TableHead>
                <TableHead>Transfer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map(({ relation, otherToken }) => (
                <TableRow
                  key={[
                    relation.tokenFromChain,
                    relation.tokenFromAddress,
                    relation.tokenToChain,
                    relation.tokenToAddress,
                    relation.plugin,
                    String(relation.sourceWasBurned),
                    String(relation.destinationWasMinted),
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
                      <span className="font-medium">Missing token</span>
                    )}
                    <div className="break-all text-muted-foreground text-xs">
                      {otherToken
                        ? otherToken.address
                        : formatRelationEndpoint(relation, direction)}
                    </div>
                  </TableCell>
                  <TableCell className="align-top">{relation.plugin}</TableCell>
                  <TableCell>
                    <BooleanMark value={relation.sourceWasBurned} />
                  </TableCell>
                  <TableCell>
                    <BooleanMark value={relation.destinationWasMinted} />
                  </TableCell>
                  <TableCell className="align-top">
                    {relation.bridgeType ?? 'none'}
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
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

function BooleanMark({ value }: { value: boolean }) {
  return (
    <span
      className={
        value ? 'font-medium text-green-600' : 'font-medium text-destructive'
      }
      title={String(value)}
    >
      {value ? '✓' : '✕'}
    </span>
  )
}

function formatRelationEndpoint(
  relation: TokenRelationEntry['relation'],
  direction: 'outgoing' | 'incoming',
) {
  if (direction === 'outgoing') {
    return `${relation.tokenToChain}:${relation.tokenToAddress}`
  }
  return `${relation.tokenFromChain}:${relation.tokenFromAddress}`
}
