/**
 * `validate <prepared> <baseline> <worklist> <plan>`: static plan validation.
 *
 * The only command that prints to stdout, because its findings are its
 * output: the authoring loop feeds them back to the model, and a human
 * runs it to see why a hand-written plan is refused.
 */
import { Library } from '../library/Library'
import type { Finding } from '../plan/Finding'
import { validatePlan } from '../plan/validatePlan'
import type { CommandContext } from './context'
import { readBaseline, readPlan, readPrepared, readWorklist } from './files'

export interface ValidateArgs {
  preparedFile: string
  baselineFile: string
  worklistFile: string
  planFile: string
}

export async function validateCommand(
  ctx: CommandContext,
  args: ValidateArgs,
): Promise<Finding[]> {
  const prepared = readPrepared(args.preparedFile)
  const baseline = readBaseline(args.baselineFile)
  const worklist = readWorklist(args.worklistFile)
  const plan = readPlan(args.planFile)
  const library = Library.load()
  try {
    const findings = validatePlan(plan, {
      prepared,
      baseline,
      worklist,
      library,
    })
    ctx.logger.info('Validated', {
      errors: countErrors(findings),
      warnings: findings.length - countErrors(findings),
    })
    return findings
  } finally {
    await library.close()
  }
}

export function countErrors(findings: Finding[]): number {
  return findings.filter((finding) => finding.severity === 'error').length
}

export function formatFinding(finding: Finding): string {
  return `${finding.severity}: ${finding.path}: ${finding.message}`
}
