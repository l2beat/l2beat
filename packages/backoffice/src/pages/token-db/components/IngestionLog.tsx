/**
 * Renders the text form of an ingestion trace. The same text is persisted on
 * `TokenDbHistory.ingestionLog` (for the history detail sheet) and
 * pre-rendered into the `text` field of `IngestionTraceView` (for the queue
 * preview dialog), so both panels show it identically.
 */
export function IngestionLog({ log }: { log: string }) {
  return (
    <section className="space-y-1">
      <h3 className="font-medium text-sm">Ingestion log</h3>
      <pre className="max-w-full overflow-x-auto whitespace-pre-wrap rounded bg-muted p-2 font-mono text-xs">
        {log}
      </pre>
    </section>
  )
}
