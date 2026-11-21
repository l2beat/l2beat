# 5. UnixTime is a plain number

Status: accepted, 2026-11-21
Code: `packages/shared-pure/src/types/UnixTime.ts`

`UnixTime` is `number`, not a branded type. A brand would force a cast or a
`UnixTime(...)` call at every arithmetic step, which made it too cumbersome to
use. So the type gives no safety: it is a set of helpers for working with
whole-second timestamps, and `UnixTime(...)` only checks that a value is an
integer before the year 3000.
