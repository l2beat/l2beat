import type { ApiChatProvider } from '../../types'

export const CHAT_PROVIDERS = ['claude', 'codex'] as const

interface Provider {
  // The ACP adapter, run through npx unless the environment variable names
  // an installed one.
  adapter: string
  adapterEnv: string
  signIn: string
}

const PROVIDERS: Record<ApiChatProvider, Provider> = {
  claude: {
    adapter: '@agentclientprotocol/claude-agent-acp@0.95.0',
    adapterEnv: 'L2B_CLAUDE_ACP',
    signIn: 'Run `claude` in a terminal and log in, then start a new chat.',
  },
  codex: {
    adapter: '@agentclientprotocol/codex-acp@2.2.2',
    adapterEnv: 'L2B_CODEX_ACP',
    signIn: 'Run `codex login` in a terminal, then start a new chat.',
  },
}

export function adapterCommand(provider: ApiChatProvider): {
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

export function signInHint(provider: ApiChatProvider): string {
  return PROVIDERS[provider].signIn
}
