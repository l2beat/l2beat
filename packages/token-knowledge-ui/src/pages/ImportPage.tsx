import { Button } from '~/components/Button'
import { useLog } from '~/hooks/useLog'
import { api } from '~/react-query/trpc'

export function ImportPage() {
  const { addLog } = useLog()
  const importMutation = api.importFacts.useMutation({
    onSuccess: (data) =>
      addLog(
        `Imported ${data.imported} new facts, skipped ${data.skipped} duplicates.`,
      ),
    onError: (e) => addLog(`Import error: ${e.message}`),
  })
  const clearMutation = api.clearFacts.useMutation({
    onSuccess: (data) => addLog(`Cleared ${data.deleted} facts.`),
    onError: (e) => addLog(`Clear error: ${e.message}`),
  })

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-medium text-muted-foreground text-sm">
        Import Transfer Facts
      </h2>
      <div className="flex gap-2">
        <Button
          onClick={() => importMutation.mutate()}
          disabled={importMutation.isPending}
        >
          {importMutation.isPending ? 'Importing...' : 'Import Facts'}
        </Button>
        <Button
          variant="destructive"
          onClick={() => clearMutation.mutate()}
          disabled={clearMutation.isPending}
        >
          {clearMutation.isPending ? 'Clearing...' : 'Clear Facts'}
        </Button>
      </div>
    </div>
  )
}
