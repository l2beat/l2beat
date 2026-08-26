export interface PromptInput {
  instructions: string
  title: string
  body: string
  diff: string
  maxDiffChars: number
}

export function buildPrompt(input: PromptInput): string {
  const diff =
    input.diff.length > input.maxDiffChars
      ? `${input.diff.slice(0, input.maxDiffChars)}\n\n[diff truncated at ${input.maxDiffChars} chars; inspect the checkout for the rest]`
      : input.diff
  return [
    input.instructions.trim(),
    '',
    '## PR title',
    input.title.trim() || '(none)',
    '',
    '## PR description',
    input.body.trim() || '(none)',
    '',
    '## Diff',
    '```diff',
    diff,
    '```',
  ].join('\n')
}
