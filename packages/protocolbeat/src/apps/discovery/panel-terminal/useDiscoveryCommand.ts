import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTerminalStore } from './store'

export function useDiscoveryCommand() {
  const toastId = 'command.discovery'
  const { killCommand, discover, setDevMode } = useTerminalStore()
  const queryClient = useQueryClient()

  function handleKillCommand() {
    killCommand()
    toast.dismiss(toastId)
  }

  async function handleDiscoverCommand(project: string, devMode?: boolean) {
    toast.loading('Discovery has started', { id: toastId })
    const isOk = await discover(project)

    if (devMode !== undefined) {
      setDevMode(devMode)
    }

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
