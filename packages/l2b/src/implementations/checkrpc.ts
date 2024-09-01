enum FailureReason {
  Timeout = 'Response took too long',
  StatusCode = '429 Too Many Requests',
  Other = 'Other Error',
}

async function callRpc(
  blockNumber: number,
  rpcUrl: string,
  method: string,
  timeout: number,
  verbosity: number,
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
        params: [blockNumber.toString(16), false],
        id: blockNumber,
      }),
      signal: controller.signal,
    })

    clearTimeout(id)

    if (response.status === 200) {
      return null
    } else if (response.status === 429) {
      return FailureReason.StatusCode
    } else {
      if (verbosity > 1) console.log(response.status)
      return FailureReason.Other
    }
  } catch (error) {
    clearTimeout(id)

    if (error instanceof Error && error.name === 'AbortError') {
      return FailureReason.Timeout
    } else {
      if (verbosity > 1) console.log(error)
      return FailureReason.Other
    }
  }
}

async function runBatch(
  callRate: number,
  blockNumber: number,
  rpcUrl: string,
  method: string,
  timeout: number,
  batchDuration: number,
  minCallsToAbort: number,
  abortFailureThreshold: number,
  verbosity: number,
): Promise<{
  successes: number
  failures: Record<FailureReason, number>
  aborted: boolean
}> {
  const interval = batchDuration / callRate
  let successes = 0
  const failures: Record<FailureReason, number> = {
    [FailureReason.Timeout]: 0,
    [FailureReason.StatusCode]: 0,
    [FailureReason.Other]: 0,
  }
  let totalCalls = 0
  let aborted = false

  console.log(`Starting batch at ${callRate} calls/minute...`)

  const promises = Array.from({ length: callRate }, (_, i) => {
    return new Promise<void>((resolve) => {
      setTimeout(
        async () => {
          if (aborted) {
            return resolve()
          }

          const result = await callRpc(
            blockNumber + i,
            rpcUrl,
            method,
            timeout,
            verbosity,
          )
          totalCalls++

          if (result === null) {
            successes++
          } else {
            failures[result]++
          }

          if (!aborted) {
            process.stdout.write(
              `\rSuccesses: ${successes}, Failures (Timeout: ${
                failures[FailureReason.Timeout]
              }, Status Code: ${failures[FailureReason.StatusCode]}, Other: ${
                failures[FailureReason.Other]
              })`,
            )

            const totalFailures =
              failures[FailureReason.Timeout] +
              failures[FailureReason.StatusCode] +
              failures[FailureReason.Other]
            const failureRate = totalFailures / totalCalls

            if (
              totalCalls > minCallsToAbort &&
              failureRate >= abortFailureThreshold
            ) {
              aborted = true
              console.log(
                `\nAborting batch due to high failure rate (${Math.floor(
                  failureRate * 100,
                )}%) after ${totalCalls} calls.`,
              )
            }
          }

          resolve()
        },
        interval * i + Math.random() * 50,
      )
    })
  })

  await Promise.all(promises)

  console.log()
  if (!aborted && verbosity > 0) {
    console.log(
      `Batch at ${callRate} calls/min: ${successes} successes, Failures (Timeout: ${
        failures[FailureReason.Timeout]
      }, Status Code: ${failures[FailureReason.StatusCode]}, Other: ${
        failures[FailureReason.Other]
      })`,
    )
  }

  return { successes, failures, aborted }
}

export async function findRateLimit({
  rpcUrl,
  method,
  lowerBoundary,
  upperBoundary,
  batchDuration,
  batchDelay,
  maxBatches,
  timeout,
  minSuccessRatio,
  abortFailureThreshold,
  minCallsToAbort,
  verbosity,
}: {
  rpcUrl: string
  method: string
  lowerBoundary: number
  upperBoundary: number
  batchDuration: number
  batchDelay: number
  maxBatches: number
  timeout: number
  minSuccessRatio: number
  abortFailureThreshold: number
  minCallsToAbort: number
  verbosity: number
}) {
  let blockNumber = 1

  const isBatchSuccessful = (successes: number, totalCalls: number) =>
    successes / totalCalls >= minSuccessRatio

  let { successes, aborted } = await runBatch(
    lowerBoundary,
    blockNumber,
    rpcUrl,
    method,
    timeout,
    batchDuration,
    minCallsToAbort,
    abortFailureThreshold,
    verbosity,
  )
  if (aborted || !isBatchSuccessful(successes, lowerBoundary)) {
    console.error('Rate limit is below the lower boundary.')
    return
  }

  let lowerRate = lowerBoundary
  let upperRate = upperBoundary

  for (let i = 1; i <= maxBatches; i++) {
    const testRate = Math.floor((lowerRate + upperRate) / 2)
    ;({ successes, aborted } = await runBatch(
      testRate,
      blockNumber,
      rpcUrl,
      method,
      timeout,
      batchDuration,
      minCallsToAbort,
      abortFailureThreshold,
      verbosity,
    ))
    blockNumber += testRate

    let pauseNeeded = false

    if (aborted || !isBatchSuccessful(successes, testRate)) {
      upperRate = testRate
      pauseNeeded = true
    } else {
      lowerRate = testRate
    }

    if (verbosity > 1) {
      console.log(`New bounds: lower=${lowerRate}, upper=${upperRate}`)
    }

    if (upperRate - lowerRate <= 1) {
      break
    }

    if (pauseNeeded) {
      console.log(`Pausing for ${batchDelay / 1000} seconds...`)
      await new Promise((res) => setTimeout(res, batchDelay))
    }
  }

  console.log(`Estimated rate limit: ${lowerRate} calls/min`)
}
