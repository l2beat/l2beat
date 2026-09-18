import type { Address } from 'viem'
import type { PlannedCalls } from './calls'
import type { AttestationNetworkConfig } from './easConfig'
import { type AttestPlan, describePlan } from './plan'
import { getSafeUrl } from './safeTx'

export interface ReportInput {
  network: AttestationNetworkConfig
  safe: Address
  plan: AttestPlan
  calls: PlannedCalls
  /** Unix seconds; the payload's own timestamp, so the file dates the run it describes. */
  generatedAt: number
}

/**
 * The one file a run produces: what to send, and what the bytes say. Anything
 * that is true of every run - how the Safe UI works, how to review calldata,
 * how to migrate - lives in README.md instead, so this stays short enough to
 * read in full before signing.
 */
export function buildReport(input: ReportInput): string {
  const { network, safe, plan, calls } = input
  const out: string[] = []
  const add = (...lines: string[]) => out.push(...lines, '')

  add(`# Attest crops - ${network.name}`)
  add(
    `${new Date(input.generatedAt * 1000).toISOString()} · ${describePlan(plan)}`,
    '',
    '**Nothing has been sent.** Executing the calls below is what changes the chain.',
  )

  add('## Steps')
  const steps = [
    `Open the Safe \`${safe}\` → New transaction → Transaction Builder: ${getSafeUrl(network, safe)}`,
    'Turn on **Custom data**, leave ABI empty. Paste `to` and `data` below, value `0`.',
  ]
  if (calls.foreign.length > 0) {
    steps.push(
      'Send the call under *From the old attester* separately, from that address - the Safe may not.',
    )
  }
  steps.push(
    'Execute, then record each hash: `pnpm dev crops-record --tx <hash>`',
    'Then: `pnpm --filter @l2beat/config format:fix`, rebuild, `crops-verify`, commit.',
  )
  add(...steps.map((step, i) => `${i + 1}. ${step}`))
  add('Details, and how to review calldata before signing: see README.md.')

  if (calls.safe.length === 0 && calls.foreign.length === 0) {
    add('## Nothing to send')
    return join(out)
  }

  add('## From the Safe')
  if (calls.safe.length === 0) {
    add('Nothing.')
  } else {
    for (const call of calls.safe) {
      add(
        ...describeCall(
          call.label,
          [
            ['to', call.to],
            ['value', '0'],
          ],
          call,
        ),
      )
    }
  }

  if (calls.foreign.length > 0) {
    add('## From the old attester')
    for (const call of calls.foreign) {
      add(call.reason)
      add(
        ...describeCall(
          call.label,
          [
            ['from', call.from, 'must be this address'],
            ['to', call.to],
            ['value', '0'],
          ],
          call,
        ),
      )
    }
  }

  return join(out)
}

/** The note sits outside the code span, so copying the field copies only it. */
function describeCall(
  label: string,
  fields: [string, string, string?][],
  call: { data: string; details: string[] },
): string[] {
  return [
    `### ${label}`,
    '',
    ...fields.map(
      ([name, value, note]) =>
        `- **${name}** \`${value}\`${note ? ` — ${note}` : ''}`,
    ),
    '',
    'Decoded:',
    '',
    '```',
    ...call.details,
    '```',
    '',
    'Calldata:',
    '',
    '```',
    call.data,
    '```',
  ]
}

function join(lines: string[]): string {
  return `${lines.join('\n').trimEnd()}\n`
}
