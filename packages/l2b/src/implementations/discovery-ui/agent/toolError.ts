// A mistake in the agent's call: the agent reads the message, fixes what
// the details name and calls again.
export class ToolError extends Error {
  constructor(
    message: string,
    readonly details: Record<string, string | string[]> = {},
  ) {
    super(message, { cause: details })
  }

  describe(): string {
    const lines = [this.message]
    for (const [key, value] of Object.entries(this.details)) {
      if (typeof value === 'string') {
        lines.push(`  ${key}: ${value}`)
        continue
      }
      if (value.length > 0) {
        lines.push(`  ${key}:`, ...value.map((item) => `    ${item}`))
      }
    }
    return lines.join('\n')
  }
}
