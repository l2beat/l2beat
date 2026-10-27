export const PROVIDER_IDS = ['claude', 'codex'] as const
export type ProviderId = (typeof PROVIDER_IDS)[number]

interface Provider {
  name: string
  // The ACP adapter, run through npx unless the environment variable names
  // an installed one.
  adapter: string
  adapterEnv: string
  signIn: string
}

export const PROVIDERS: Record<ProviderId, Provider> = {
  claude: {
    name: 'Claude Code',
    adapter: '@agentclientprotocol/claude-agent-acp@0.95.0',
    adapterEnv: 'L2B_CLAUDE_ACP',
    signIn: 'Run `claude` in a terminal and log in, then start a new chat.',
  },
  codex: {
    name: 'Codex',
    adapter: '@agentclientprotocol/codex-acp@2.2.2',
    adapterEnv: 'L2B_CODEX_ACP',
    signIn: 'Run `codex login` in a terminal, then start a new chat.',
  },
}

export function adapterCommand(provider: ProviderId): {
  command: string
  args: string[]
} {
  const { adapter, adapterEnv } = PROVIDERS[provider]
  const installed = process.env[adapterEnv]
  if (installed !== undefined && installed.length > 0) {
    return { command: installed, args: [] }
  }
  return { command: 'npx', args: ['--yes', adapter] }
}
