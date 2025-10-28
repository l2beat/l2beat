import { assertUnreachable } from '@l2beat/shared-pure'
import type { Command, Plan } from '@l2beat/token-backend'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '~/react-query/trpc'
import { diff } from '~/utils/getDiff'
import { getDeployedTokenDisplayId } from '~/utils/getDisplayId'
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
  const utils = api.useUtils()
  const navigate = useNavigate()

  function invalidateAbstractTokenQueries() {
    utils.tokens.getAllAbstractTokens.invalidate()
    utils.tokens.getAllAbstractTokensWithDeployedTokens.invalidate()
    utils.tokens.getAbstractById.invalidate()
    utils.tokens.search.invalidate()
  }

  function invalidateDeployedTokenQueries() {
    utils.tokens.getAllAbstractTokensWithDeployedTokens.invalidate()
    utils.tokens.getAbstractById.invalidate()
    utils.tokens.getDeployedByChainAndAddress.invalidate()
    utils.tokens.search.invalidate()
    utils.tokens.checkIfDeployedTokenExists.invalidate()
  }

  const { mutate: executePlan, isPending } = api.plan.execute.useMutation({
    onSuccess: () => {
      if (!plan) return
      onSuccess?.()
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
                to={`/tokens/${getDeployedTokenDisplayId(plan.intent.record)}`}
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
        default:
          assertUnreachable(plan.intent)
      }

      setPlan(undefined)
    },
  })

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
      // Would be nice to show the diff

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
    case 'DeleteAllAbstractTokensCommand':
      return <li>All abstract tokens will be deleted</li>
    case 'DeleteAllDeployedTokensCommand':
      return <li>All deployed tokens will be deleted</li>
    default:
      assertUnreachable(command)
  }
}
