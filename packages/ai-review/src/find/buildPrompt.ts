export interface PromptInput {
  instructions: string
  title: string
  body: string
  baseSha: string
  headSha: string
}

export function buildPrompt(input: PromptInput): string {
  return [
    input.instructions.trim(),
    '',
    '## PR title',
    input.title.trim() || '(none)',
    '',
    '## PR description',
    input.body.trim() || '(none)',
    '',
    '## Commits',
    `base: ${input.baseSha}`,
    `head: ${input.headSha}`,
  ].join('\n')
}
