export function neuterErrors(
  errors: Record<string, string>,
): Record<string, string> {
  return Object.keys(errors).reduce<Record<string, string>>((acc, key) => {
    // Set all error messages to a generic error message
    acc[key] = 'Processing error occurred.'
    return acc
  }, {})
}
