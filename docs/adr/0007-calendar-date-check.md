# 7. Calendar dates are checked by round trip

Status: accepted, 2026-11-21
Code: `packages/shared-pure/src/utils/dateStrings.ts`

`isDateOnly` parses the date and checks that `toISOString()` gives the same
day back. The regex alone accepts `2026-02-31`, and `Date.parse` rolls it over
to March 3rd without an error. The round trip rejects it.
