# 3. Retry policies

Status: accepted, 2026-11-21
Code: `packages/shared-pure/src/tools/Retries.ts`

`exponentialBackOff` takes `Infinity` to mean "no limit" in each of its
options: `maxAttempts` (retry forever), `maxDistanceMs` (no cap on the delay)
and `notifyAfterAttempts` (never notify).

On the last attempt it returns `notify: false`, because the caller reports the
final failure itself: `TaskQueue` logs "Stopping queue because of error". When
a queue sets `shouldStopAfterFailedRetries: false`, nothing logs that final
failure.
