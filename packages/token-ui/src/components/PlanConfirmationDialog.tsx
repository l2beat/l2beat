import { assertUnreachable } from '@l2beat/shared-pure'
import type { Command, Plan } from '@l2beat/token-backend'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useTRPC } from '~/react-query/trpc'
import { diff } from '~/utils/getDiff'
import { ButtonWithSpinner } from './ButtonWithSpinner'
import { Button } from './core/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './core/Dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from './core/Tooltip'
import { Diff } from './Diff'

export function PlanConfirmationDialog({
  plan,
  setPlan,
  onSuccess,
}: {
  plan: Plan | undefined
  setPlan: (plan: Plan | undefined) => void
  onSuccess?: () => void
}) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  function invalidateAbstractTokenQueries() {
    queryClient.invalidateQueries(trpc.abstractTokens.getAll.queryFilter())
    queryClient.invalidateQueries(
      trpc.abstractTokens.getAllWithDeployedTokens.queryFilter(),
    )
    queryClient.invalidateQueries(trpc.abstractTokens.getById.queryFilter())
    queryClient.invalidateQueries(trpc.abstractTokens.checks.queryFilter())
    queryClient.invalidateQueries(trpc.search.all.queryFilter())
  }

  function invalidateDeployedTokenQueries() {
    invalidateAbstractTokenQueries()
    queryClient.invalidateQueries(
      trpc.deployedTokens.findByChainAndAddress.queryFilter(),
    )
    queryClient.invalidateQueries(
      trpc.deployedTokens.checkIfExists.queryFilter(),
    )
    queryClient.invalidateQueries(
      trpc.deployedTokens.getByChainAndAddress.queryFilter(),
    )
    queryClient.invalidateQueries(
      trpc.deployedTokens.getRelations.queryFilter(),
    )
    queryClient.invalidateQueries(trpc.deployedTokens.checks.queryFilter())
    queryClient.invalidateQueries(
      trpc.deployedTokens.getSuggestionsByCoingeckoId.queryFilter(),
    )
    queryClient.invalidateQueries(
      trpc.deployedTokens.getCoingeckoSuggestions.queryFilter(),
    )
    queryClient.invalidateQueries(
      trpc.deployedTokens.getSuggestionsByPartialTransfers.queryFilter(),
    )
  }

  const { mutate: executePlan, isPending } = useMutation(
    trpc.plan.execute.mutationOptions({
      onSuccess: () => {
        if (!plan) return
        onSuccess?.()
        queryClient.invalidateQueries(trpc.tokenDbHistory.getPage.queryFilter())
        switch (plan.intent.type) {
          case 'AddAbstractTokenIntent':
            toast.success(
              <span>
                Token added successfully.{' '}
                <Link
                  to={`/tokens/${plan.intent.record.id}`}
                  className="underline"
                >
                  View token
                </Link>
              </span>,
            )
            invalidateAbstractTokenQueries()
            break
          case 'AddDeployedTokenIntent':
            toast.success(
              <span>
                Token added successfully.{' '}
                <Link
                  to={`/tokens/${plan.intent.record.chain}/${plan.intent.record.address}`}
                  className="underline"
                >
                  View token
                </Link>
              </span>,
            )
            invalidateDeployedTokenQueries()
            break
          case 'DeleteAbstractTokenIntent':
            toast.success('Abstract token deleted successfully')
            invalidateAbstractTokenQueries()
            navigate('/')
            break
          case 'DeleteDeployedTokenIntent':
            toast.success('Deployed token deleted successfully')
            invalidateDeployedTokenQueries()
            navigate('/')
            break
          case 'UpdateAbstractTokenIntent':
            toast.success('Abstract token updated successfully')
            invalidateAbstractTokenQueries()
            break
          case 'UpdateDeployedTokenIntent':
            toast.success('Deployed token updated successfully')
            invalidateDeployedTokenQueries()
            break
          case 'AddTokenRelationIntent':
            toast.success('Token relation added successfully')
            invalidateDeployedTokenQueries()
            break
          case 'UpdateTokenRelationIntent':
            toast.success('Token relation updated successfully')
            invalidateDeployedTokenQueries()
            break
          case 'DeleteTokenRelationIntent':
            toast.success('Token relation deleted successfully')
            invalidateDeployedTokenQueries()
            break
          default:
            assertUnreachable(plan.intent)
        }

        setPlan(undefined)
      },
    }),
  )

  if (!plan) {
    return null
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && setPlan(undefined)}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription asChild>
            <div>
              This plan assumes the following actions will be taken:
              <ul className="list-inside list-decimal pl-4">
                {plan?.commands.map((command, index) => (
                  <CommandItem key={index} command={command} />
                ))}
              </ul>
            </div>
          </DialogDescription>
          <DialogFooter>
            <ButtonWithSpinner
              onClick={() => executePlan(plan)}
              isLoading={isPending}
            >
              Confirm
            </ButtonWithSpinner>
            <Button variant="outline" onClick={() => setPlan(undefined)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

function CommandItem({ command }: { command: Command }) {
  switch (command.type) {
    case 'AddAbstractTokenCommand':
      return (
        <li>
          <Tooltip>
            <TooltipTrigger className="underline">
              Abstract token
            </TooltipTrigger>
            <TooltipContent className="whitespace-pre">
              {JSON.stringify(command.record, null, 2)}
            </TooltipContent>
          </Tooltip>{' '}
          will be added
        </li>
      )
    case 'AddDeployedTokenCommand':
      return (
        <li>
          <Tooltip>
            <TooltipTrigger className="underline">
              Deployed token
            </TooltipTrigger>
            <TooltipContent className="whitespace-pre">
              {JSON.stringify(command.record, null, 2)}
            </TooltipContent>
          </Tooltip>{' '}
          will be added
        </li>
      )
    case 'DeleteAbstractTokenCommand':
      return (
        <li>
          <Tooltip>
            <TooltipTrigger className="underline">
              Abstract token
            </TooltipTrigger>
            <TooltipContent className="whitespace-pre">
              {/* TODO: Fix this */}
              {JSON.stringify(command, null, 2)}
            </TooltipContent>
          </Tooltip>{' '}
          will be deleted
        </li>
      )
    case 'DeleteDeployedTokenCommand':
      return (
        <li>
          <Tooltip>
            <TooltipTrigger className="underline">
              Deployed token
            </TooltipTrigger>
            <TooltipContent className="whitespace-pre">
              {/* TODO: Fix this */}
              {JSON.stringify(command, null, 2)}
            </TooltipContent>
          </Tooltip>{' '}
          will be deleted
        </li>
      )
    case 'UpdateAbstractTokenCommand':
      return (
        <li>
          <Tooltip>
            <TooltipTrigger className="underline">
              Abstract token
            </TooltipTrigger>
            <TooltipContent className="whitespace-pre">
              {JSON.stringify(command.existing, null, 2)}
            </TooltipContent>
          </Tooltip>{' '}
          will be{' '}
          <Tooltip>
            <TooltipTrigger className="underline">updated</TooltipTrigger>
            <TooltipContent className="p-0">
              <Diff
                differences={diff(command.existing, {
                  ...command.existing,
                  ...command.update,
                })}
              />
            </TooltipContent>
          </Tooltip>
        </li>
      )
    case 'UpdateDeployedTokenCommand':
      return (
        <li>
          <Tooltip>
            <TooltipTrigger className="underline">
              Deployed token
            </TooltipTrigger>
            <TooltipContent className="whitespace-pre">
              {JSON.stringify(command.existing, null, 2)}
            </TooltipContent>
          </Tooltip>{' '}
          will be{' '}
          <Tooltip>
            <TooltipTrigger className="underline">updated</TooltipTrigger>
            <TooltipContent className="p-0">
              <Diff
                differences={diff(command.existing, {
                  ...command.existing,
                  ...command.update,
                })}
              />
            </TooltipContent>
          </Tooltip>
        </li>
      )
    case 'AddTokenRelationCommand':
      return (
        <li>
          <Tooltip>
            <TooltipTrigger className="underline">
              Token relation
            </TooltipTrigger>
            <TooltipContent className="whitespace-pre">
              {JSON.stringify(command.record, null, 2)}
            </TooltipContent>
          </Tooltip>{' '}
          will be added
        </li>
      )
    case 'UpdateTokenRelationCommand':
      return (
        <li>
          <Tooltip>
            <TooltipTrigger className="underline">
              Token relation
            </TooltipTrigger>
            <TooltipContent className="whitespace-pre">
              {JSON.stringify(command.existing, null, 2)}
            </TooltipContent>
          </Tooltip>{' '}
          will be{' '}
          <Tooltip>
            <TooltipTrigger className="underline">updated</TooltipTrigger>
            <TooltipContent className="p-0">
              <Diff
                differences={diff(command.existing, {
                  ...command.existing,
                  ...command.update,
                })}
              />
            </TooltipContent>
          </Tooltip>
        </li>
      )
    case 'DeleteTokenRelationCommand':
      return (
        <li>
          <Tooltip>
            <TooltipTrigger className="underline">
              Token relation
            </TooltipTrigger>
            <TooltipContent className="whitespace-pre">
              {JSON.stringify(command.existing, null, 2)}
            </TooltipContent>
          </Tooltip>{' '}
          will be deleted
        </li>
      )
    default:
      assertUnreachable(command)
  }
}
