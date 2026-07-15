import type { ClaudeCodeClient } from '../clients/ClaudeCodeClient'
import type { TileResult } from '../evaluation/types'

export async function investigate(
  claude: ClaudeCodeClient,
  failing: TileResult[],
  controls: string[],
): Promise<string> {
  return await claude.run(buildPrompt(failing, controls))
}

function buildPrompt(failing: TileResult[], controls: string[]): string {
  const failures = failing.map(describeFailure).join('\n\n')
  const scope =
    controls.length > 0
      ? `\nThe dashboard filters every tile by: ${controls.join(' and ')}. Apply the same filter clause(s) in every query you run, or you will be looking at the wrong environment's data.\n`
      : ''

  return `You are doing the morning ops check for L2BEAT. The "Control Plane" Kibana dashboard aggregates health tiles for all backend features; each tile counts or aggregates log documents in Elasticsearch. The following tiles are failing over the dashboard window:

${failures}
${scope}

Investigate the root cause by querying Elasticsearch with curl. The environment variables ELASTICSEARCH_URL and ELASTICSEARCH_API_KEY are already set, so query like this (single quotes around the body, env vars expanded by the shell):

curl -s -H "Authorization: ApiKey $ELASTICSEARCH_API_KEY" -H 'Content-Type: application/json' "$ELASTICSEARCH_URL/<index-pattern>/_search" -d '<json body>'

Use the index pattern listed for each failing tile. The tile queries above tell you which log messages and fields matter. Useful moves:
- Fetch sample documents (sort by @timestamp desc, size 3-5) to discover the document shape before aggregating; common fields are message/msg, log.level, service.name, labels.*, parameters.*, chain (with .keyword subfields for exact match).
- Fetch representative error documents and read their messages and stack traces.
- Break the failing signal down by service.name.keyword or chain.keyword to localize it.
- Use date_histogram or narrowed time ranges to find when the problem started.
- Ground every claim in query results; never invent log lines or numbers.

Your final message is posted verbatim to Discord as the investigation report:
- Use Discord markdown, keep it under 3000 characters.
- Lead with a one-line verdict per failing tile (root cause or best hypothesis).
- Follow with key evidence: counts, affected services/chains, when it started, representative error messages.
- End with proposed next actions (what to fix, restart, or watch).
- Output only the report itself — no preamble about what you did.`
}

function describeFailure(result: TileResult): string {
  const { tile } = result
  const lines = [
    `- ${tile.section ? `[${tile.section}] ` : ''}${tile.title}: ${result.status.toUpperCase()} at ${result.formatted}`,
    `  Index: ${tile.index}, window: ${tile.timeFrom} → ${tile.timeTo}`,
  ]
  if (tile.query) {
    lines.push(`  Tile query (KQL): ${tile.query}`)
  }
  if (tile.runtimeMappings) {
    lines.push(
      `  This data view defines runtime fields — include this top-level key in every _search body against this index: "runtime_mappings": ${JSON.stringify(tile.runtimeMappings)}`,
    )
  }
  const metric = tile.columns[tile.metricColumnId]
  if (metric) {
    lines.push(
      `  Metric: ${metric.operationType}${metric.sourceField ? ` of ${metric.sourceField}` : ''}` +
        (metric.params?.tinymathAst || metric.operationType === 'formula'
          ? ' (formula tile)'
          : '') +
        (metric.reducedTimeRange
          ? ` — computed over the last ${metric.reducedTimeRange} only`
          : ''),
    )
    if (metric.filter?.query) {
      lines.push(`  Metric filter (KQL): ${metric.filter.query}`)
    }
  }
  const failingBuckets = (result.buckets ?? []).filter(
    (bucket) => bucket.status === 'red' || bucket.status === 'amber',
  )
  if (failingBuckets.length > 0) {
    lines.push(
      `  Failing ${tile.breakdown?.field}: ${failingBuckets
        .map((bucket) => `${bucket.key}=${bucket.value}`)
        .join(', ')}`,
    )
  }
  const stops = tile.palette?.params?.colorStops
  if (stops) {
    lines.push(
      `  Color thresholds: ${stops
        .map((stop) => `${stop.color} from ${stop.stop ?? 'min'}`)
        .join(', ')}`,
    )
  }
  return lines.join('\n')
}
