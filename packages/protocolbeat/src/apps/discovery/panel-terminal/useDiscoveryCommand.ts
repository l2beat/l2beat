import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTerminalStore } from './store'

export function useDiscoveryCommand() {
  const toastId = 'command.discovery'
  const { killCommand, discover, setDevMode, command } = useTerminalStore()
  const queryClient = useQueryClient()

  function handleKillCommand() {
    killCommand()
    toast.dismiss(toastId)
  }

  async function handleDiscoverCommand(project: string, devMode?: boolean) {
    toast.loading('Discovery has started', { id: toastId })
    if (devMode !== undefined) {
      setDevMode(devMode)
    }

    if (command.inFlight) {
      toast.error('Discovery already in progress', { id: toastId })
      return
    }

    const isOk = await discover(project)

    queryClient.invalidateQueries({ queryKey: ['projects', project] })
    queryClient.invalidateQueries({ queryKey: ['config-sync-status', project] })

    if (isOk) {
      toast.success('Discovery finished successfully', { id: toastId })
    } else {
      toast.error('Discovery failed', { id: toastId })
    }
  }

  return {
    killCommand: handleKillCommand,
    discover: handleDiscoverCommand,
  }
}
