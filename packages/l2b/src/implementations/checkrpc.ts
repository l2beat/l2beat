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
  batchOnly: boolean
  lowerBoundary: number
  upperBoundary: number
  retryDelayMs: number
  maxBatches: number
  minSuccessRatio: number
  logLevel: LogLevel
}

interface BatchTestResult {
  batchSize: number
  success: boolean
  latency?: number
}

async function callBatchRpc(
  batchSize: number,
  startBlockNumber: number,
  rpcUrl: string,
  method: string,
  timeout: number,
): Promise<{ success: boolean; latency: number; error?: string }> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  const startTime = Date.now()

  try {
    const requests = Array.from({ length: batchSize }, (_, i) => ({
      jsonrpc: '2.0',
      method,
      params: ['0x' + (startBlockNumber + i).toString(16), false],
      id: startBlockNumber + i,
    }))

    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requests),
      signal: controller.signal,
    })

    clearTimeout(id)
    const latency = Date.now() - startTime

    if (response.status === 200) {
      const data = await response.json()

      if (Array.isArray(data) && data.length === batchSize) {
        const allValid = data.every((item) => item.id !== undefined)
        return { success: allValid, latency }
      }

      return { success: false, latency, error: 'Invalid response format' }
    }

    if (response.status === 429) {
      return { success: false, latency, error: 'Rate limited (429)' }
    }

    return { success: false, latency, error: `HTTP ${response.status}` }
  } catch (error) {
    clearTimeout(id)
    const latency = Date.now() - startTime

    if (error instanceof Error && error.name === 'AbortError') {
      return { success: false, latency, error: 'Timeout' }
    }

    return {
      success: false,
      latency,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

async function findMaxBatchSize(
  startSize: number,
  maxTestSize: number,
  rpcUrl: string,
  method: string,
  timeoutMs: number,
  logger: Logger,
): Promise<number> {
  let low = startSize
  let high = maxTestSize
  let maxSize = startSize

  while (low <= high) {
    const testSize = Math.floor((low + high) / 2)
    const result = await callBatchRpc(testSize, 1, rpcUrl, method, timeoutMs)

    const statusPadded = (result.success ? 'OK' : 'FAIL').padStart(8)
    const statusColored = result.success
      ? chalk.green(statusPadded)
      : chalk.red(statusPadded)
    const latencyStr = result.success
      ? `${result.latency}ms`
      : (result.error ?? 'Unknown error')

    logger.info(
      `    Testing ${testSize.toString().padStart(4)}: ${statusColored} | ${latencyStr.padStart(20)} | range: ${low}-${high}`,
    )

    if (result.success) {
      maxSize = testSize
      low = testSize + 1
    } else {
      high = testSize - 1
    }
  }

  return maxSize
}

async function checkBatchSupport(
  rpcUrl: string,
  method: string,
  timeoutMs: number,
  logger: Logger,
): Promise<number> {
  const fixedTestSizes = [1, 2, 5, 10]
  const results: BatchTestResult[] = []

  logger.info('')
  logger.info(chalk.bold('Batch Request Support'))

  for (const batchSize of fixedTestSizes) {
    const result = await callBatchRpc(batchSize, 1, rpcUrl, method, timeoutMs)
    results.push({
      batchSize,
      success: result.success,
      latency: result.latency,
    })

    const status = result.success ? 'OK' : 'FAIL'
    const statusColored = result.success
      ? chalk.green(status)
      : chalk.red(status)
    const latencyStr = result.success
      ? `${result.latency}ms`
      : (result.error ?? 'Unknown error')

    logger.info(
      `  ${batchSize.toString().padStart(2)}: ${statusColored.padStart(8)} | ${latencyStr.padStart(20)}`,
    )
  }

  const supportsSmallBatches = results.slice(0, 4).every((r) => r.success)

  let maxSize = results
    .filter((r) => r.success)
    .reduce((max, r) => Math.max(max, r.batchSize), 0)

  if (supportsSmallBatches) {
    logger.info('')
    logger.info('  Finding maximum batch size...')

    const maxTestSize = 5000
    const foundMaxSize = await findMaxBatchSize(
      10,
      maxTestSize,
      rpcUrl,
      method,
      timeoutMs,
      logger,
    )

    if (foundMaxSize > 10) {
      logger.info(
        `  Maximum batch size: ${chalk.green(foundMaxSize.toString())}`,
      )
      maxSize = foundMaxSize
    } else {
      logger.info(`  Maximum batch size: ${chalk.green('10')}`)
    }
  }

  logger.info('')
  if (maxSize > 0) {
    logger.info(`Batching ${chalk.green('SUPPORTED')} (max: ${maxSize})`)
  } else {
    logger.info(chalk.red('Batching not supported'))
  }
  logger.info('')

  return maxSize
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
    logger.debug(`Got HTTP code: ${chalk.yellow(response.status.toString())}`)
    return FailureReason.OtherStatus
  } catch (error) {
    clearTimeout(id)

    if (error instanceof Error && error.name === 'AbortError') {
      return FailureReason.Timeout
    }
    logger.debug(chalk.red(error))
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

  const logProgress = () => {
    const totalFailures =
      failures[FailureReason.Timeout] +
      failures[FailureReason.Status429] +
      failures[FailureReason.OtherStatus] +
      failures[FailureReason.Other]
    const failureRate = totalFailures / (totalCalls || 1)
    const successRate = successes / totalCalls

    process.stdout.write(
      `\r  ${chalk.bold(callRate.toString())} calls/min | ` +
        `${chalk.green(
          (successRate * 100).toFixed(1).padStart(5),
        )}% success | ` +
        `${chalk.red((failureRate * 100).toFixed(1).padStart(5))}% fail | ` +
        `${totalCalls.toString().padStart(4)}/${callRate
          .toString()
          .padStart(4)} calls`,
    )
  }

  process.stdout.write('\n  ')

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

          logProgress()

          const totalFailures =
            failures[FailureReason.Timeout] +
            failures[FailureReason.Status429] +
            failures[FailureReason.OtherStatus] +
            failures[FailureReason.Other]
          const failureRate = totalFailures / totalCalls

          if (
            totalCalls > config.minCallsToAbort &&
            failureRate >= config.maxFailureRatio
          ) {
            aborted = true
            process.stdout.write(
              `\r  ${chalk.red('ABORTED')} after ${totalCalls} calls (${Math.floor(
                failureRate * 100,
              )}% failures)\n`,
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
    logProgress()
    process.stdout.write('\n')
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

export interface RateLimitResults {
  batchSize: number
  rateLimit?: number
}

export async function findRateLimit(
  config: Configuration,
): Promise<RateLimitResults> {
  const logger = getPlainLogger()

  logger.info(chalk.bold('RPC Rate Limit Checker\n'))

  const batchSize = await checkBatchSupport(
    config.rpcUrl,
    config.method,
    config.timeoutMs,
    logger,
  )

  if (config.batchOnly) {
    return { batchSize }
  }

  logger.info(chalk.bold('Finding rate limit...\n'))

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
    logger.info(chalk.red('✗ Rate limit is below the lower boundary.'))
    return { batchSize, rateLimit: lowerRate }
  }

  logger.info(`  Lower bound test ${chalk.green('PASSED')}`)

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

    logger.info(
      `  Rate bounds: ${lowerRate.toString().padStart(4)} - ${upperRate.toString().padStart(4)} calls/min`,
    )

    if (upperRate - lowerRate <= 1) {
      break
    }

    if (pauseNeeded) {
      logger.info('')
      logger.info(`  Pausing for ${config.retryDelayMs / 1000}s...`)
      await new Promise((res) => setTimeout(res, config.retryDelayMs))
    }
  }

  logger.info('')
  logger.info(
    chalk.bold(
      `Estimated rate limit: ${chalk.green(lowerRate.toString())} calls/min`,
    ),
  )

  return { batchSize, rateLimit: lowerRate }
}
