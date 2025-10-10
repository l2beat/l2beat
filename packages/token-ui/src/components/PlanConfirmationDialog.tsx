import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { type Command, type Plan, tokenService } from '~/mock/MockTokenService'
import { assertUnreachable } from '~/utils/assertUnreachable'
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
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: executePlan, isPending } = useMutation({
    mutationFn: async (plan: Plan) => tokenService.execute(plan),
    onSuccess: () => {
      if (!plan) return
      onSuccess?.()
      switch (plan.intent.type) {
        case 'AddAbstractTokenIntent':
          toast.success(
            <span>
              Token added successfully.{' '}
              <Link
                to={`/tokens/${plan.intent.abstractToken.id}`}
                className="underline"
              >
                View token
              </Link>
            </span>,
          )
          queryClient.invalidateQueries({ queryKey: ['abstractTokens'] })
          break
        case 'AddDeployedTokenIntent':
          toast.success(
            <span>
              Token added successfully.{' '}
              <Link
                to={`/tokens/${plan.intent.deployedToken.id}`}
                className="underline"
              >
                View token
              </Link>
            </span>,
          )
          queryClient.invalidateQueries({ queryKey: ['abstractTokens'] })
          break
        case 'DeleteAbstractTokenIntent':
          toast.success('Abstract token deleted successfully')
          queryClient.invalidateQueries({ queryKey: ['abstractTokens'] })
          queryClient.invalidateQueries({
            queryKey: ['token', plan.intent.abstractTokenId],
          })
          navigate('/')
          break
        case 'DeleteDeployedTokenIntent':
          toast.success('Deployed token deleted successfully')
          queryClient.invalidateQueries({ queryKey: ['abstractTokens'] })
          queryClient.invalidateQueries({
            queryKey: ['token', plan.intent.deployedTokenId],
          })
          navigate('/')
          break
        case 'UpdateAbstractTokenIntent':
          toast.success('Abstract token updated successfully')
          queryClient.invalidateQueries({ queryKey: ['abstractTokens'] })
          queryClient.invalidateQueries({
            queryKey: ['token', plan.intent.abstractToken.id],
          })
          break
        case 'UpdateDeployedTokenIntent':
          toast.success('Deployed token updated successfully')
          queryClient.invalidateQueries({ queryKey: ['abstractTokens'] })
          queryClient.invalidateQueries({
            queryKey: ['token', plan.intent.deployedToken.id],
          })
          break
        default:
          assertUnreachable(plan.intent)
      }

      setPlan(undefined)
    },
    onError: () => {
      toast.error('Plan execution failed')
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
              {JSON.stringify(command.abstractToken, null, 2)}
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
              {JSON.stringify(command.deployedToken, null, 2)}
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
              {JSON.stringify(command.abstractToken, null, 2)}
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
              {JSON.stringify(command.deployedToken, null, 2)}
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
              {JSON.stringify(command.before, null, 2)}
            </TooltipContent>
          </Tooltip>{' '}
          will be{' '}
          <Tooltip>
            <TooltipTrigger className="underline">updated</TooltipTrigger>
            <TooltipContent className="p-0">
              <Diff differences={diff(command.before, command.after)} />
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
              {JSON.stringify(command.before, null, 2)}
            </TooltipContent>
          </Tooltip>{' '}
          will be{' '}
          <Tooltip>
            <TooltipTrigger className="underline">updated</TooltipTrigger>
            <TooltipContent className="p-0">
              <Diff differences={diff(command.before, command.after)} />
            </TooltipContent>
          </Tooltip>
        </li>
      )
    default:
      assertUnreachable(command)
  }
}
