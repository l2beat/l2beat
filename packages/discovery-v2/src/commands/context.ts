/**
 * What every command receives besides its arguments.
 *
 * Providers are created lazily: `worklist`, `validate` and `output` are pure
 * functions of files and must run without RPC keys or a cache file, while
 * `prepare`, `baseline` and `execute` need the network. Loading the env
 * happens right before the first provider is built, so nothing reads
 * `process.env` before `--env-file` has been honoured.
 *
 * The logger writes to stderr so stdout carries only what a command prints
 * on purpose (`validate`'s findings) and can be piped.
 */
import {
  formatPlain,
  type LogEntry,
  Logger,
  type LoggerTransport,
  utcTime,
} from '@l2beat/backend-tools'
import type { AllProviders } from '@l2beat/discovery'
import { loadEnv } from '../env/loadEnv'
import { createProviders } from '../env/providers'

export interface CommandContext {
  logger: Logger
  providers(): AllProviders
}

export interface ContextOptions {
  envFile?: string
  logger?: Logger
  /** Replaces V1's provider construction, for tests of the commands. */
  createProviders?: (logger: Logger) => AllProviders
}

export function createContext(options: ContextOptions = {}): CommandContext {
  const logger = options.logger ?? createCliLogger()
  const build = options.createProviders ?? createProviders
  let providers: AllProviders | undefined
  return {
    logger,
    providers() {
      if (providers === undefined) {
        const loaded = loadEnv(options.envFile)
        logger.info('Environment loaded', { file: loaded.file ?? 'none' })
        providers = build(logger)
      }
      return providers
    },
  }
}

export function createCliLogger(): Logger {
  return new Logger({
    level: 'INFO',
    transports: [new StderrTransport()],
  }).for('discovery-v2')
}

class StderrTransport implements LoggerTransport {
  private readonly format = formatPlain(utcTime)

  log(entry: LogEntry): void {
    process.stderr.write(`${this.format(entry)}\n`)
  }

  flush(): void {}
}
