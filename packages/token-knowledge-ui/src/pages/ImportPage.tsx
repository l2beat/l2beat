import { Button } from '~/components/Button'
import { api } from '~/react-query/trpc'

export function ImportPage() {
  const importMutation = api.importFacts.useMutation()
  const clearMutation = api.clearFacts.useMutation()

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

      {importMutation.error && (
        <p className="text-destructive text-sm">
          Error: {importMutation.error.message}
        </p>
      )}
      {importMutation.data && (
        <p className="text-muted-foreground text-sm">
          Imported {importMutation.data.imported} new facts, skipped{' '}
          {importMutation.data.skipped} duplicates.
        </p>
      )}

      {clearMutation.error && (
        <p className="text-destructive text-sm">
          Error: {clearMutation.error.message}
        </p>
      )}
      {clearMutation.data && (
        <p className="text-muted-foreground text-sm">
          Cleared {clearMutation.data.deleted} facts.
        </p>
      )}
    </div>
  )
}
