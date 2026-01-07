import type { Logger, LogLevel } from '@l2beat/backend-tools'
import chalk from 'chalk'
import { getPlainLogger } from './common/getPlainLogger'

enum FailureReason {
  Timeout = 'Response took too long',
  Status429 = 'Response: 429 Too Many Requests',
  OtherStatus = 'Response: Other Status Code',
  Other = 'Other Error',
}

interface BatchConfiguration {
  rpcUrl: string
  method: string
  timeoutMs: number
  batchDurationMs: number
  minCallsToAbort: number
  maxFailureRatio: number
}

export type Configuration = BatchConfiguration & {
  lowerBoundary: number
  upperBoundary: number
  retryDelayMs: number
  maxBatches: number
  minSuccessRatio: number
  logLevel: LogLevel
}

async function callRpc(
  blockNumber: number,
  rpcUrl: string,
  method: string,
  timeout: number,
  logger: Logger,
): Promise<FailureReason | null> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: method,
        params: ['0x' + blockNumber.toString(16), false],
        id: blockNumber,
      }),
      signal: controller.signal,
    })

    clearTimeout(id)

    if (response.status === 200) {
      return null
    }
    if (response.status === 429) {
      return FailureReason.Status429
    }
    logger.info(`Got HTTP code: ${chalk.yellow(response.status.toString())}`)
    return FailureReason.OtherStatus
  } catch (error) {
    clearTimeout(id)

    if (error instanceof Error && error.name === 'AbortError') {
      return FailureReason.Timeout
    }
    logger.info(chalk.red(error))
    return FailureReason.Other
  }
}

async function runBatch(
  callRate: number,
  blockNumber: number,
  config: BatchConfiguration,
  logger: Logger,
): Promise<{
  successes: number
  failures: Record<FailureReason, number>
  aborted: boolean
}> {
  const interval = config.batchDurationMs / callRate
  let successes = 0
  const failures: Record<FailureReason, number> = {
    [FailureReason.Timeout]: 0,
    [FailureReason.Status429]: 0,
    [FailureReason.OtherStatus]: 0,
    [FailureReason.Other]: 0,
  }
  let totalCalls = 0
  let aborted = false

  logger.info(`Starting batch at ${callRate} calls/minute...`)

  const promises = Array.from({ length: callRate }, (_, i) => {
    return new Promise<void>((resolve) => {
      setTimeout(
        async () => {
          if (aborted) {
            return resolve()
          }

          const result = await callRpc(
            blockNumber + i,
            config.rpcUrl,
            config.method,
            config.timeoutMs,
            logger,
          )
          totalCalls++

          if (result === null) {
            successes++
          } else {
            failures[result]++
          }

          if (aborted) {
            resolve()
          }

          const totalFailures =
            failures[FailureReason.Timeout] +
            failures[FailureReason.Status429] +
            failures[FailureReason.OtherStatus] +
            failures[FailureReason.Other]
          const failureRate = totalFailures / totalCalls
          logger.info(
            [
              chalk.green(`Successes: ${successes}`),
              chalk.red(`Failures: ${totalFailures}`),
              `(${[
                `Timeout: ${chalk.yellow(failures[FailureReason.Timeout])}`,
                `Status 429: ${chalk.yellow(
                  failures[FailureReason.Status429],
                )}`,
                `Other Status: ${chalk.yellow(
                  failures[FailureReason.OtherStatus],
                )}`,
                `Other: ${chalk.yellow(failures[FailureReason.Other])}`,
              ].join(', ')})`,
              `Failure rate: ${chalk.magenta(Math.floor(failureRate * 100))}%`,
            ].join(' '),
          )

          if (
            totalCalls > config.minCallsToAbort &&
            failureRate >= config.maxFailureRatio
          ) {
            aborted = true
            logger.info(
              chalk.red(
                `\nAborting batch due to high failure rate (${Math.floor(
                  failureRate * 100,
                )}%) after ${totalCalls} calls.`,
              ),
            )
          }

          resolve()
        },
        interval * i + Math.random() * 50,
      )
    })
  })

  await Promise.all(promises)

  if (!aborted) {
    logger.info(
      `Batch at ${callRate} calls/min: ${successes} successes, Failures (Timeout: ${
        failures[FailureReason.Timeout]
      }, Status 429: ${failures[FailureReason.Status429]}, Other Status: ${
        failures[FailureReason.OtherStatus]
      }, Other: ${failures[FailureReason.Other]}),`,
    )
  }

  return { successes, failures, aborted }
}

function isBatchSuccessful(
  successes: number,
  totalCalls: number,
  config: Configuration,
): boolean {
  return successes / totalCalls >= config.minSuccessRatio
}

export async function findRateLimit(config: Configuration) {
  const logger = getPlainLogger()
  let blockNumber = 1

  let lowerRate = config.lowerBoundary
  let upperRate = config.upperBoundary

  let { successes, aborted } = await runBatch(
    lowerRate,
    blockNumber,
    config,
    logger,
  )
  if (aborted || !isBatchSuccessful(successes, lowerRate, config)) {
    logger.info(chalk.red('Rate limit is below the lower boundary.'))
    return
  }

  for (let i = 1; i <= config.maxBatches; i++) {
    const testRate = Math.floor((lowerRate + upperRate) / 2)
    ;({ successes, aborted } = await runBatch(
      testRate,
      blockNumber,
      config,
      logger,
    ))
    blockNumber += testRate

    const pauseNeeded =
      aborted || !isBatchSuccessful(successes, testRate, config)

    if (pauseNeeded) {
      upperRate = testRate
    } else {
      lowerRate = testRate
    }

    logger.info(`New bounds: lower=${lowerRate}, upper=${upperRate}`)

    if (upperRate - lowerRate <= 1) {
      break
    }

    if (pauseNeeded) {
      logger.info(
        chalk.yellow(`Pausing for ${config.retryDelayMs / 1000} seconds...`),
      )
      await new Promise((res) => setTimeout(res, config.retryDelayMs))
    }
  }

  logger.info(chalk.green(`Estimated rate limit: ${lowerRate} calls/min`))
}
