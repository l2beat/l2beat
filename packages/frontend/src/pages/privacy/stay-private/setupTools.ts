import type {
  PrivacyAdviceGuideStep,
  PrivacyAdviceTool,
} from '~/server/features/privacy/advice/getPrivacyAdviceData'

/** The tools the steps of a path link, each once, in step order. */
export function getPathTools(
  steps: PrivacyAdviceGuideStep[],
): PrivacyAdviceTool[] {
  const seen = new Set<string>()
  return steps
    .flatMap((step) => step.tools)
    .filter((tool) => !seen.has(tool.name) && seen.add(tool.name))
}

/**
 * What a path asks for outside the app, in a few words: its tools, and the
 * name of every outside step that links none, e.g. "Check step". Empty when
 * the path stays inside the app.
 */
export function getOutsideNames(steps: PrivacyAdviceGuideStep[]): string[] {
  return [
    ...getPathTools(steps).map((tool) => tool.name),
    ...steps
      .filter((step) => step.outside && step.tools.length === 0)
      .map((step) => `${step.name} step`),
  ]
}
