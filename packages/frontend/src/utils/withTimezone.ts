/** Runs `fn` with the process in time zone `tz`, for tests of local-time bugs. */
export function withTimezone(tz: string, fn: () => void) {
  const original = process.env.TZ
  process.env.TZ = tz
  try {
    fn()
  } finally {
    // Assigning undefined would store the string "undefined"
    if (original === undefined) Reflect.deleteProperty(process.env, 'TZ')
    else process.env.TZ = original
  }
}
