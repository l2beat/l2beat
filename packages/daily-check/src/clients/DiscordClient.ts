const DISCORD_MESSAGE_LIMIT = 1900

/** Sends messages to a Discord webhook, splitting oversized content. */
export class DiscordClient {
  constructor(private readonly webhookUrl: string) {}

  async sendMessage(content: string): Promise<void> {
    for (const chunk of splitMessage(content, DISCORD_MESSAGE_LIMIT)) {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: chunk }),
      })
      if (!response.ok) {
        const body = await response.text()
        throw new Error(`Discord webhook returned ${response.status}: ${body}`)
      }
      // Stay under the webhook rate limit when sending multiple chunks.
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }
}

export function splitMessage(content: string, limit: number): string[] {
  if (content.length <= limit) {
    return [content]
  }

  const chunks: string[] = []
  let current = ''
  for (let line of content.split('\n')) {
    // A single line longer than the limit is hard-split.
    while (line.length > limit) {
      if (current) {
        chunks.push(current)
        current = ''
      }
      chunks.push(line.slice(0, limit))
      line = line.slice(limit)
    }
    if (current.length + line.length + 1 > limit) {
      chunks.push(current)
      current = ''
    }
    current = current ? `${current}\n${line}` : line
  }
  if (current) {
    chunks.push(current)
  }
  return chunks
}
