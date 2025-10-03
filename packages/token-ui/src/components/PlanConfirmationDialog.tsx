import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { type Command, type Plan, tokenService } from '~/mock/MockTokenService'
import { assertUnreachable } from '~/utils/assertUnreachable'
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

  const { mutate: executePlan } = useMutation({
    mutationFn: async (plan: Plan) => tokenService.execute(plan),
    onSuccess: () => {
      onSuccess?.()
      if (!plan) return
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
                {plan?.commands.map((command) => (
                  <CommandItem key={command.type} command={command} />
                ))}
              </ul>
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => executePlan(plan)}>Confirm</Button>
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
    default:
      assertUnreachable(command)
  }
}
